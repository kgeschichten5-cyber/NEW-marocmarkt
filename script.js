const listings = [
  {
    id: 1,
    title: 'Dacia Logan – guter Zustand',
    price: 69000,
    city: 'Casablanca',
    category: 'Autos',
    description: 'Gepflegter Dacia Logan mit gutem Motor, neuer Batterie und regelmäßiger Wartung. Ideal für Stadt und Langstrecke.',
    image: './assets/car.svg',
    seller: 'user-1',
    sellerName: 'Mourad K.',
    date: '2026-10-30',
    featured: true
  },
  {
    id: 2,
    title: 'Wohnung mit Balkon',
    price: 4200,
    city: 'Rabat',
    category: 'Immobilien',
    description: 'Helle 2-Zimmer-Wohnung mit Balkon, guter Lage, nah an Supermärkten, Schulen und öffentlichen Verkehrsmitteln.',
    image: './assets/apartment.svg',
    seller: 'user-2',
    sellerName: 'Sara A.',
    date: '2026-10-25',
    featured: true
  },
  {
    id: 3,
    title: 'Smartphone 128 GB',
    price: 2500,
    city: 'Marrakesch',
    category: 'Elektronik',
    description: 'Gebrauchtes Smartphone in gutem Zustand, voll funktionsfähig, mit Originalverpackung und Ladegerät.',
    image: './assets/phone.svg',
    seller: 'user-3',
    sellerName: 'Youssef D.',
    date: '2026-10-21',
    featured: false
  },
  {
    id: 4,
    title: 'Sofa 3-Sitzer',
    price: 1800,
    city: 'Tanger',
    category: 'Möbel',
    description: 'Modernes 3-Sitzer-Sofa aus hochwertigem Stoff, sehr bequem und in gepflegtem Zustand.',
    image: './assets/sofa.svg',
    seller: 'user-4',
    sellerName: 'Leila M.',
    date: '2026-10-29',
    featured: true
  },
  {
    id: 5,
    title: 'Laptop 14 Zoll',
    price: 3200,
    city: 'Agadir',
    category: 'Elektronik',
    description: 'Leichtes und schnelles Laptop für Arbeit und Alltag. Voll funktionsfähig mit SSD, 8 GB RAM und Windows.',
    image: './assets/laptop.svg',
    seller: 'user-5',
    sellerName: 'Nadia S.',
    date: '2026-10-18',
    featured: true
  },
  {
    id: 6,
    title: 'Wellensittich mit Käfig',
    price: 900,
    city: 'Fès',
    category: 'Haustiere',
    description: 'Fröhlicher Wellensittich mit geräumigem Käfig und Zubehör. Nur in liebevolle Hände abzugeben.',
    image: './assets/haustiere.png',
    seller: 'user-6',
    sellerName: 'Hassan O.',
    date: '2026-10-22',
    featured: false
  },
  {
    id: 7,
    title: 'Mountainbike 2024',
    price: 4200,
    city: 'Meknès',
    category: 'Freizeit',
    description: 'Leichtes Mountainbike mit neuem Antrieb und gutem Zustand, perfekt für Ausflüge in der Natur.',
    image: './assets/bike.svg',
    seller: 'user-7',
    sellerName: 'Imane R.',
    date: '2026-10-27',
    featured: false
  },
  {
    id: 8,
    title: 'Laptop-Desk und Schreibtischstuhl',
    price: 1100,
    city: 'Oujda',
    category: 'Haus & Garten',
    description: 'Komfortabler Schreibtischstuhl und ergonomischer Schreibtisch für Homeoffice, nahezu neu.',
    image: './assets/workspace.svg',
    seller: 'user-8',
    sellerName: 'Amine T.',
    date: '2026-10-19',
    featured: false
  }
];

const supabaseConfig = window.MAROCMARKT_SUPABASE || {};
const supabaseClient = window.supabase?.createClient && supabaseConfig.url && supabaseConfig.anonKey
  ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey)
  : null;
const listingGrid = document.getElementById('listingGrid');
const popularGrid = document.getElementById('popularGrid');
const searchInput = document.getElementById('searchInput');
const cityFilter = document.getElementById('cityFilter');
const navCityFilter = document.getElementById('navCityFilter');
const categoryFilter = document.getElementById('categoryFilter');
const sortSelect = document.getElementById('sortSelect');
const minimumPriceInput = document.getElementById('minimumPriceInput');
const maximumPriceInput = document.getElementById('maximumPriceInput');
const langButtons = document.querySelectorAll('.lang-btn');
const sellButton = document.getElementById('sellButton');
const adDialog = document.getElementById('adDialog');
const closeAdDialogButton = document.getElementById('closeAdDialogButton');
const cancelAdButton = document.getElementById('cancelAdButton');
const deleteAdButton = document.getElementById('deleteAdButton');
const adForm = document.getElementById('adForm');
const selectedImages = document.getElementById('selectedImages');
const imagesInput = document.getElementById('imagesInput');
const formError = document.getElementById('formError');
const listingDialog = document.getElementById('listingDialog');
const listingDetailContent = document.getElementById('listingDetailContent');
const closeDialogButton = document.getElementById('closeDialogButton');

const favorites = new Set();
const complaintList = document.getElementById('complaintList');
const complaintDialog = document.getElementById('complaintDialog');
const complaintForm = document.getElementById('complaintForm');
const complaintTarget = document.getElementById('complaintTarget');
const complaintsButton = document.getElementById('complaintsButton');
const complaintCloseButton = document.getElementById('closeComplaintDialogButton');
const cancelComplaintButton = document.getElementById('cancelComplaintButton');
const complaintInfo = document.getElementById('complaintInfo');
const appNotice = document.getElementById('appNotice');
const loginButton = document.getElementById('loginButton');
const messageNotificationsButton = document.getElementById('messageNotificationsButton');
const unreadMessageCount = document.getElementById('unreadMessageCount');
const logoutButton = document.getElementById('logoutButton');
const authDialog = document.getElementById('authDialog');
const authForm = document.getElementById('authForm');
const authNameField = document.getElementById('authNameField');
const authAddressField = document.getElementById('authAddressField');
const authPhoneField = document.getElementById('authPhoneField');
const authOtpField = document.getElementById('authOtpField');
const authError = document.getElementById('authError');
const accountDialog = document.getElementById('accountDialog');
const accountContent = document.getElementById('accountContent');
const chatDialog = document.getElementById('chatDialog');
const chatForm = document.getElementById('chatForm');
const chatMessages = document.getElementById('chatMessages');
const chatMessageInput = document.getElementById('chatMessageInput');
const chatHeading = document.getElementById('chatHeading');
const adminAccessButton = document.getElementById('adminAccessButton');
const adminLoginDialog = document.getElementById('adminLoginDialog');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminLoginError = document.getElementById('adminLoginError');
const adminMfaPanel = document.getElementById('adminMfaPanel');
const adminMfaInstructions = document.getElementById('adminMfaInstructions');
const adminMfaQr = document.getElementById('adminMfaQr');
const adminMfaForm = document.getElementById('adminMfaForm');
const adminSetupForm = document.getElementById('adminSetupForm');
const adminDashboardDialog = document.getElementById('adminDashboardDialog');
const adminNotificationList = document.getElementById('adminNotificationList');
const adminListingList = document.getElementById('adminListingList');
const adminReportList = document.getElementById('adminReportList');
const adminAppealList = document.getElementById('adminAppealList');
const adminAuditList = document.getElementById('adminAuditList');
const adminManagementSection = document.getElementById('adminManagementSection');
const adminRoster = document.getElementById('adminRoster');
let currentUser = null;
let currentProfile = null;
let authMode = 'signin';
let phoneVerificationPendingFor = '';
let phoneVerificationSending = false;
let currentEditingListing = null;
let currentReportListing = null;
let activeConversation = null;
let chatRefreshTimer = null;
let notificationRefreshTimer = null;
let accountTab = 'listings';
let adminMfaFactorId = '';
let adminMfaChallengeId = '';
let adminRole = '';

function getPrimaryImage(item) {
  if (Array.isArray(item.images) && item.images.length > 0) {
    return item.images[0];
  }
  return item.image || './assets/placeholder.svg';
}

