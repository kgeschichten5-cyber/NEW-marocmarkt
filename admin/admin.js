const config = window.MAROCMARKT_SUPABASE || {};
const client = window.supabase?.createClient && config.url && config.anonKey
  ? window.supabase.createClient(config.url, config.anonKey)
  : null;

const loginForm = document.getElementById('adminLoginForm');
const mfaStep = document.getElementById('adminMfaStep');
const mfaForm = document.getElementById('adminMfaForm');
const setupForm = document.getElementById('adminSetupForm');
const message = document.getElementById('adminLoginMessage');
const instructions = document.getElementById('adminMfaInstructions');
const qrImage = document.getElementById('adminMfaQr');
let factorId = '';
let challengeId = '';

function showError(error) {
  message.textContent = error?.message || String(error);
}

async function prepareMfa() {
  const { data, error } = await client.auth.mfa.listFactors();
  if (error) throw error;

  loginForm.hidden = true;
  mfaStep.hidden = false;
  const factor = (data.totp || []).find((item) => item.status === 'verified');
  if (factor) {
    factorId = factor.id;
    instructions.textContent = 'Gib den aktuellen Code aus deiner Authenticator-App ein.';
    qrImage.hidden = true;
  } else {
    const { data: enrolled, error: enrollError } = await client.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'Marocmarkt Super-Administrator'
    });
    if (enrollError) throw enrollError;
    factorId = enrolled.id;
    instructions.textContent = 'Scanne den QR-Code mit deiner Authenticator-App und bestätige anschließend den generierten Code.';
    qrImage.src = enrolled.totp.qr_code;
    qrImage.hidden = false;
  }

  const { data: challenge, error: challengeError } = await client.auth.mfa.challenge({ factorId });
  if (challengeError) throw challengeError;
  challengeId = challenge.id;
}

async function redirectToDashboard() {
  const { data: role, error } = await client.rpc('get_platform_admin_role');
  if (error) throw error;
  if (!role) {
    setupForm.hidden = false;
    instructions.textContent = 'Dieses Konto hat noch keine Admin-Rolle. Löse den einmaligen Token ein, den du im Supabase SQL Editor erzeugt hast.';
    return;
  }
  window.location.replace('/?admin=1');
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.textContent = '';
  if (!client) {
    showError(new Error('Supabase ist nicht konfiguriert. Prüfe supabase-config.js.'));
    return;
  }
  const button = loginForm.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    const { error } = await client.auth.signInWithPassword({
      email: document.getElementById('adminEmail').value.trim(),
      password: document.getElementById('adminPassword').value
    });
    if (error) throw error;
    document.getElementById('adminPassword').value = '';
    await prepareMfa();
  } catch (error) {
    showError(error);
  } finally {
    button.disabled = false;
  }
});

mfaForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.textContent = '';
  const button = mfaForm.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    const { error } = await client.auth.mfa.verify({
      factorId,
      challengeId,
      code: document.getElementById('adminMfaCode').value.trim()
    });
    if (error) throw error;
    document.getElementById('adminMfaCode').value = '';
    mfaForm.hidden = true;
    await redirectToDashboard();
  } catch (error) {
    showError(error);
  } finally {
    button.disabled = false;
  }
});

setupForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.textContent = '';
  const button = setupForm.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    const { data, error } = await client.rpc('bootstrap_super_admin', {
      setup_token: document.getElementById('adminSetupToken').value.trim()
    });
    if (error) throw error;
    if (data !== 'super_admin') throw new Error('Das Super-Admin-Konto konnte nicht bestätigt werden.');
    document.getElementById('adminSetupToken').value = '';
    window.location.replace('/?admin=1');
  } catch (error) {
    showError(error);
  } finally {
    button.disabled = false;
  }
});