const translations = {
  de: {
    languageLabel: 'Sprache wählen',
    logoutButton: 'Abmelden',
    accountTitle: 'Mein Marocmarkt',
    myListings: 'Meine Anzeigen',
    myFavorites: 'Favoriten',
    myMessages: 'Nachrichten',
    messagesLabel: 'Nachrichten',
    emptyAccount: 'Du hast noch keine Anzeigen aufgegeben.',
    emptyFavorites: 'Noch keine Favoriten gespeichert.',
    emptyMessages: 'Noch keine Nachrichten.',
    authCreateAccount: 'Konto erstellen',
    authHaveAccount: 'Ich habe schon ein Konto',
    accountNameLabel: 'Name',
    accountAddressLabel: 'Adresse',
    accountPhoneLabel: 'Telefonnummer (international, z. B. +212…)',
    authEmailLabel: 'E-Mail',
    authPasswordLabel: 'Passwort',
    phoneOtpLabel: 'SMS-Bestätigungscode',
    phoneOtpTitle: 'Telefonnummer bestätigen',
    phoneOtpResend: 'Code erneut senden',
    phoneOtpVerify: 'Telefon bestätigen',
    contactSaveButton: 'Daten speichern',
    phoneOtpSent: 'Wir haben einen Bestätigungscode per SMS gesendet.',
    phoneOtpVerified: 'Telefonnummer bestätigt. Du kannst jetzt Anzeigen aufgeben.',
    phoneOtpRequired: 'Bitte gib den SMS-Code ein.',
    phoneInvalid: 'Bitte gib eine gültige Telefonnummer im internationalen Format ein (z. B. +212…).',
    contactDetailsRequired: 'Bitte gib deine Adresse und Telefonnummer ein.',
    phoneVerificationRequired: 'Bestätige deine Telefonnummer per SMS, bevor du Anzeigen aufgibst.',
    forgotPassword: 'Passwort vergessen?',
    resetPasswordSent: 'Wir haben dir einen Link zum Zurücksetzen deines Passworts per E-Mail gesendet.',
    newPasswordLabel: 'Neues Passwort',
    passwordUpdated: 'Dein Passwort wurde geändert. Du kannst dich jetzt anmelden.',
    passwordRequired: 'Bitte gib eine gültige E-Mail-Adresse ein.',
    authConfirmEmail: 'Bitte bestätige deine E-Mail-Adresse über den Link in deinem Postfach.',
    backendNotConfigured: 'Das Backend ist noch nicht verbunden. Bitte trage die Supabase-Projekt-URL und den öffentlichen Anon-Key in supabase-config.js ein.',
    backendUnavailable: 'Die Backend-Verbindung ist fehlgeschlagen. Bitte versuche es später erneut.',
    authRequired: 'Bitte melde dich an, um diese Funktion zu nutzen.',
    contactSeller: 'Verkäufer kontaktieren',
    editListing: 'Bearbeiten',
    deleteListing: 'Löschen',
    adminDeleteListing: 'Als Admin löschen',
    reportButton: 'Anzeige melden',
    messageLabel: 'Nachricht',
    sendMessage: 'Senden',
    listingSaved: 'Anzeige gespeichert.',
    listingDeleted: 'Anzeige gelöscht.',
    reportSent: 'Meldung gesendet.',
    messageSent: 'Nachricht gesendet.',
    messageListing: 'Anzeige',
    reportAdminHeading: 'Moderation: Meldungen',
    removeReportedListing: 'Anzeige entfernen',
    noReports: 'Keine offenen Meldungen.',
    markResolved: 'Erledigen',
    dismissReport: 'Ablehnen',
    uploadImageLimit: 'Bilder dürfen höchstens 5 MB groß sein und müssen JPG, PNG oder WebP sein.',
    imageStorageUnavailable: 'Der Supabase-Bildspeicher „listing-images“ fehlt. Bitte führe den Storage-Teil aus supabase/schema.sql im SQL Editor aus.',
    pageTitle: 'Marocmarkt | Kleinanzeigen in Marokko',
    pageDescription: 'Marocmarkt ist deine lokale Kleinanzeigenplattform für Marokko.',
    topLand: 'Land',
    heroEyebrow: 'Lokale Angebote in Marokko',
    heroTitle: 'Finde schnell, was du suchst.',
    heroText: 'Von Autos und Wohnungen bis hin zu Technik, Möbeln und Jobs – Marocmarkt bringt Menschen in ganz Marokko zusammen.',
    searchLabel: 'Was suchst du?',
    whereLabel: 'Wo?',
    categoryLabel: 'Kategorie',
    findButton: 'Finden',
    serviceEyebrow: 'Dienstleistungen',
    serviceTitle: 'Professionelle Hilfe für Zuhause und Geschäft',
    serviceText: 'Von Reparaturen und Montage bis hin zu Reinigung, Transport und Beratung – finde schnell zuverlässige Experten in deiner Nähe.',
    servicePoint1: 'Reparatur & Montage',
    servicePoint2: 'Haus & Garten',
    servicePoint3: 'Transport & Lieferung',
    serviceButton: 'Mehr erfahren',
    categoryEyebrow: 'Beliebte Bereiche',
    categoryHeading: 'Kategorien',
    categoryAutos: 'Autos',
    categoryProperties: 'Immobilien',
    categoryElectronics: 'Elektronik',
    categoryFurniture: 'Möbel',
    categoryFashion: 'Mode',
    categoryJobs: 'Jobs',
    categoryLeisure: 'Freizeit',
    categoryPets: 'Haustiere',
    categoryHomeGarden: 'Haus & Garten',
    categoryGifts: 'Geschenke',
    topCities: 'Städte',
    allCities: 'Alle Städte',
    latestEyebrow: 'Neu eingetroffen',
    latestHeading: 'Neueste Anzeigen',
    sortLabel: 'Sortieren',
    minimumPrice: 'Mindestpreis (MAD)',
    maximumPrice: 'Höchstpreis (MAD)',
    popularEyebrow: 'Top-Aktionen',
    popularHeading: 'Beliebte Anzeigen',
    loginButton: 'Anmelden',
    sellButton: 'Anzeige aufgeben',
    adDialogTitle: 'Anzeige aufgeben',
    formTitle: 'Titel',
    formPrice: 'Preis (MAD)',
    formCategory: 'Kategorie',
    formCity: 'Stadt',
    formDescription: 'Beschreibung',
    formImages: 'Bilder (max. 10)',
    chooseOption: 'Bitte wählen',
    formCancel: 'Abbrechen',
    formSubmit: 'Anzeige veröffentlichen',
    newLabel: 'Neu',
    detailLocation: 'Ort',
    detailPublished: 'Veröffentlicht',
    detailCategory: 'Kategorie',
    detailClose: 'Schließen',
    complaintButton: 'Beschwerden',
    moderationHeading: 'Beschwerden & Moderation',
    complaintModalTitle: 'Beschwerde melden',
    complaintTargetLabel: 'Betroffene Anzeige / Nutzer',
    complaintReasonLabel: 'Grund',
    complaintMessageLabel: 'Beschreibung',
    complaintSubmit: 'Meldung senden',
    complaintCancel: 'Abbrechen',
    complaintEmpty: 'Keine Beschwerden bisher.',
    complaintStatusNew: 'neu',
    complaintStatusBlocked: 'blockiert',
    complaintStatusNewLabel: 'Neu',
    complaintStatusBlockedLabel: 'Blockiert',
    complaintInfoDefault: 'Bitte wähle den betroffenen Nutzer oder die Anzeige.',
    complaintForPrefix: 'Beschwerde für:',
    complaintBlock: 'Nutzer blockieren',
    complaintValidation: 'Bitte fülle alle Felder aus.',
    newProfile: 'Neues Profil',
    favoriteAdd: 'Zu Favoriten hinzufügen',
    favoriteRemove: 'Aus Favoriten entfernen',
    listingDetails: 'Anzeigen-Details',
    emptyListings: 'Keine Anzeigen gefunden. Versuche andere Suchbegriffe oder filtere nach Stadt oder Kategorie.',
    searchPlaceholder: 'z. B. Dacia, Sofa, Wohnung',
    titlePlaceholder: 'z. B. Dacia Logan',
    descriptionPlaceholder: 'Beschreibe dein Angebot detailliert...',
    complaintPlaceholder: 'Beschreibe die Situation kurz und klar...',
    categoryNames: {
      Autos: 'Autos',
      Immobilien: 'Immobilien',
      Elektronik: 'Elektronik',
      Möbel: 'Möbel',
      Mode: 'Mode',
      Jobs: 'Jobs',
      Freizeit: 'Freizeit',
      Haustiere: 'Haustiere',
      'Haus & Garten': 'Haus & Garten',
      Geschenke: 'Geschenke'
    },
    validationTitle: 'Bitte gib einen gültigen Titel mit mindestens 3 Zeichen ein.',
    validationPrice: 'Bitte gib einen gültigen Preis in MAD ein.',
    validationCategory: 'Bitte wähle eine Kategorie aus.',
    validationCity: 'Bitte wähle eine Stadt aus.',
    validationDescription: 'Bitte gib eine Beschreibung mit mindestens 20 Zeichen ein.',
    validationImagesLimit: 'Du kannst bis zu 10 Bilder hochladen.',
    validationImageType: 'Nur Bilddateien sind erlaubt.',
    validationImageRead: 'Das Bild konnte nicht gelesen werden.'
  },
  ar: {
    languageLabel: 'اختر اللغة',
    logoutButton: 'تسجيل الخروج',
    accountTitle: 'حسابي في Marocmarkt',
    myListings: 'إعلاناتي',
    myFavorites: 'المفضلة',
    myMessages: 'الرسائل',
    messagesLabel: 'الرسائل',
    emptyAccount: 'لم تنشر أي إعلانات بعد.',
    emptyFavorites: 'لا توجد إعلانات مفضلة بعد.',
    emptyMessages: 'لا توجد رسائل بعد.',
    authCreateAccount: 'إنشاء حساب',
    authHaveAccount: 'لدي حساب بالفعل',
    accountNameLabel: 'الاسم',
    accountAddressLabel: 'العنوان',
    accountPhoneLabel: 'رقم الهاتف (بالتنسيق الدولي، مثل ‎+212…)',
    authEmailLabel: 'البريد الإلكتروني',
    authPasswordLabel: 'كلمة المرور',
    phoneOtpLabel: 'رمز التأكيد عبر الرسائل القصيرة',
    phoneOtpTitle: 'تأكيد رقم الهاتف',
    phoneOtpResend: 'إعادة إرسال الرمز',
    phoneOtpVerify: 'تأكيد الهاتف',
    contactSaveButton: 'حفظ البيانات',
    phoneOtpSent: 'أرسلنا رمز التأكيد عبر رسالة قصيرة.',
    phoneOtpVerified: 'تم تأكيد رقم الهاتف. يمكنك الآن نشر الإعلانات.',
    phoneOtpRequired: 'يرجى إدخال رمز الرسالة القصيرة.',
    phoneInvalid: 'يرجى إدخال رقم هاتف صالح بالتنسيق الدولي (مثل ‎+212…).',
    contactDetailsRequired: 'يرجى إدخال عنوانك ورقم هاتفك.',
    phoneVerificationRequired: 'أكد رقم هاتفك عبر رسالة قصيرة قبل نشر الإعلانات.',
    forgotPassword: 'هل نسيت كلمة المرور؟',
    resetPasswordSent: 'أرسلنا إليك رابطًا لإعادة تعيين كلمة المرور عبر البريد الإلكتروني.',
    newPasswordLabel: 'كلمة المرور الجديدة',
    passwordUpdated: 'تم تغيير كلمة المرور. يمكنك تسجيل الدخول الآن.',
    passwordRequired: 'يرجى إدخال عنوان بريد إلكتروني صالح.',
    authConfirmEmail: 'يرجى تأكيد بريدك الإلكتروني عبر الرابط المرسل إلى صندوق الوارد.',
    backendNotConfigured: 'لم يتم ربط قاعدة البيانات بعد. أضف رابط مشروع Supabase ومفتاح Anon العام إلى supabase-config.js.',
    backendUnavailable: 'تعذر الاتصال بالخادم. يرجى المحاولة لاحقًا.',
    authRequired: 'يرجى تسجيل الدخول لاستخدام هذه الميزة.',
    contactSeller: 'تواصل مع البائع',
    editListing: 'تعديل',
    deleteListing: 'حذف',
    adminDeleteListing: 'حذف كمسؤول',
    reportButton: 'الإبلاغ عن الإعلان',
    messageLabel: 'رسالة',
    sendMessage: 'إرسال',
    listingSaved: 'تم حفظ الإعلان.',
    listingDeleted: 'تم حذف الإعلان.',
    reportSent: 'تم إرسال البلاغ.',
    messageSent: 'تم إرسال الرسالة.',
    messageListing: 'الإعلان',
    reportAdminHeading: 'الإشراف: البلاغات',
    removeReportedListing: 'إزالة الإعلان',
    noReports: 'لا توجد بلاغات مفتوحة.',
    markResolved: 'تم الحل',
    dismissReport: 'رفض',
    uploadImageLimit: 'يجب ألا يتجاوز حجم الصور 5 ميغابايت، وأن تكون بصيغة JPG أو PNG أو WebP.',
    imageStorageUnavailable: 'مساحة الصور listing-images غير موجودة في Supabase. يرجى تنفيذ جزء التخزين من supabase/schema.sql في محرر SQL.',
    pageTitle: 'Marocmarkt | إعلانات مبوبة في المغرب',
    pageDescription: 'Marocmarkt منصتك المحلية للإعلانات المبوبة في المغرب.',
    topLand: 'الدولة',
    heroEyebrow: 'عروض محلية في المغرب',
    heroTitle: 'اعثر بسرعة على ما تبحث عنه.',
    heroText: 'من السيارات والشقق إلى التقنية والأثاث والوظائف – يجمع Marocmarkt الناس في جميع أنحاء المغرب.',
    searchLabel: 'ماذا تبحث؟',
    whereLabel: 'أين؟',
    categoryLabel: 'الفئة',
    findButton: 'بحث',
    serviceEyebrow: 'الخدمات',
    serviceTitle: 'مساعدة احترافية للمنزل والعمل',
    serviceText: 'من الإصلاح والتركيب إلى التنظيف والنقل والاستشارة – ابحث بسرعة عن خبراء موثوقين بالقرب منك.',
    servicePoint1: 'الإصلاح والتركيب',
    servicePoint2: 'المنزل والحديقة',
    servicePoint3: 'النقل والتسليم',
    serviceButton: 'اعرف المزيد',
    categoryEyebrow: 'الأقسام الشائعة',
    categoryHeading: 'الفئات',
    categoryAutos: 'السيارات',
    categoryProperties: 'العقارات',
    categoryElectronics: 'الإلكترونيات',
    categoryFurniture: 'الأثاث',
    categoryFashion: 'الموضة',
    categoryJobs: 'الوظائف',
    categoryLeisure: 'الترفيه',
    categoryPets: 'الحيوانات الأليفة',
    categoryHomeGarden: 'المنزل والحديقة',
    categoryGifts: 'هدايا',
    topCities: 'المدن',
    allCities: 'كل المدن',
    latestEyebrow: 'وصل حديثًا',
    latestHeading: 'أحدث الإعلانات',
    sortLabel: 'ترتيب',
    minimumPrice: 'السعر الأدنى (د.م)',
    maximumPrice: 'السعر الأعلى (د.م)',
    popularEyebrow: 'أفضل العروض',
    popularHeading: 'الإعلانات الشائعة',
    loginButton: 'تسجيل الدخول',
    sellButton: 'نشر إعلان',
    adDialogTitle: 'نشر إعلان',
    formTitle: 'العنوان',
    formPrice: 'السعر (د.م)',
    formCategory: 'الفئة',
    formCity: 'المدينة',
    formDescription: 'الوصف',
    formImages: 'الصور (حتى 10)',
    chooseOption: 'يرجى الاختيار',
    formCancel: 'إلغاء',
    formSubmit: 'نشر الإعلان',
    newLabel: 'جديد',
    detailLocation: 'الموقع',
    detailPublished: 'نشر',
    detailCategory: 'الفئة',
    detailClose: 'إغلاق',
    complaintButton: 'الشكاوى',
    moderationHeading: 'الشكاوى والإشراف',
    complaintModalTitle: 'الإبلاغ عن شكوى',
    complaintTargetLabel: 'الإعلان أو المستخدم المعني',
    complaintReasonLabel: 'السبب',
    complaintMessageLabel: 'الوصف',
    complaintSubmit: 'إرسال البلاغ',
    complaintCancel: 'إلغاء',
    complaintEmpty: 'لا توجد شكاوى حتى الآن.',
    complaintStatusNew: 'جديد',
    complaintStatusBlocked: 'محظور',
    complaintStatusNewLabel: 'جديد',
    complaintStatusBlockedLabel: 'محظور',
    complaintInfoDefault: 'يرجى اختيار المستخدم أو الإعلان المعني.',
    complaintForPrefix: 'شكوى بخصوص:',
    complaintBlock: 'حظر المستخدم',
    complaintValidation: 'يرجى ملء جميع الحقول.',
    newProfile: 'ملف شخصي جديد',
    favoriteAdd: 'إضافة إلى المفضلة',
    favoriteRemove: 'إزالة من المفضلة',
    listingDetails: 'تفاصيل الإعلان',
    emptyListings: 'لم يتم العثور على إعلانات. جرّب كلمات بحث أخرى أو قم بتصفية حسب المدينة أو الفئة.',
    searchPlaceholder: 'مثال: داسيا، أريكة، شقة',
    titlePlaceholder: 'مثال: Dacia Logan',
    descriptionPlaceholder: 'صف عرضك بالتفصيل...',
    complaintPlaceholder: 'اشرح الموقف بإيجاز ووضوح...',
    categoryNames: {
      Autos: 'السيارات',
      Immobilien: 'العقارات',
      Elektronik: 'الإلكترونيات',
      Möbel: 'الأثاث',
      Mode: 'الموضة',
      Jobs: 'الوظائف',
      Freizeit: 'الترفيه',
      Haustiere: 'الحيوانات الأليفة',
      'Haus & Garten': 'المنزل والحديقة',
      Geschenke: 'هدايا'
    },
    validationTitle: 'يرجى إدخال عنوان صالح يحتوي على 3 أحرف على الأقل.',
    validationPrice: 'يرجى إدخال سعر صالح بالدينار المغربي.',
    validationCategory: 'يرجى اختيار فئة.',
    validationCity: 'يرجى اختيار مدينة.',
    validationDescription: 'يرجى إدخال وصف يحتوي على 20 حرفًا على الأقل.',
    validationImagesLimit: 'يمكنك تحميل ما يصل إلى 10 صور.',
    validationImageType: 'يسمح فقط بالصور.',
    validationImageRead: 'تعذّر قراءة الصورة.'
  },
  fr: {
    languageLabel: 'Choisir la langue',
    logoutButton: 'Se déconnecter',
    accountTitle: 'Mon Marocmarkt',
    myListings: 'Mes annonces',
    myFavorites: 'Favoris',
    myMessages: 'Messages',
    messagesLabel: 'Messages',
    emptyAccount: 'Vous n’avez pas encore publié d’annonce.',
    emptyFavorites: 'Aucune annonce enregistrée dans vos favoris.',
    emptyMessages: 'Aucun message pour le moment.',
    authCreateAccount: 'Créer un compte',
    authHaveAccount: 'J’ai déjà un compte',
    accountNameLabel: 'Nom',
    accountAddressLabel: 'Adresse',
    accountPhoneLabel: 'Téléphone (format international, ex. +212…)',
    authEmailLabel: 'E-mail',
    authPasswordLabel: 'Mot de passe',
    phoneOtpLabel: 'Code de confirmation SMS',
    phoneOtpTitle: 'Confirmer le numéro de téléphone',
    phoneOtpResend: 'Renvoyer le code',
    phoneOtpVerify: 'Confirmer le téléphone',
    contactSaveButton: 'Enregistrer',
    phoneOtpSent: 'Nous avons envoyé un code de confirmation par SMS.',
    phoneOtpVerified: 'Numéro confirmé. Vous pouvez maintenant publier des annonces.',
    phoneOtpRequired: 'Veuillez saisir le code reçu par SMS.',
    phoneInvalid: 'Veuillez saisir un numéro valide au format international (ex. +212…).',
    contactDetailsRequired: 'Veuillez saisir votre adresse et votre numéro de téléphone.',
    phoneVerificationRequired: 'Confirmez votre numéro par SMS avant de publier une annonce.',
    forgotPassword: 'Mot de passe oublié ?',
    resetPasswordSent: 'Nous vous avons envoyé un lien de réinitialisation par e-mail.',
    newPasswordLabel: 'Nouveau mot de passe',
    passwordUpdated: 'Votre mot de passe a été modifié. Vous pouvez vous connecter.',
    passwordRequired: 'Veuillez saisir une adresse e-mail valide.',
    authConfirmEmail: 'Veuillez confirmer votre adresse e-mail à l’aide du lien reçu.',
    backendNotConfigured: 'Le backend n’est pas encore connecté. Renseignez l’URL du projet Supabase et la clé Anon publique dans supabase-config.js.',
    backendUnavailable: 'La connexion au serveur a échoué. Veuillez réessayer plus tard.',
    authRequired: 'Connectez-vous pour utiliser cette fonctionnalité.',
    contactSeller: 'Contacter le vendeur',
    editListing: 'Modifier',
    deleteListing: 'Supprimer',
    adminDeleteListing: 'Supprimer (admin)',
    reportButton: 'Signaler l’annonce',
    messageLabel: 'Message',
    sendMessage: 'Envoyer',
    listingSaved: 'Annonce enregistrée.',
    listingDeleted: 'Annonce supprimée.',
    reportSent: 'Signalement envoyé.',
    messageSent: 'Message envoyé.',
    messageListing: 'Annonce',
    reportAdminHeading: 'Modération : signalements',
    removeReportedListing: 'Retirer l’annonce',
    noReports: 'Aucun signalement en attente.',
    markResolved: 'Résoudre',
    dismissReport: 'Rejeter',
    uploadImageLimit: 'Les images doivent faire moins de 5 Mo et être au format JPG, PNG ou WebP.',
    imageStorageUnavailable: 'Le stockage Supabase listing-images est introuvable. Exécutez la partie stockage de supabase/schema.sql dans l’éditeur SQL.',
    pageTitle: 'Marocmarkt | Petites annonces au Maroc',
    pageDescription: 'Marocmarkt, votre plateforme locale de petites annonces au Maroc.',
    topLand: 'Pays',
    heroEyebrow: 'Petites annonces locales au Maroc',
    heroTitle: 'Trouvez rapidement ce que vous cherchez.',
    heroText: 'Des voitures et logements aux appareils électroniques, meubles et emplois, Marocmarkt met en relation les habitants de tout le Maroc.',
    searchLabel: 'Que recherchez-vous ?',
    whereLabel: 'Où ?',
    categoryLabel: 'Catégorie',
    findButton: 'Rechercher',
    serviceEyebrow: 'Services',
    serviceTitle: 'Une aide professionnelle pour la maison et l’entreprise',
    serviceText: 'Réparation, installation, nettoyage, transport ou conseil : trouvez rapidement des professionnels fiables près de chez vous.',
    servicePoint1: 'Réparation et installation',
    servicePoint2: 'Maison et jardin',
    servicePoint3: 'Transport et livraison',
    serviceButton: 'En savoir plus',
    categoryEyebrow: 'Catégories populaires',
    categoryHeading: 'Catégories',
    categoryAutos: 'Voitures',
    categoryProperties: 'Immobilier',
    categoryElectronics: 'Électronique',
    categoryFurniture: 'Meubles',
    categoryFashion: 'Mode',
    categoryJobs: 'Emploi',
    categoryLeisure: 'Loisirs',
    categoryPets: 'Animaux',
    categoryHomeGarden: 'Maison et jardin',
    categoryGifts: 'Cadeaux',
    topCities: 'Villes',
    allCities: 'Toutes les villes',
    latestEyebrow: 'Récemment ajoutées',
    latestHeading: 'Dernières annonces',
    sortLabel: 'Trier',
    minimumPrice: 'Prix minimum (MAD)',
    maximumPrice: 'Prix maximum (MAD)',
    popularEyebrow: 'À la une',
    popularHeading: 'Annonces populaires',
    loginButton: 'Se connecter',
    sellButton: 'Déposer une annonce',
    adDialogTitle: 'Déposer une annonce',
    formTitle: 'Titre',
    formPrice: 'Prix (MAD)',
    formCategory: 'Catégorie',
    formCity: 'Ville',
    formDescription: 'Description',
    formImages: 'Images (10 maximum)',
    chooseOption: 'Veuillez choisir',
    formCancel: 'Annuler',
    formSubmit: 'Publier l’annonce',
    newLabel: 'Nouveau',
    detailLocation: 'Lieu',
    detailPublished: 'Publiée le',
    detailCategory: 'Catégorie',
    detailClose: 'Fermer',
    complaintButton: 'Signalements',
    moderationHeading: 'Signalements et modération',
    complaintModalTitle: 'Signaler un problème',
    complaintTargetLabel: 'Annonce ou utilisateur concerné',
    complaintReasonLabel: 'Motif',
    complaintMessageLabel: 'Description',
    complaintSubmit: 'Envoyer le signalement',
    complaintCancel: 'Annuler',
    complaintEmpty: 'Aucun signalement pour le moment.',
    complaintStatusNew: 'nouveau',
    complaintStatusBlocked: 'bloqué',
    complaintStatusNewLabel: 'Nouveau',
    complaintStatusBlockedLabel: 'Bloqué',
    complaintInfoDefault: 'Veuillez choisir l’utilisateur ou l’annonce concerné.',
    complaintForPrefix: 'Signalement concernant :',
    complaintBlock: 'Bloquer l’utilisateur',
    complaintValidation: 'Veuillez remplir tous les champs.',
    newProfile: 'Nouveau profil',
    favoriteAdd: 'Ajouter aux favoris',
    favoriteRemove: 'Retirer des favoris',
    listingDetails: 'Détails de l’annonce',
    emptyListings: 'Aucune annonce trouvée. Essayez d’autres termes ou filtres.',
    searchPlaceholder: 'Ex. : Dacia, canapé, appartement',
    titlePlaceholder: 'Ex. : Dacia Logan',
    descriptionPlaceholder: 'Décrivez votre annonce en détail...',
    complaintPlaceholder: 'Décrivez brièvement la situation...',
    categoryNames: {
      Autos: 'Voitures',
      Immobilien: 'Immobilier',
      Elektronik: 'Électronique',
      Möbel: 'Meubles',
      Mode: 'Mode',
      Jobs: 'Emploi',
      Freizeit: 'Loisirs',
      Haustiere: 'Animaux',
      'Haus & Garten': 'Maison et jardin',
      Geschenke: 'Cadeaux'
    },
    validationTitle: 'Veuillez saisir un titre valide d’au moins 3 caractères.',
    validationPrice: 'Veuillez saisir un prix valide en MAD.',
    validationCategory: 'Veuillez choisir une catégorie.',
    validationCity: 'Veuillez choisir une ville.',
    validationDescription: 'Veuillez saisir une description d’au moins 20 caractères.',
    validationImagesLimit: 'Vous pouvez téléverser jusqu’à 10 images.',
    validationImageType: 'Seuls les fichiers image sont autorisés.',
    validationImageRead: 'Impossible de lire l’image.'
  }
};

function getCurrentLanguage() {
  const savedLanguage = localStorage.getItem('marocmarkt-lang');
  return savedLanguage === 'ar' ? 'ar' : 'fr';
}

function getLanguageDictionary() {
  return translations[getCurrentLanguage()] || translations.fr;
}

function showNotice(message, kind = 'info') {
  if (!appNotice) return;
  appNotice.textContent = message;
  appNotice.dataset.kind = kind;
  appNotice.hidden = false;
}

function clearNotice() {
  if (!appNotice) return;
  appNotice.textContent = '';
  appNotice.hidden = true;
  delete appNotice.dataset.kind;
}

function requireBackend() {
  if (!supabaseClient) {
    showNotice(getLanguageDictionary().backendNotConfigured, 'error');
    return false;
  }
  return true;
}

function requireSignedIn() {
  if (!requireBackend()) return false;
  if (!currentUser) {
    showNotice(getLanguageDictionary().authRequired, 'error');
    openAuthDialog();
    return false;
  }
  return true;
}

function requireListingEligibility() {
  if (!requireSignedIn()) return false;
  if (!currentProfile?.address?.trim() || !currentProfile?.phone?.trim()) {
    showNotice(getLanguageDictionary().contactDetailsRequired, 'error');
    openContactSetup();
    return false;
  }
  if (!hasVerifiedProfilePhone()) {
    showNotice(getLanguageDictionary().phoneVerificationRequired, 'error');
    runBackendAction(ensurePhoneVerification);
    return false;
  }
  return true;
}

function openAuthDialog(mode = 'signin') {
  if (!requireBackend()) return;
  authMode = mode;
  updateAuthDialog();
  authDialog.showModal();
}

function updateAuthDialog() {
  const dict = getLanguageDictionary();
  const isSignUp = authMode === 'signup';
  const isRecovery = authMode === 'recovery';
  const isContactSetup = authMode === 'contactSetup';
  const isPhoneVerification = authMode === 'phoneVerification';
  authNameField.hidden = !isSignUp;
  authAddressField.hidden = !isSignUp && !isContactSetup;
  authPhoneField.hidden = !isSignUp && !isContactSetup;
  authOtpField.hidden = !isPhoneVerification;
  document.getElementById('authEmailField').hidden = isRecovery || isContactSetup || isPhoneVerification;
  document.getElementById('authPasswordField').hidden = isContactSetup || isPhoneVerification;
  document.getElementById('authPasswordField').querySelector('span').textContent = isRecovery ? dict.newPasswordLabel : dict.authPasswordLabel;
  document.getElementById('forgotPasswordButton').hidden = isSignUp || isRecovery || isContactSetup || isPhoneVerification;
  document.getElementById('toggleAuthModeButton').hidden = isRecovery || isContactSetup || isPhoneVerification;
  document.getElementById('resendPhoneCodeButton').hidden = !isPhoneVerification;
  document.querySelector('#authDialog h3').textContent = isRecovery
    ? dict.newPasswordLabel
    : isPhoneVerification
      ? dict.phoneOtpTitle
      : isContactSetup
        ? dict.accountTitle
        : isSignUp
          ? dict.authCreateAccount
          : dict.loginButton;
  document.getElementById('authSubmitButton').textContent = isRecovery
    ? dict.newPasswordLabel
    : isPhoneVerification
      ? dict.phoneOtpVerify
      : isContactSetup
        ? dict.contactSaveButton
        : isSignUp
          ? dict.authCreateAccount
          : dict.loginButton;
  document.getElementById('toggleAuthModeButton').textContent = isSignUp ? dict.authHaveAccount : dict.authCreateAccount;
  document.getElementById('authPassword').autocomplete = isSignUp || isRecovery ? 'new-password' : 'current-password';
  document.getElementById('authEmail').required = !isRecovery && !isContactSetup && !isPhoneVerification;
  document.getElementById('authPassword').required = !isContactSetup && !isPhoneVerification;
  document.getElementById('authName').required = isSignUp;
  document.getElementById('authAddress').required = isSignUp || isContactSetup;
  document.getElementById('authPhone').required = isSignUp || isContactSetup;
  document.getElementById('authOtp').required = isPhoneVerification;
  if (!isPhoneVerification) document.getElementById('authOtp').value = '';
  document.getElementById('authPassword').value = '';
  authError.textContent = '';
}

function openContactSetup() {
  authMode = 'contactSetup';
  updateAuthDialog();
  document.getElementById('authAddress').value = currentProfile?.address || '';
  document.getElementById('authPhone').value = currentProfile?.phone || '';
  if (!authDialog.open) authDialog.showModal();
}

function hasVerifiedProfilePhone() {
  return Boolean(
    currentUser?.phone_confirmed_at
    && currentProfile?.phone
    && currentUser.phone === currentProfile.phone
  );
}

async function sendPhoneVerification(phoneValue, resend = false) {
  const phone = String(phoneValue || '').trim();
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
    throw new Error(getLanguageDictionary().phoneInvalid);
  }
  if (phoneVerificationSending || (!resend && phoneVerificationPendingFor === phone)) return;

  phoneVerificationSending = true;
  phoneVerificationPendingFor = phone;
  authMode = 'phoneVerification';
  updateAuthDialog();
  document.getElementById('authPhone').value = phone;
  if (!authDialog.open) authDialog.showModal();
  try {
    const { data, error } = await supabaseClient.auth.updateUser({ phone });
    if (error) throw error;
    if (data.user) currentUser = data.user;
    authError.textContent = getLanguageDictionary().phoneOtpSent;
    updateAuthUi();
  } catch (error) {
    phoneVerificationPendingFor = '';
    authError.textContent = error.message || String(error);
    throw error;
  } finally {
    phoneVerificationSending = false;
  }
}

async function ensurePhoneVerification() {
  if (!currentUser) return;
  const address = currentProfile?.address?.trim();
  const phone = currentProfile?.phone?.trim();
  if (!address || !phone) {
    if (authMode !== 'contactSetup' || !authDialog.open) openContactSetup();
    return;
  }
  if (hasVerifiedProfilePhone()) {
    phoneVerificationPendingFor = '';
    if (authMode === 'phoneVerification' && authDialog.open) authDialog.close();
    updateAuthUi();
    return;
  }
  if (phoneVerificationPendingFor === phone) {
    if (authMode !== 'phoneVerification') {
      authMode = 'phoneVerification';
      updateAuthDialog();
      document.getElementById('authPhone').value = phone;
    }
    if (!authDialog.open) authDialog.showModal();
    return;
  }
  await sendPhoneVerification(phone);
}

function updateAuthUi() {
  const dict = getLanguageDictionary();
  loginButton.textContent = currentUser ? currentProfile?.display_name || dict.accountTitle : dict.loginButton;
  logoutButton.hidden = !currentUser;
  messageNotificationsButton.hidden = !currentUser;
  messageNotificationsButton.setAttribute('aria-label', dict.messagesLabel);
  messageNotificationsButton.title = dict.messagesLabel;
  if (!currentUser) {
    unreadMessageCount.hidden = true;
    unreadMessageCount.textContent = '';
  }
  sellButton.disabled = !supabaseClient;
}

async function updateUnreadMessageCount() {
  if (!currentUser || !supabaseClient) {
    unreadMessageCount.hidden = true;
    unreadMessageCount.textContent = '';
    return;
  }

  const { data: conversations, error: conversationsError } = await supabaseClient
    .from('conversations')
    .select('id')
    .or(`buyer_id.eq.${currentUser.id},seller_id.eq.${currentUser.id}`);
  if (conversationsError) throw conversationsError;

  const conversationIds = (conversations || []).map((conversation) => conversation.id);
  if (!conversationIds.length) {
    unreadMessageCount.hidden = false;
    unreadMessageCount.textContent = '0';
    messageNotificationsButton.setAttribute('aria-label', `${getLanguageDictionary().messagesLabel}: 0`);
    return;
  }

  const { count, error } = await supabaseClient
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .in('conversation_id', conversationIds)
    .neq('sender_id', currentUser.id)
    .is('read_at', null);
  if (error) throw error;

  const total = count || 0;
  unreadMessageCount.textContent = total > 99 ? '99+' : String(total);
  unreadMessageCount.hidden = false;
  messageNotificationsButton.setAttribute('aria-label', `${getLanguageDictionary().messagesLabel}: ${total}`);
}

function refreshUnreadMessageCount() {
  runBackendAction(updateUnreadMessageCount);
}

function publicImageUrl(path) {
  if (/^https?:\/\//i.test(path)) return path;
  return supabaseClient.storage.from('listing-images').getPublicUrl(path).data.publicUrl;
}

async function loadListings() {
  if (!supabaseClient) return;
  let query = supabaseClient.from('listings').select('*').eq('status', 'active').order('created_at', { ascending: false });
  if (currentUser) {
    query = supabaseClient.from('listings')
      .select('*')
      .or(`status.eq.active,seller_id.eq.${currentUser.id}`)
      .order('created_at', { ascending: false });
  }
  const { data, error } = await query;
  if (error) {
    listings.splice(0, listings.length);
    renderListings();
    showNotice(`${getLanguageDictionary().backendUnavailable} ${error.message}`, 'error');
    return;
  }

  listings.splice(0, listings.length, ...(data || []).map((row) => ({
    id: row.id,
    title: row.title,
    price: Number(row.price),
    city: row.city,
    category: row.category,
    description: row.description,
    images: (row.image_paths || []).map(publicImageUrl),
    imagePaths: row.image_paths || [],
    image: (row.image_paths || []).map(publicImageUrl)[0] || './assets/placeholder.svg',
    seller: row.seller_id,
    sellerName: row.seller_name,
    date: row.created_at.slice(0, 10),
    featured: false,
    status: row.status
  })));
  renderListings();
}

async function loadFavorites() {
  if (!supabaseClient || !currentUser) {
    favorites.clear();
    return;
  }
  const { data, error } = await supabaseClient
    .from('favorites')
    .select('listing_id')
    .eq('user_id', currentUser.id);
  if (error) {
    showNotice(`${getLanguageDictionary().backendUnavailable} ${error.message}`, 'error');
    return;
  }
  favorites.clear();
  (data || []).forEach((favorite) => favorites.add(favorite.listing_id));
}

async function loadProfile(user) {
  currentUser = user;
  currentProfile = null;
  if (!user || !supabaseClient) {
    adminRole = '';
    if (adminDashboardDialog?.open) adminDashboardDialog.close();
    if (adminLoginDialog?.open) adminLoginDialog.close();
    adminLoginForm?.reset();
    adminNotificationList?.replaceChildren();
    adminListingList?.replaceChildren();
    adminReportList?.replaceChildren();
    adminAppealList?.replaceChildren();
    adminAuditList?.replaceChildren();
    adminRoster?.replaceChildren();
    favorites.clear();
    phoneVerificationPendingFor = '';
    updateAuthUi();
    return;
  }

  const { data, error } = await supabaseClient
    .from('profiles')
    .select('display_name, is_admin, address, phone')
    .eq('id', user.id)
    .single();
  if (error) {
    showNotice(`${getLanguageDictionary().backendUnavailable} ${error.message}`, 'error');
  } else {
    currentProfile = data;
  }
  await loadFavorites();
  updateAuthUi();
  refreshUnreadMessageCount();
  await ensurePhoneVerification();
}

async function initializeBackend() {
  const isAdminDashboardRoute = new URLSearchParams(window.location.search).get('admin') === '1';
  if (!supabaseClient) {
    updateAuthUi();
    showNotice(getLanguageDictionary().backendNotConfigured);
    document.querySelector('.moderation-section').hidden = true;
    if (isAdminDashboardRoute) window.location.replace('/admin/');
    return;
  }

  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') openAuthDialog('recovery');
    queueMicrotask(() => runBackendAction(async () => {
      await loadProfile(session?.user || null);
      await loadListings();
      await renderComplaintList();
      if (accountDialog.open) await renderAccountContent();
    }));
  });

  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    showNotice(`${getLanguageDictionary().backendUnavailable} ${error.message}`, 'error');
    return;
  }
  await loadProfile(data.session?.user || null);
  await loadListings();
  await renderComplaintList();
  if (isAdminDashboardRoute) {
    if (!data.session) {
      window.location.replace('/admin/');
      return;
    }
    const { data: role, error: roleError } = await supabaseClient.rpc('get_platform_admin_role');
    if (roleError || !role) {
      window.location.replace('/admin/');
      return;
    }
    adminRole = role;
    await renderAdminDashboard();
    adminDashboardDialog.showModal();
  }
  if (!notificationRefreshTimer) {
    notificationRefreshTimer = setInterval(refreshUnreadMessageCount, 10000);
  }
}

async function uploadListingImages(files, listingId) {
  const acceptedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
  const dict = getLanguageDictionary();
  const validFiles = Array.from(files);
  if (validFiles.some((file) => !acceptedTypes.has(file.type) || file.size > 5 * 1024 * 1024)) {
    throw new Error(dict.uploadImageLimit);
  }

  const paths = [];
  for (const file of validFiles) {
    const extension = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1];
    const path = `${currentUser.id}/${listingId}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabaseClient.storage.from('listing-images').upload(path, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false
    });
    if (error) {
      if (paths.length) {
        const { error: cleanupError } = await supabaseClient.storage.from('listing-images').remove(paths);
        if (cleanupError) throw new Error(`${error.message} ${cleanupError.message}`);
      }
      throw error.message === 'Bucket not found'
        ? new Error(dict.imageStorageUnavailable)
        : error;
    }
    paths.push(path);
  }
  return paths;
}

async function deleteListing(listing) {
  const { error } = await supabaseClient.from('listings').delete().eq('id', listing.id);
  if (error) throw error;
  const imagePaths = (listing.imagePaths || []).filter((path) => !/^https?:\/\//i.test(path) && !path.startsWith('./') && !path.startsWith('/'));
  let cleanupErrorMessage = '';
  if (imagePaths.length) {
    const { error: storageError } = await supabaseClient.storage.from('listing-images').remove(imagePaths);
    if (storageError) cleanupErrorMessage = storageError.message;
  }
  const listingIndex = listings.findIndex((entry) => entry.id === listing.id);
  if (listingIndex !== -1) listings.splice(listingIndex, 1);
  favorites.delete(listing.id);
  renderListings();
  if (accountDialog.open) await renderAccountContent();
  showNotice(
    cleanupErrorMessage
      ? `${getLanguageDictionary().listingDeleted} ${cleanupErrorMessage}`
      : getLanguageDictionary().listingDeleted,
    cleanupErrorMessage ? 'error' : 'success'
  );
}

async function createOrOpenConversation(listing) {
  if (!requireSignedIn()) return;
  if (listing.seller === currentUser.id) {
    showNotice(getLanguageDictionary().authRequired, 'error');
    return;
  }

  const { data: existing, error: lookupError } = await supabaseClient
    .from('conversations')
    .select('id')
    .eq('listing_id', listing.id)
    .eq('buyer_id', currentUser.id)
    .maybeSingle();
  if (lookupError) throw lookupError;

  let conversation = existing;
  if (!conversation) {
    const { data, error } = await supabaseClient
      .from('conversations')
      .insert({ listing_id: listing.id, buyer_id: currentUser.id, seller_id: listing.seller })
      .select('id')
      .single();
    if (error && error.code !== '23505') throw error;
    conversation = data;
    if (!conversation) {
      const { data: retryData, error: retryError } = await supabaseClient
        .from('conversations')
        .select('id')
        .eq('listing_id', listing.id)
        .eq('buyer_id', currentUser.id)
        .single();
      if (retryError) throw retryError;
      conversation = retryData;
    }
  }
  await openConversation(conversation.id, listing.title, listing.seller);
}

async function openConversation(conversationId, title, otherUserId) {
  activeConversation = { id: conversationId, title, otherUserId };
  chatHeading.textContent = title;
  await loadChatMessages();
  if (!chatDialog.open) chatDialog.showModal();
  if (chatRefreshTimer) clearInterval(chatRefreshTimer);
  chatRefreshTimer = setInterval(() => {
    if (chatDialog.open) loadChatMessages();
  }, 5000);
}

async function loadChatMessages() {
  if (!activeConversation || !supabaseClient) return;
  const { data, error } = await supabaseClient
    .from('messages')
    .select('id, sender_id, body, created_at, read_at')
    .eq('conversation_id', activeConversation.id)
    .order('created_at', { ascending: true });
  if (error) {
    showNotice(`${getLanguageDictionary().backendUnavailable} ${error.message}`, 'error');
    return;
  }
  chatMessages.replaceChildren();
  (data || []).forEach((message) => {
    const bubble = document.createElement('div');
    bubble.className = `chat-message ${message.sender_id === currentUser.id ? 'own-message' : ''}`;
    const body = document.createElement('div');
    body.textContent = message.body;
    const timestamp = document.createElement('time');
    timestamp.dateTime = message.created_at;
    timestamp.textContent = new Date(message.created_at).toLocaleString(getCurrentLanguage() === 'ar' ? 'ar-MA' : 'fr-FR');
    bubble.append(body, timestamp);
    chatMessages.appendChild(bubble);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;

  const unreadIds = (data || [])
    .filter((message) => message.sender_id !== currentUser.id && !message.read_at)
    .map((message) => message.id);
  if (unreadIds.length) {
    const { error: readError } = await supabaseClient
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .in('id', unreadIds)
      .eq('conversation_id', activeConversation.id)
      .neq('sender_id', currentUser.id);
    if (readError) {
      showNotice(`${getLanguageDictionary().backendUnavailable} ${readError.message}`, 'error');
      return;
    }
    refreshUnreadMessageCount();
  }
}

async function renderAccountContent() {
  if (!accountContent || !currentUser || !supabaseClient) return;
  const dict = getLanguageDictionary();
  accountContent.replaceChildren();

  if (accountTab === 'notifications') {
    const { data: notifications, error } = await supabaseClient
      .from('user_notifications')
      .select('id, notification_type, message, created_at, read_at')
      .eq('recipient_id', currentUser.id)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    if (!notifications?.length) {
      accountContent.textContent = 'Keine Benachrichtigungen.';
      return;
    }
    notifications.forEach((notification) => {
      const row = document.createElement('article');
      row.className = 'account-row';
      const text = document.createElement('p');
      text.textContent = `${notification.message} · ${new Date(notification.created_at).toLocaleString()}`;
      row.appendChild(text);
      if (!notification.read_at) {
        const markRead = document.createElement('button');
        markRead.type = 'button';
        markRead.className = 'btn btn-secondary small-btn';
        markRead.textContent = 'Als gelesen markieren';
        markRead.addEventListener('click', () => runBackendAction(async () => {
          const { error: updateError } = await supabaseClient
            .from('user_notifications')
            .update({ read_at: new Date().toISOString() })
            .eq('id', notification.id)
            .eq('recipient_id', currentUser.id);
          if (updateError) throw updateError;
          await renderAccountContent();
        }));
        row.appendChild(markRead);
      }
      accountContent.appendChild(row);
    });
    return;
  }

  if (accountTab === 'appeals') {
    const [{ data: removedListings, error: listingError }, { data: moderation, error: moderationError }] = await Promise.all([
      supabaseClient.from('listings').select('id, title').eq('seller_id', currentUser.id).eq('status', 'removed'),
      supabaseClient.from('user_moderation').select('id, action, reason').eq('user_id', currentUser.id).is('lifted_at', null)
    ]);
    if (listingError) throw listingError;
    if (moderationError) throw moderationError;
    const form = document.createElement('form');
    form.className = 'form-grid single-column';
    const targetLabel = document.createElement('label');
    targetLabel.textContent = 'Angefochtene Maßnahme';
    const target = document.createElement('select');
    target.required = true;
    target.add(new Option('Bitte auswählen', ''));
    (removedListings || []).forEach((listing) => target.add(new Option(`Entfernte Anzeige: ${listing.title}`, `listing:${listing.id}`)));
    (moderation || []).forEach((entry) => target.add(new Option(`Kontomaßnahme: ${entry.action} · ${entry.reason}`, `moderation:${entry.id}`)));
    targetLabel.appendChild(target);
    const messageLabel = document.createElement('label');
    messageLabel.textContent = 'Begründung des Einspruchs';
    const message = document.createElement('textarea');
    message.required = true;
    message.minLength = 10;
    message.maxLength = 3000;
    message.rows = 4;
    messageLabel.appendChild(message);
    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.className = 'btn btn-primary';
    submit.textContent = 'Einspruch senden';
    form.append(targetLabel, messageLabel, submit);
    if (!removedListings?.length && !moderation?.length) {
      accountContent.textContent = 'Es gibt derzeit keine anfechtbaren Maßnahmen.';
      return;
    }
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const [targetType, targetId] = target.value.split(':');
      runBackendAction(async () => {
        const { error } = await supabaseClient.from('moderation_appeals').insert({
          user_id: currentUser.id,
          listing_id: targetType === 'listing' ? targetId : null,
          moderation_id: targetType === 'moderation' ? Number(targetId) : null,
          message: message.value.trim()
        });
        if (error) throw error;
        showNotice('Dein Einspruch wurde eingereicht.', 'success');
        await renderAccountContent();
      });
    });
    accountContent.appendChild(form);
    return;
  }

  if (accountTab === 'messages') {
    const { data: conversations, error } = await supabaseClient
      .from('conversations')
      .select('id, listing_id, buyer_id, seller_id, created_at, last_message_at')
      .or(`buyer_id.eq.${currentUser.id},seller_id.eq.${currentUser.id}`)
      .order('last_message_at', { ascending: false });
    if (error) throw error;
    if (!conversations?.length) {
      accountContent.textContent = dict.emptyMessages;
      return;
    }

    const listingIds = [...new Set(conversations.map((conversation) => conversation.listing_id))];
    const profileIds = [...new Set(conversations.map((conversation) => conversation.buyer_id === currentUser.id ? conversation.seller_id : conversation.buyer_id))];
    const [{ data: listingRows, error: listingError }, { data: profiles, error: profileError }] = await Promise.all([
      supabaseClient.from('listings').select('id, title').in('id', listingIds),
      supabaseClient.from('public_profiles').select('id, display_name').in('id', profileIds)
    ]);
    if (listingError) throw listingError;
    if (profileError) throw profileError;
    const listingById = new Map((listingRows || []).map((listing) => [listing.id, listing]));
    const profileById = new Map((profiles || []).map((profile) => [profile.id, profile]));
    conversations.forEach((conversation) => {
      const listing = listingById.get(conversation.listing_id);
      const otherUserId = conversation.buyer_id === currentUser.id ? conversation.seller_id : conversation.buyer_id;
      const profile = profileById.get(otherUserId);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'account-row';
      const details = document.createElement('span');
      const title = document.createElement('strong');
      title.textContent = listing?.title || dict.messageListing;
      const name = document.createElement('span');
      name.textContent = ` · ${profile?.display_name || ''}`;
      details.append(title, name);
      button.appendChild(details);
      button.addEventListener('click', () => runBackendAction(async () => {
        await openConversation(conversation.id, listing?.title || dict.messageListing, otherUserId);
        accountDialog.close();
      }));
      accountContent.appendChild(button);
    });
    return;
  }

  const sourceListings = accountTab === 'favorites'
    ? listings.filter((listing) => favorites.has(listing.id))
    : listings.filter((listing) => listing.seller === currentUser.id);
  if (!sourceListings.length) {
    accountContent.textContent = accountTab === 'favorites' ? dict.emptyFavorites : dict.emptyAccount;
    return;
  }

  sourceListings.forEach((listing) => {
    const row = document.createElement('div');
    row.className = 'account-row';
    const details = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = listing.title;
    const meta = document.createElement('p');
    meta.textContent = `${formatPrice(listing.price)} · ${listing.city}`;
    details.append(title, meta);
    row.appendChild(details);

    if (accountTab === 'listings') {
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'btn btn-secondary small-btn';
      edit.textContent = dict.editListing;
      edit.addEventListener('click', () => {
        accountDialog.close();
        openAdForm(listing);
      });
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'btn btn-secondary small-btn';
      remove.textContent = dict.deleteListing;
      remove.addEventListener('click', () => runBackendAction(async () => {
        if (window.confirm(dict.deleteListing + '?')) await deleteListing(listing);
      }));
      const actions = document.createElement('div');
      actions.className = 'account-row-actions';
      actions.append(edit, remove);
      row.appendChild(actions);
    } else {
      row.addEventListener('click', () => openDetailDialog(listing));
    }
    accountContent.appendChild(row);
  });
}

async function renderComplaintList() {
  const moderationSection = document.querySelector('.moderation-section');
  if (moderationSection) moderationSection.hidden = true;
}

function showAdminError(error) {
  if (adminLoginError) {
    adminLoginError.textContent = error?.message || String(error);
  }
}

async function beginAdminMfa() {
  const { data, error } = await supabaseClient.auth.mfa.listFactors();
  if (error) throw error;
  adminLoginForm.hidden = true;
  adminMfaPanel.hidden = false;
  const verifiedTotp = (data.totp || []).find((factor) => factor.status === 'verified');
  if (verifiedTotp) {
    adminMfaFactorId = verifiedTotp.id;
    adminMfaQr.hidden = true;
    adminMfaInstructions.textContent = 'Gib den aktuellen Code aus deiner Authenticator-App ein.';
  } else {
    const { data: enrolled, error: enrollError } = await supabaseClient.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'Marocmarkt Administrator'
    });
    if (enrollError) throw enrollError;
    adminMfaFactorId = enrolled.id;
    adminMfaQr.src = enrolled.totp.qr_code;
    adminMfaQr.hidden = false;
    adminMfaInstructions.textContent = 'Scanne den QR-Code mit einer Authenticator-App und bestätige anschließend den generierten Code.';
  }
  const { data: challenge, error: challengeError } = await supabaseClient.auth.mfa.challenge({
    factorId: adminMfaFactorId
  });
  if (challengeError) throw challengeError;
  adminMfaChallengeId = challenge.id;
}

async function finishAdminMfa() {
  const { error } = await supabaseClient.auth.mfa.verify({
    factorId: adminMfaFactorId,
    challengeId: adminMfaChallengeId,
    code: document.getElementById('adminMfaCode').value.trim()
  });
  if (error) throw error;
  document.getElementById('adminMfaCode').value = '';
  adminMfaForm.hidden = true;
  adminMfaInstructions.textContent = 'Mehr-Faktor-Authentifizierung bestätigt.';
  const { data: role, error: roleError } = await supabaseClient.rpc('get_platform_admin_role');
  if (roleError) throw roleError;
  adminRole = role || '';
  if (!adminRole) {
    adminSetupForm.hidden = false;
    adminMfaInstructions.textContent = 'Dieses Konto ist noch kein Administrator. Für die Ersteinrichtung benötigst du den einmaligen Token aus dem Supabase SQL Editor.';
    return;
  }
  await openAdminDashboard();
}

async function openAdminDashboard() {
  await renderAdminDashboard();
  adminLoginDialog.close();
  adminSetupForm.hidden = true;
  adminLoginForm.reset();
  adminDashboardDialog.showModal();
}

function createAdminActionButton(label, callback) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn btn-secondary small-btn';
  button.textContent = label;
  button.addEventListener('click', () => runBackendAction(callback));
  return button;
}

async function renderAdminDashboard() {
  if (!supabaseClient || !adminRole) return;
  const status = document.getElementById('adminDashboardStatus');
  status.textContent = `Angemeldet als ${adminRole === 'super_admin' ? 'Super-Administrator' : 'Administrator'} · MFA aktiv`;
  adminManagementSection.hidden = adminRole !== 'super_admin';

  const rows = [];
  for (let offset = 0; ; offset += 500) {
    const { data: page, error } = await supabaseClient
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })
      .order('id')
      .range(offset, offset + 499);
    if (error) throw error;
    rows.push(...(page || []));
    if (!page || page.length < 500) break;
  }
  const adminListings = rows.map((row) => ({
    id: row.id,
    title: row.title,
    seller: row.seller_id,
    sellerName: row.seller_name,
    status: row.status,
    city: row.city,
    price: Number(row.price),
    category: row.category,
    description: row.description,
    imagePaths: row.image_paths || [],
    images: (row.image_paths || []).map(publicImageUrl),
    image: (row.image_paths || []).map(publicImageUrl)[0] || './assets/placeholder.svg'
  }));
  await renderAdminNotifications();
  renderAdminListings(adminListings);
  await renderAdminReports(adminListings);
  await renderAdminAppeals(adminListings);
  await renderAdminAudit();
  if (adminRole === 'super_admin') await renderAdminRoster();
}

async function renderAdminNotifications() {
  const { data, error } = await supabaseClient
    .from('user_notifications')
    .select('id, notification_type, message, created_at, read_at')
    .eq('recipient_id', currentUser.id)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  adminNotificationList.replaceChildren();
  if (!data?.length) {
    adminNotificationList.textContent = 'Keine Benachrichtigungen.';
    return;
  }
  data.forEach((notification) => {
    const row = document.createElement('article');
    row.className = 'admin-record';
    const text = document.createElement('p');
    text.textContent = `${notification.message} · ${new Date(notification.created_at).toLocaleString()}`;
    row.appendChild(text);
    if (!notification.read_at) {
      row.appendChild(createAdminActionButton('Als gelesen markieren', async () => {
        const { error: updateError } = await supabaseClient
          .from('user_notifications')
          .update({ read_at: new Date().toISOString() })
          .eq('id', notification.id)
          .eq('recipient_id', currentUser.id);
        if (updateError) throw updateError;
        await renderAdminNotifications();
      }));
    }
    adminNotificationList.appendChild(row);
  });
}

function renderAdminListings(adminListings) {
  adminListingList.replaceChildren();
  if (!adminListings.length) {
    adminListingList.textContent = 'Keine Anzeigen vorhanden.';
    return;
  }
  adminListings.forEach((listing) => {
    const row = document.createElement('article');
    row.className = 'admin-record';
    const details = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = listing.title;
    const meta = document.createElement('p');
    meta.textContent = `${listing.sellerName} · ${listing.seller} · ${listing.status} · ${listing.city}`;
    details.append(title, meta);
    const actions = document.createElement('div');
    actions.className = 'admin-record-actions';
    actions.appendChild(createAdminActionButton('Prüfen', async () => {
      openDetailDialog(listing);
    }));
    const transitions = listing.status === 'removed'
      ? [['active', 'Wiederherstellen']]
      : listing.status === 'paused'
        ? [['active', 'Freischalten'], ['removed', 'Endgültig entfernen']]
        : [['paused', 'Deaktivieren'], ['removed', 'Endgültig entfernen']];
    transitions.forEach(([newStatus, label]) => {
      actions.appendChild(createAdminActionButton(label, async () => {
        const reason = window.prompt('Begründung (mindestens 5 Zeichen):');
        if (reason === null) return;
        const { error } = await supabaseClient.rpc('admin_set_listing_status', {
          target_listing: listing.id,
          new_status: newStatus,
          action_reason: reason.trim()
        });
        if (error) throw error;
        await loadListings();
        await renderAdminDashboard();
      }));
    });
    row.append(details, actions);
    adminListingList.appendChild(row);
  });
}

async function renderAdminReports(adminListings) {
  const reports = [];
  for (let offset = 0; ; offset += 500) {
    const { data: page, error } = await supabaseClient
      .from('reports')
      .select('id, listing_id, reported_user_id, reporter_id, reason, description, status, created_at')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .order('id')
      .range(offset, offset + 499);
    if (error) throw error;
    reports.push(...(page || []));
    if (!page || page.length < 500) break;
  }
  adminReportList.replaceChildren();
  if (!reports?.length) {
    adminReportList.textContent = 'Keine offenen Beschwerden.';
    return;
  }
  const profileIds = [...new Set(reports.flatMap((report) =>
    [report.reporter_id, report.reported_user_id].filter(Boolean)
  ))];
  const { data: profiles, error: profileError } = profileIds.length
    ? await supabaseClient.from('public_profiles').select('id, display_name').in('id', profileIds)
    : { data: [], error: null };
  if (profileError) throw profileError;
  const names = new Map((profiles || []).map((profile) => [profile.id, profile.display_name]));
  reports.forEach((report) => {
    const item = document.createElement('article');
    item.className = 'admin-record admin-report';
    const details = document.createElement('div');
    const reason = document.createElement('strong');
    reason.textContent = `${report.reason}: ${report.description}`;
    const listing = adminListings.find((entry) => entry.id === report.listing_id);
    const meta = document.createElement('p');
    meta.textContent = `Anzeige: ${listing?.title || 'nicht verfügbar'} · Verkäufer: ${names.get(report.reported_user_id) || report.reported_user_id || listing?.sellerName || '—'} · Meldende Person: ${names.get(report.reporter_id) || report.reporter_id}`;
    details.append(reason, meta);
    const actions = document.createElement('div');
    actions.className = 'admin-record-actions';
    if (listing) {
      actions.appendChild(createAdminActionButton('Anzeige prüfen', async () => openDetailDialog(listing)));
    }
    if (report.reported_user_id) {
      for (const [action, label] of [['warning', 'Verwarnen'], ['suspend', '24 h sperren'], ['ban', 'Dauerhaft sperren'], ['unsuspend', 'Sperre aufheben']]) {
        actions.appendChild(createAdminActionButton(label, async () => {
          const reasonText = window.prompt('Begründung (mindestens 5 Zeichen):');
          if (reasonText === null) return;
          const durationHours = action === 'suspend' ? 24 : null;
          const { error: moderationError } = await supabaseClient.rpc('admin_moderate_user', {
            target_user: report.reported_user_id,
            moderation_action: action,
            action_reason: reasonText.trim(),
            duration_hours: durationHours
          });
          if (moderationError) throw moderationError;
          await renderAdminDashboard();
        }));
      }
    }
    for (const [newStatus, label] of [['resolved', 'Erledigen'], ['dismissed', 'Ablehnen']]) {
      actions.appendChild(createAdminActionButton(label, async () => {
        const reasonText = window.prompt('Begründung (mindestens 5 Zeichen):');
        if (reasonText === null) return;
        const { error: reviewError } = await supabaseClient.rpc('admin_review_report', {
          target_report: report.id,
          new_status: newStatus,
          action_reason: reasonText.trim()
        });
        if (reviewError) throw reviewError;
        await renderAdminDashboard();
      }));
    }
    item.append(details, actions);
    adminReportList.appendChild(item);
  });
}

async function renderAdminAppeals(adminListings) {
  const { data: appeals, error } = await supabaseClient
    .from('moderation_appeals')
    .select('id, user_id, listing_id, moderation_id, message, status, created_at')
    .eq('status', 'open')
    .order('created_at', { ascending: false });
  if (error) throw error;
  adminAppealList.replaceChildren();
  if (!appeals?.length) {
    adminAppealList.textContent = 'Keine offenen Einsprüche.';
    return;
  }
  const userIds = [...new Set(appeals.map((appeal) => appeal.user_id))];
  const { data: profiles, error: profileError } = await supabaseClient
    .from('public_profiles')
    .select('id, display_name')
    .in('id', userIds);
  if (profileError) throw profileError;
  const names = new Map((profiles || []).map((profile) => [profile.id, profile.display_name]));
  appeals.forEach((appeal) => {
    const row = document.createElement('article');
    row.className = 'admin-record';
    const details = document.createElement('div');
    const message = document.createElement('strong');
    message.textContent = appeal.message;
    const listing = adminListings.find((entry) => entry.id === appeal.listing_id);
    const meta = document.createElement('p');
    meta.textContent = `${names.get(appeal.user_id) || appeal.user_id} · ${listing?.title || (appeal.moderation_id ? `Kontomaßnahme #${appeal.moderation_id}` : 'Anzeige nicht verfügbar')} · ${new Date(appeal.created_at).toLocaleString()}`;
    details.append(message, meta);
    const actions = document.createElement('div');
    actions.className = 'admin-record-actions';
    for (const [decision, label] of [['accepted', 'Annehmen'], ['rejected', 'Ablehnen']]) {
      actions.appendChild(createAdminActionButton(label, async () => {
        const reason = window.prompt('Begründung (mindestens 5 Zeichen):');
        if (reason === null) return;
        const { error: reviewError } = await supabaseClient.rpc('admin_review_appeal', {
          target_appeal: appeal.id,
          decision,
          action_reason: reason.trim()
        });
        if (reviewError) throw reviewError;
        await renderAdminDashboard();
      }));
    }
    row.append(details, actions);
    adminAppealList.appendChild(row);
  });
}

async function renderAdminAudit() {
  const { data, error } = await supabaseClient
    .from('admin_action_log')
    .select('admin_id, action, target_type, target_id, reason, created_at')
    .order('created_at', { ascending: false })
    .limit(30);
  if (error) throw error;
  adminAuditList.replaceChildren();
  if (!data?.length) {
    adminAuditList.textContent = 'Noch keine protokollierten Aktionen.';
    return;
  }
  data.forEach((entry) => {
    const row = document.createElement('article');
    row.className = 'admin-record';
    const text = document.createElement('p');
    text.textContent = `${new Date(entry.created_at).toLocaleString()} · ${entry.action} · ${entry.target_type} ${entry.target_id} · Admin ${entry.admin_id} · ${entry.reason}`;
    row.appendChild(text);
    adminAuditList.appendChild(row);
  });
}

async function renderAdminRoster() {
  const { data, error } = await supabaseClient.rpc('admin_list_admins');
  if (error) throw error;
  adminRoster.replaceChildren();
  (data || []).forEach((entry) => {
    const row = document.createElement('article');
    row.className = 'admin-record';
    const text = document.createElement('p');
    text.textContent = `${entry.display_name || 'Ohne Namen'} · ${entry.role} · ${entry.user_id}`;
    row.appendChild(text);
    adminRoster.appendChild(row);
  });
}

async function runBackendAction(action) {
  try {
    await action();
  } catch (error) {
    showNotice(`${getLanguageDictionary().backendUnavailable} ${error.message || error}`, 'error');
  }
}

function applyLanguage(lang) {
  const selectedLanguage = lang === 'ar' ? 'ar' : 'fr';
  const dict = translations[selectedLanguage] || translations.fr;
  const isArabic = selectedLanguage === 'ar';
  document.documentElement.lang = selectedLanguage;
  document.body.dir = isArabic ? 'rtl' : 'ltr';
  document.title = dict.pageTitle;
  document.querySelector('meta[name="description"]')?.setAttribute('content', dict.pageDescription);

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
    const key = el.dataset.i18nAriaLabel;
    if (dict[key]) {
      el.setAttribute('aria-label', dict[key]);
      el.setAttribute('title', dict[key]);
    }
  });

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.placeholder = dict.searchPlaceholder;
  }
  document.getElementById('minimumPriceInput').placeholder = selectedLanguage === 'ar' ? 'من' : 'Min.';
  document.getElementById('maximumPriceInput').placeholder = selectedLanguage === 'ar' ? 'إلى' : 'Max.';
  document.querySelector('.search-shell')?.setAttribute('aria-label', dict.searchLabel);
  navCityFilter?.setAttribute('aria-label', dict.topCities);

  document.querySelectorAll('option[data-de]').forEach((option) => {
    option.textContent = option.dataset[selectedLanguage] || option.dataset.fr;
  });
  if (selectedLanguage === 'fr') {
    document.querySelectorAll('#cityFilter option, #navCityFilter option, #cityInput option').forEach((option) => {
      option.textContent = option.value || (option.closest('#cityInput') ? dict.chooseOption : dict.allCities);
    });
  }

  document.querySelectorAll('[data-form-i18n]').forEach((el) => {
    const key = el.dataset.formI18n;
    if (dict[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
        el.placeholder = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });

  const titleInput = document.getElementById('titleInput');
  if (titleInput) {
    titleInput.placeholder = dict.titlePlaceholder;
  }

  const descriptionInput = document.getElementById('descriptionInput');
  if (descriptionInput) {
    descriptionInput.placeholder = dict.descriptionPlaceholder;
  }

  const complaintMessage = document.getElementById('complaintMessage');
  if (complaintMessage) {
    complaintMessage.placeholder = dict.complaintPlaceholder;
  }

  const closeDialogButtonEl = document.getElementById('closeDialogButton');
  if (closeDialogButtonEl) {
    closeDialogButtonEl.setAttribute('aria-label', dict.detailClose);
  }

  const closeAdDialogButtonEl = document.getElementById('closeAdDialogButton');
  if (closeAdDialogButtonEl) {
    closeAdDialogButtonEl.setAttribute('aria-label', dict.detailClose);
  }

  const complaintTargetLabel = document.querySelector('#complaintTarget')?.closest('label')?.querySelector('span');
  if (complaintTargetLabel) complaintTargetLabel.textContent = dict.complaintTargetLabel;
  const complaintReasonLabel = document.querySelector('#complaintReason')?.closest('label')?.querySelector('span');
  if (complaintReasonLabel) complaintReasonLabel.textContent = dict.complaintReasonLabel;
  const complaintMessageLabel = document.querySelector('#complaintMessage')?.closest('label')?.querySelector('span');
  if (complaintMessageLabel) complaintMessageLabel.textContent = dict.complaintMessageLabel;

  const complaintSubmitButton = document.querySelector('#complaintForm button[type="submit"]');
  if (complaintSubmitButton) complaintSubmitButton.textContent = dict.complaintSubmit;
  const complaintCancelButton = document.getElementById('cancelComplaintButton');
  if (complaintCancelButton) complaintCancelButton.textContent = dict.complaintCancel;
  if (complaintsButton) complaintsButton.textContent = dict.complaintButton;

  const complaintTargetOptions = complaintTarget?.querySelectorAll('option[data-de]');
  complaintTargetOptions?.forEach((option) => {
    option.textContent = option.dataset[selectedLanguage] || option.dataset.fr;
  });

  document.querySelector('.lang-switcher')?.setAttribute('aria-label', dict.languageLabel);
  langButtons.forEach((button) => {
    const isActive = button.dataset.lang === selectedLanguage;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  localStorage.setItem('marocmarkt-lang', selectedLanguage);
  updateAuthUi();
  if (authDialog.open) updateAuthDialog();
  renderListings();
  runBackendAction(renderComplaintList);
  if (accountDialog.open) runBackendAction(renderAccountContent);
}

function formatPrice(value, lang = getCurrentLanguage()) {
  const locale = lang === 'ar' ? 'ar-MA' : 'fr-MA';
  const formatted = Number(value).toLocaleString(locale);
  return lang === 'ar' ? `${formatted} د.م` : `${formatted} MAD`;
}

function getFilteredAndSortedListings() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedCity = cityFilter.value;
  const selectedCategory = categoryFilter.value;
  const sortValue = sortSelect.value;
  const minimumPrice = minimumPriceInput.value === '' ? null : Number(minimumPriceInput.value);
  const maximumPrice = maximumPriceInput.value === '' ? null : Number(maximumPriceInput.value);

  let filtered = [...listings].filter((item) => {
    const textMatch =
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);
    const cityMatch = !selectedCity || item.city === selectedCity;
    const categoryMatch = !selectedCategory || item.category === selectedCategory;
    const minimumPriceMatch = minimumPrice === null || item.price >= minimumPrice;
    const maximumPriceMatch = maximumPrice === null || item.price <= maximumPrice;
    return textMatch && cityMatch && categoryMatch && minimumPriceMatch && maximumPriceMatch;
  });

  if (sortValue === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortValue === 'oldest') {
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return filtered;
}

function createListingCard(item) {
  const card = document.createElement('article');
  card.className = 'listing-card';
  const lang = getCurrentLanguage();

  const imageWrap = document.createElement('div');
  imageWrap.className = 'listing-image-wrap';

  const img = document.createElement('img');
  img.src = getPrimaryImage(item);
  img.alt = item.title;

  const favButton = document.createElement('button');
  favButton.type = 'button';
  favButton.className = `favorite-button ${favorites.has(item.id) ? 'is-favorite' : ''}`;
  favButton.textContent = favorites.has(item.id) ? '♥' : '♡';
  favButton.setAttribute('aria-label', favorites.has(item.id) ? translations[lang].favoriteRemove : translations[lang].favoriteAdd);
  favButton.addEventListener('click', (event) => {
    event.stopPropagation();
    runBackendAction(() => toggleFavorite(item.id, favButton));
  });

  imageWrap.append(img, favButton);

  const info = document.createElement('div');
  info.className = 'listing-info';

  const meta = document.createElement('div');
  meta.className = 'listing-meta';

  const category = document.createElement('span');
  category.className = 'listing-category';
  category.textContent = translations[lang].categoryNames[item.category] || item.category;

  const date = document.createElement('span');
  const locale = lang === 'ar' ? 'ar-MA' : 'fr-FR';
  date.textContent = new Date(item.date).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });

  meta.append(category, date);

  const title = document.createElement('div');
  title.className = 'listing-title';
  title.textContent = item.title;

  const price = document.createElement('div');
  price.className = 'listing-price';
  price.textContent = formatPrice(item.price, lang);

  const locationDate = document.createElement('div');
  locationDate.className = 'location-date';
  const location = document.createElement('span');
  const pin = document.createElement('strong');
  pin.textContent = '📍';
  location.append(pin, document.createTextNode(` ${item.city}`));
  const pubDate = document.createElement('span');
  pubDate.textContent = translations[lang].newLabel;
  locationDate.append(location, pubDate);

  info.append(meta, title, price, locationDate);
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'listing-card-main';
  button.setAttribute('aria-label', `${translations[lang].listingDetails}: ${item.title}`);
  button.addEventListener('click', () => openDetailDialog(item));
  button.appendChild(info);
  card.append(imageWrap, button);
  const isOwner = currentUser && item.seller === currentUser.id;
  if (isOwner) {
    const actions = document.createElement('div');
    actions.className = 'listing-card-actions';
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'btn btn-secondary small-btn';
    editButton.textContent = translations[lang].editListing;
    editButton.addEventListener('click', () => openAdForm(item));
    actions.appendChild(editButton);
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn btn-secondary small-btn';
    deleteButton.textContent = translations[lang].deleteListing;
    deleteButton.addEventListener('click', () => {
      if (!window.confirm(`${translations[lang].deleteListing}: ${item.title}?`)) return;
      runBackendAction(() => deleteListing(item));
    });
    actions.appendChild(deleteButton);
    card.appendChild(actions);
  }
  return card;
}

function renderListings() {
  const filtered = getFilteredAndSortedListings();
  listingGrid.innerHTML = '';
  renderPopular();

  if (filtered.length === 0) {
    listingGrid.innerHTML = `<div class="empty-state">${translations[getCurrentLanguage()].emptyListings}</div>`;
    return;
  }

  filtered.forEach((item) => {
    listingGrid.appendChild(createListingCard(item));
  });

}

function renderPopular() {
  const featured = [...listings]
    .filter((item) => item.featured)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const popular = featured.length ? featured : listings.slice(0, 4);

  popularGrid.innerHTML = '';
  popular.forEach((item) => {
    popularGrid.appendChild(createListingCard(item));
  });
}

function openAccountDialog(tab = accountTab) {
  if (!requireSignedIn()) return;
  accountTab = tab;
  document.querySelectorAll('.account-tab').forEach((button) => {
    const active = button.dataset.accountTab === accountTab;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  accountDialog.showModal();
  runBackendAction(renderAccountContent);
}

async function toggleFavorite(id, buttonElement) {
  if (!requireSignedIn()) return;
  if (favorites.has(id)) {
    const { error } = await supabaseClient.from('favorites')
      .delete()
      .eq('user_id', currentUser.id)
      .eq('listing_id', id);
    if (error) throw error;
    favorites.delete(id);
  } else {
    const { error } = await supabaseClient.from('favorites')
      .insert({ user_id: currentUser.id, listing_id: id });
    if (error) throw error;
    favorites.add(id);
  }
  buttonElement.textContent = favorites.has(id) ? '♥' : '♡';
  buttonElement.classList.toggle('is-favorite', favorites.has(id));
  buttonElement.setAttribute('aria-label', favorites.has(id) ? getLanguageDictionary().favoriteRemove : getLanguageDictionary().favoriteAdd);
  if (accountDialog.open) await renderAccountContent();
}

function openDetailDialog(item) {
  const lang = getCurrentLanguage();
  const dict = getLanguageDictionary();
  const grid = document.createElement('div');
  grid.className = 'detail-grid';
  const gallery = document.createElement('div');
  gallery.className = 'detail-gallery';
  const imageList = item.images?.length ? item.images : [getPrimaryImage(item)];
  imageList.forEach((source) => {
    const image = document.createElement('img');
    image.className = 'detail-image';
    image.src = source;
    image.alt = item.title;
    gallery.appendChild(image);
  });
  const content = document.createElement('div');
  content.className = 'detail-content';
  const badges = document.createElement('div');
  badges.className = 'detail-badges';
  for (const text of [dict.categoryNames[item.category] || item.category, item.city]) {
    const badge = document.createElement('span');
    badge.className = 'detail-badge';
    badge.textContent = text;
    badges.appendChild(badge);
  }
  const title = document.createElement('h2');
  title.textContent = item.title;
  const price = document.createElement('div');
  price.className = 'detail-price';
  price.textContent = formatPrice(item.price, lang);
  const description = document.createElement('div');
  description.className = 'detail-description';
  description.textContent = item.description;
  const meta = document.createElement('div');
  meta.className = 'detail-meta';
  const dateLocale = lang === 'ar' ? 'ar-MA' : 'fr-FR';
  for (const [label, value] of [
    [dict.detailLocation, item.city],
    [dict.detailPublished, new Date(item.date).toLocaleDateString(dateLocale, { day: '2-digit', month: '2-digit', year: 'numeric' })],
    [dict.detailCategory, dict.categoryNames[item.category] || item.category]
  ]) {
    const row = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = `${label}: `;
    row.append(strong, document.createTextNode(value));
    meta.appendChild(row);
  }
  const actions = document.createElement('div');
  actions.className = 'detail-actions';
  if (currentUser && item.seller === currentUser.id) {
    const edit = document.createElement('button');
    edit.type = 'button';
    edit.className = 'btn btn-secondary';
    edit.textContent = dict.editListing;
    edit.addEventListener('click', () => {
      listingDialog.close();
      openAdForm(item);
    });
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'btn btn-secondary';
    remove.textContent = dict.deleteListing;
    remove.addEventListener('click', () => runBackendAction(async () => {
      if (window.confirm(`${dict.deleteListing}?`)) {
        await deleteListing(item);
        listingDialog.close();
      }
    }));
    actions.append(edit, remove);
  } else {
    const contact = document.createElement('button');
    contact.type = 'button';
    contact.className = 'btn btn-primary';
    contact.textContent = dict.contactSeller;
    contact.addEventListener('click', () => runBackendAction(() => createOrOpenConversation(item)));
    actions.appendChild(contact);
    const report = document.createElement('button');
    report.type = 'button';
    report.className = 'btn btn-secondary complaint-trigger';
    report.textContent = dict.reportButton;
    report.addEventListener('click', () => openComplaintDialog(item.seller, item.title, item.id));
    actions.appendChild(report);
  }
  content.append(badges, title, price, description, meta, actions);
  grid.append(gallery, content);
  listingDetailContent.replaceChildren(grid);
  listingDialog.showModal();
}

function closeDetailDialog() {
  listingDialog.close();
}

function openAdForm(listing = null) {
  if (!requireListingEligibility()) return;
  currentEditingListing = listing;
  adForm.reset();
  formError.textContent = '';
  deleteAdButton.hidden = !listing;
  document.querySelector('#adDialog h3').textContent = listing ? getLanguageDictionary().editListing : getLanguageDictionary().adDialogTitle;
  if (listing) {
    document.getElementById('titleInput').value = listing.title;
    document.getElementById('priceInput').value = String(listing.price);
    document.getElementById('categoryInput').value = listing.category;
    document.getElementById('cityInput').value = listing.city;
    document.getElementById('descriptionInput').value = listing.description;
  }
  adDialog.showModal();
}

function openComplaintDialog(userId = 'anonymous', listingTitle = '', listingId = null) {
  if (!requireSignedIn()) return;
  currentReportListing = { userId, listingTitle, listingId };
  if (complaintTarget) {
    const dict = getLanguageDictionary();
    complaintTarget.replaceChildren(new Option(dict.chooseOption, ''));
    listings.filter((item) => item.seller).forEach((item) => {
      complaintTarget.add(new Option(`${item.sellerName || item.seller} · ${item.title}`, item.seller));
    });
    complaintTarget.value = userId !== 'anonymous' ? userId : '';
  }

  if (complaintInfo) {
    const lang = getCurrentLanguage();
    const dict = translations[lang] || translations.fr;
    complaintInfo.textContent = listingTitle ? `${dict.complaintForPrefix} ${listingTitle}` : dict.complaintInfoDefault;
  }

  complaintDialog.showModal();
}

function closeComplaintDialog() {
  complaintDialog.close();
  complaintForm.reset();
  currentReportListing = null;
  if (complaintInfo) {
    complaintInfo.textContent = '';
  }
}

function closeAdForm() {
  adDialog.close();
  adForm.reset();
  formError.textContent = '';
  currentEditingListing = null;
}

function validateListingForm(formData, uploadedImages) {
  const title = String(formData.get('title') || '').trim();
  const price = Number(formData.get('price'));
  const category = String(formData.get('category') || '').trim();
  const city = String(formData.get('city') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const lang = getCurrentLanguage();
  const dict = translations[lang] || translations.fr;

  if (!title || title.length < 3) {
    return dict.validationTitle;
  }

  if (!Number.isFinite(price) || price <= 0) {
    return dict.validationPrice;
  }

  if (!category) {
    return dict.validationCategory;
  }

  if (!city) {
    return dict.validationCity;
  }

  if (!description || description.length < 20) {
    return dict.validationDescription;
  }

  if (uploadedImages.length > 10) {
    return dict.validationImagesLimit;
  }

  return '';
}

imagesInput.addEventListener('change', () => {
  selectedImages.textContent = Array.from(imagesInput.files || [])
    .map((file) => file.name)
    .join(', ');
});

adForm.addEventListener('reset', () => {
  selectedImages.textContent = '';
});

adForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!requireListingEligibility()) return;

  const formData = new FormData(adForm);
  const selectedFiles = Array.from(imagesInput.files || []);
  const error = validateListingForm(formData, selectedFiles);

  if (error) {
    formError.textContent = error;
    return;
  }

  const listingId = currentEditingListing?.id || crypto.randomUUID();
  let uploadedPaths = [];
  try {
    uploadedPaths = await uploadListingImages(selectedFiles, listingId);
    const previousPaths = currentEditingListing?.imagePaths || [];
    const imagePaths = uploadedPaths.length
      ? uploadedPaths
      : previousPaths;
    const payload = {
      seller_id: currentUser.id,
      seller_name: currentProfile?.display_name || getLanguageDictionary().newProfile,
      title: String(formData.get('title')).trim(),
      price: Number(formData.get('price')),
      category: String(formData.get('category')).trim(),
      city: String(formData.get('city')).trim(),
      description: String(formData.get('description')).trim(),
      image_paths: imagePaths
    };
    const { error: saveError } = currentEditingListing
      ? await supabaseClient.from('listings').update(payload).eq('id', listingId).eq('seller_id', currentUser.id)
      : await supabaseClient.from('listings').insert({ ...payload, id: listingId });
    if (saveError) {
      if (uploadedPaths.length) {
        const { error: cleanupError } = await supabaseClient.storage.from('listing-images').remove(uploadedPaths);
        if (cleanupError) throw new Error(`${saveError.message} ${cleanupError.message}`);
      }
      throw saveError;
    }

    const unusedPaths = previousPaths.filter((path) => !imagePaths.includes(path) && !/^https?:\/\//i.test(path) && !path.startsWith('./') && !path.startsWith('/'));
    if (unusedPaths.length) {
      const { error: cleanupError } = await supabaseClient.storage.from('listing-images').remove(unusedPaths);
      if (cleanupError) showNotice(cleanupError.message, 'error');
    }
    closeAdForm();
    await loadListings();
    if (accountDialog.open) await renderAccountContent();
    showNotice(getLanguageDictionary().listingSaved, 'success');
  } catch (saveError) {
    formError.textContent = saveError instanceof TypeError && saveError.message === 'Failed to fetch'
      ? getLanguageDictionary().backendUnavailable
      : saveError.message || String(saveError);
  }
});

complaintForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!requireSignedIn()) return;
  const formData = new FormData(complaintForm);
  const userId = String(formData.get('complaintTarget') || currentReportListing?.userId || '').trim();
  const reason = String(formData.get('complaintReason') || '').trim();
  const message = String(formData.get('complaintMessage') || '').trim();

  if (!userId || !reason || !message) {
    if (complaintInfo) {
      complaintInfo.textContent = translations[getCurrentLanguage()].complaintValidation;
    }
    return;
  }

  runBackendAction(async () => {
    const { error } = await supabaseClient.from('reports').insert({
      reporter_id: currentUser.id,
      listing_id: currentReportListing?.listingId || null,
      reported_user_id: userId || null,
      reason,
      description: message
    });
    if (error) throw error;
    closeComplaintDialog();
    showNotice(getLanguageDictionary().reportSent, 'success');
  });
});

searchInput.addEventListener('input', renderListings);
cityFilter.addEventListener('change', () => {
  if (navCityFilter) {
    navCityFilter.value = cityFilter.value;
  }
  renderListings();
});
navCityFilter?.addEventListener('change', () => {
  if (cityFilter) {
    cityFilter.value = navCityFilter.value;
  }
  renderListings();
});
categoryFilter.addEventListener('change', renderListings);
sortSelect.addEventListener('change', renderListings);
minimumPriceInput.addEventListener('input', renderListings);
maximumPriceInput.addEventListener('input', renderListings);
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    renderListings();
  }
});

document.getElementById('searchButton').addEventListener('click', renderListings);

document.querySelectorAll('.category-card').forEach((button) => {
  button.addEventListener('click', () => {
    const category = button.dataset.category;
    categoryFilter.value = category;
    renderListings();
    document.getElementById('latest').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

sellButton.addEventListener('click', () => openAdForm());
messageNotificationsButton.addEventListener('click', () => openAccountDialog('messages'));
complaintsButton?.addEventListener('click', () => openComplaintDialog());
adminAccessButton?.addEventListener('click', () => {
  window.location.assign('/admin/');
});
document.getElementById('closeAdminLoginButton')?.addEventListener('click', () => {
  adminLoginForm.reset();
  adminSetupForm.reset();
  adminMfaForm.reset();
  adminLoginDialog.close();
});
document.getElementById('closeAdminDashboardButton')?.addEventListener('click', () => adminDashboardDialog.close());
document.getElementById('adminDashboardLogoutButton')?.addEventListener('click', async () => {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    showNotice(`${getLanguageDictionary().backendUnavailable} ${error.message}`, 'error');
    return;
  }
  adminRole = '';
  window.location.replace('/admin/');
});
adminLoginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!supabaseClient) {
    showAdminError(new Error(getLanguageDictionary().backendNotConfigured));
    return;
  }
  const submitButton = adminLoginForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  adminLoginError.textContent = '';
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: document.getElementById('adminEmail').value.trim(),
      password: document.getElementById('adminPassword').value
    });
    if (error) throw error;
    if (!data.session) throw new Error('Die Anmeldung wurde nicht abgeschlossen.');
    document.getElementById('adminPassword').value = '';
    await beginAdminMfa();
  } catch (error) {
    showAdminError(error);
    if (!adminMfaPanel.hidden) {
      adminLoginForm.hidden = false;
      adminMfaPanel.hidden = true;
      adminMfaForm.hidden = false;
      adminSetupForm.hidden = true;
    }
  } finally {
    submitButton.disabled = false;
  }
});
adminMfaForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = adminMfaForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  adminLoginError.textContent = '';
  try {
    await finishAdminMfa();
  } catch (error) {
    showAdminError(error);
  } finally {
    submitButton.disabled = false;
  }
});
adminSetupForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = adminSetupForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  adminLoginError.textContent = '';
  try {
    const { data, error } = await supabaseClient.rpc('bootstrap_super_admin', {
      setup_token: document.getElementById('adminSetupToken').value.trim()
    });
    if (error) throw error;
    adminRole = data;
    document.getElementById('adminSetupToken').value = '';
    await openAdminDashboard();
  } catch (error) {
    showAdminError(error);
  } finally {
    submitButton.disabled = false;
  }
});
document.getElementById('adminManagementForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const reason = window.prompt('Begründung für die Rollenänderung (mindestens 5 Zeichen):');
  if (reason === null) return;
  const { error } = await supabaseClient.rpc('admin_manage_admin', {
    target_user: document.getElementById('managedAdminId').value.trim(),
    new_role: document.getElementById('managedAdminRole').value,
    action_reason: reason.trim()
  });
  if (error) {
    showNotice(`${getLanguageDictionary().backendUnavailable} ${error.message}`, 'error');
    return;
  }
  document.getElementById('adminManagementForm').reset();
  await runBackendAction(renderAdminDashboard);
});
complaintCloseButton?.addEventListener('click', closeComplaintDialog);
cancelComplaintButton?.addEventListener('click', closeComplaintDialog);
closeAdDialogButton.addEventListener('click', closeAdForm);
cancelAdButton.addEventListener('click', closeAdForm);
deleteAdButton.addEventListener('click', () => {
  const listing = currentEditingListing;
  if (!listing || !window.confirm(`${getLanguageDictionary().deleteListing}: ${listing.title}?`)) return;
  runBackendAction(async () => {
    await deleteListing(listing);
    closeAdForm();
  });
});
closeDialogButton.addEventListener('click', closeDetailDialog);
listingDialog.addEventListener('click', (event) => {
  if (event.target === listingDialog) {
    closeDetailDialog();
  }
});
complaintDialog?.addEventListener('click', (event) => {
  if (event.target === complaintDialog) {
    closeComplaintDialog();
  }
});

loginButton.addEventListener('click', () => {
  if (currentUser) openAccountDialog();
  else openAuthDialog();
});
logoutButton.addEventListener('click', () => runBackendAction(async () => {
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
  clearNotice();
}));
authDialog.addEventListener('click', (event) => {
  if (event.target === authDialog) authDialog.close();
});
accountDialog.addEventListener('click', (event) => {
  if (event.target === accountDialog) accountDialog.close();
});
chatDialog.addEventListener('click', (event) => {
  if (event.target === chatDialog) chatDialog.close();
});
document.getElementById('closeAuthDialogButton').addEventListener('click', () => authDialog.close());
document.getElementById('closeAccountDialogButton').addEventListener('click', () => accountDialog.close());
document.getElementById('closeChatDialogButton').addEventListener('click', () => chatDialog.close());
document.getElementById('toggleAuthModeButton').addEventListener('click', () => {
  authMode = authMode === 'signin' ? 'signup' : 'signin';
  updateAuthDialog();
});
document.getElementById('resendPhoneCodeButton').addEventListener('click', () => {
  const button = document.getElementById('resendPhoneCodeButton');
  button.disabled = true;
  sendPhoneVerification(currentProfile?.phone, true)
    .catch((error) => {
      authError.textContent = error.message || String(error);
    })
    .finally(() => {
      button.disabled = false;
    });
});
document.getElementById('forgotPasswordButton').addEventListener('click', async () => {
  if (!requireBackend()) return;
  const emailInput = document.getElementById('authEmail');
  const email = emailInput.value.trim();
  if (!email || !emailInput.checkValidity()) {
    authError.textContent = getLanguageDictionary().passwordRequired;
    emailInput.focus();
    return;
  }

  const button = document.getElementById('forgotPasswordButton');
  button.disabled = true;
  try {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${window.location.pathname}`
    });
    if (error) throw error;
    authError.textContent = getLanguageDictionary().resetPasswordSent;
  } catch (error) {
    authError.textContent = error.message || String(error);
  } finally {
    button.disabled = false;
  }
});
document.querySelectorAll('.account-tab').forEach((button) => {
  button.addEventListener('click', () => {
    accountTab = button.dataset.accountTab;
    document.querySelectorAll('.account-tab').forEach((tab) => {
      const active = tab === button;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    runBackendAction(renderAccountContent);
  });
});
authForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!requireBackend()) return;
  const formData = new FormData(authForm);
  const mode = authMode;
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const displayName = String(formData.get('displayName') || '').trim();
  const address = String(formData.get('address') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const submitButton = document.getElementById('authSubmitButton');
  submitButton.disabled = true;
  (async () => {
    try {
      if (mode === 'phoneVerification') {
        const token = String(formData.get('otp') || '').trim();
        if (!token) throw new Error(getLanguageDictionary().phoneOtpRequired);
        const verified = await supabaseClient.auth.verifyOtp({
          phone: currentProfile?.phone || '',
          token,
          type: 'phone_change'
        });
        if (verified.error) throw verified.error;
        if (!verified.data.user) throw new Error(getLanguageDictionary().backendUnavailable);
        currentUser = verified.data.user;
        phoneVerificationPendingFor = '';
        await loadProfile(currentUser);
        authDialog.close();
        authForm.reset();
        authMode = 'signin';
        updateAuthDialog();
        showNotice(getLanguageDictionary().phoneOtpVerified, 'success');
        return;
      }

      if (mode === 'contactSetup') {
        if (!address) throw new Error(getLanguageDictionary().contactDetailsRequired);
        if (!/^\+[1-9]\d{7,14}$/.test(phone)) throw new Error(getLanguageDictionary().phoneInvalid);
        const { error } = await supabaseClient.from('profiles')
          .update({ address, phone })
          .eq('id', currentUser.id);
        if (error) throw error;
        currentProfile = { ...currentProfile, address, phone };
        await sendPhoneVerification(phone, true);
        return;
      }

      if (mode === 'signup') {
        if (!displayName || !address) throw new Error(getLanguageDictionary().contactDetailsRequired);
        if (!/^\+[1-9]\d{7,14}$/.test(phone)) throw new Error(getLanguageDictionary().phoneInvalid);
      }

      const result = mode === 'signup'
        ? await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName, address, phone },
            emailRedirectTo: window.location.href
          }
        })
        : mode === 'recovery'
          ? await supabaseClient.auth.updateUser({ password })
          : await supabaseClient.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      if (mode === 'recovery') {
        authDialog.close();
        authForm.reset();
        authMode = 'signin';
        updateAuthDialog();
        showNotice(getLanguageDictionary().passwordUpdated, 'success');
        return;
      }
      if (mode === 'signup' && !result.data.session) {
        authError.textContent = getLanguageDictionary().authConfirmEmail;
        return;
      }
      currentUser = result.data.user;
      await loadProfile(currentUser);
      if (authMode === 'phoneVerification' || authMode === 'contactSetup') return;
      authDialog.close();
      authForm.reset();
      clearNotice();
    } catch (error) {
      authError.textContent = error.message || String(error);
    }
  })().finally(() => {
    submitButton.disabled = false;
  });
});
chatDialog.addEventListener('close', () => {
  if (chatRefreshTimer) clearInterval(chatRefreshTimer);
  chatRefreshTimer = null;
  activeConversation = null;
  chatMessages.replaceChildren();
});
chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!requireSignedIn() || !activeConversation) return;
  const body = chatMessageInput.value.trim();
  if (!body) return;
  const submitButton = chatForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  runBackendAction(async () => {
    const { error } = await supabaseClient.from('messages').insert({
      conversation_id: activeConversation.id,
      sender_id: currentUser.id,
      body
    });
    if (error) throw error;
    chatForm.reset();
    await loadChatMessages();
    showNotice(getLanguageDictionary().messageSent, 'success');
  }).finally(() => {
    submitButton.disabled = false;
  });
});

langButtons.forEach((button) => {
  button.addEventListener('click', () => {
    applyLanguage(button.dataset.lang || 'de');
  });
});

applyLanguage(getCurrentLanguage());
renderListings();
runBackendAction(initializeBackend);
