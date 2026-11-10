# Marocmarkt

Marocmarkt ist eine mehrsprachige Kleinanzeigen-Webseite für Marokko. Das Frontend verwendet HTML, CSS und JavaScript; Konten, Anzeigen, Favoriten, Meldungen, Nachrichten und Bilder werden über Supabase gespeichert.

## Projektstruktur

- `index.html`, `style.css`, `script.js`: Website
- `supabase/schema.sql`: Datenbankschema, RLS-Regeln und Bildspeicher
- `supabase-config.js`: öffentliche Supabase-Projektkonfiguration
- `assets/`: lokale Bilder und Icons

## Supabase einrichten

1. Erstelle ein Supabase-Projekt.
2. Öffne den SQL Editor im Supabase-Dashboard und führe den Inhalt von `supabase/schema.sql` aus.
3. Aktiviere unter **Authentication → Providers** die E-Mail-Anmeldung und E-Mail-Bestätigung. Trage unter den Auth-URL-Einstellungen deine lokale URL und später deine Produktionsdomain als Redirect-URLs ein, damit E-Mail-Bestätigung und Passwortzurücksetzung zur Website zurückführen.
4. Kopiere Projekt-URL und den öffentlichen **anon/publishable key** aus den API-Einstellungen in `supabase-config.js`:

   ```js
   window.MAROCMARKT_SUPABASE = {
     url: 'https://DEIN-PROJEKT.supabase.co',
     anonKey: 'DEIN_OEFFENTLICHER_ANON_ODER_PUBLISHABLE_KEY'
   };
   ```

   Der anon/publishable key ist für die Verwendung im Browser bestimmt; der Datenzugriff wird durch Row Level Security begrenzt. **Niemals** den `service_role`-Key in diese Datei oder in das Frontend eintragen.

5. Starte die Website über einen lokalen HTTP-Server:

   ```bash
   python3 -m http.server 8080
   ```

   Öffne danach `http://localhost:8080/`.

   Bei der Registrierung sind Adresse, E-Mail-Adresse und Passwort erforderlich. Eine Handynummer kann optional angegeben werden; eine SMS-Bestätigung ist nicht erforderlich. Vor der Anmeldung muss die E-Mail-Adresse über den Link im Postfach bestätigt werden. Mit bestätigter E-Mail-Adresse und gespeicherter Adresse können Anzeigen veröffentlicht und bearbeitet werden.

   Führe das aktualisierte `supabase/schema.sql` auch für bestehende Projekte im SQL Editor aus. Die Datenbankrichtlinien erzwingen die E-Mail-Bestätigung und eine gespeicherte Adresse beim Erstellen und Bearbeiten von Anzeigen.

### Super-Administrator einmalig einrichten

Führe zuerst das aktualisierte `supabase/schema.sql` im SQL Editor des Supabase-Projekts aus. Die alten `profiles.is_admin`-Werte vergeben **keine** Rechte im neuen Administrationssystem.

1. Registriere dein persönliches Konto über die normale Anmeldung und bestätige die E-Mail-Adresse. Verwende ein starkes, nur hier genutztes Passwort.
2. Öffne in Supabase **Authentication → Providers / Sign In → Authenticator Assurance Level (MFA)** und stelle sicher, dass TOTP-Authenticator-Faktoren aktiviert sind.
3. Öffne den SQL Editor als Projekteigentümer und führe genau einmal aus:

   ```sql
   select public.issue_super_admin_setup_token();
   ```

   Kopiere das Ergebnis direkt aus der SQL-Editor-Antwort. Das Token wird zufällig generiert, nur gehasht gespeichert, läuft nach 30 Minuten ab und kann nur einmal eingelöst werden. Es ist nicht wieder abrufbar. Teile es nicht und speichere es nicht im Quellcode. Bei Ablauf kann der Projekteigentümer den Befehl erneut ausführen.
4. Öffne `https://DEINE-DOMAIN/admin/` (lokal zum Beispiel `http://localhost:8080/admin/`) oder wähle **Admin-Zugang** ganz unten im Footer. Melde dich dort mit der E-Mail und dem Passwort deines bestätigten Kontos an. Richte eine Authenticator-App ein oder gib den angeforderten TOTP-Code ein.
5. Gib nach erfolgreicher MFA-Prüfung das Setup-Token in der Ersteinrichtung ein. Das Konto erhält dadurch die Rolle `super_admin`.
6. Bewahre Wiederherstellungszugang zur Authenticator-App sicher auf. Der Super-Admin kann danach weitere Administratoren anhand ihrer bestehenden Benutzer-UUID verwalten. Auch diese Konten müssen MFA verwenden.

Die Admin-Anmeldeseite speichert kein eigenes Passwort und enthält keine Zugangsdaten im Quellcode. E-Mail und Passwort werden beim normalen Marocmarkt-Konto über Supabase Auth festgelegt; die Admin-Seite prüft dieselben Zugangsdaten und fordert zusätzlich MFA. Nach der Prüfung leitet sie zum Admin-Dashboard weiter. Dashboard-Routen prüfen die Admin-Rolle erneut serverseitig. Im Dashboard kannst du dich über **Abmelden** ausloggen.

Das Setup-Token kann nur im SQL Editor durch den Projekteigentümer erzeugt werden; die Funktion ist nicht für Browser- oder API-Aufrufe freigegeben. Administratorrollen, Moderationsaktionen, Archivierung, Sperren und Aktionsprotokolle werden in PostgreSQL/RLS geprüft. Im Browser liegt weder ein Passwort noch ein Setup-Geheimnis. Admin-Aktionen benötigen eine AAL2/MFA-Session und eine Begründung. Ein temporärer oder dauerhafter Kontobann blockiert serverseitig Schreibaktionen auf Anzeigen, Meldungen, Nachrichten, Favoriten, Profil und Bilder. Anzeigen mit externen Links werden zusätzlich als Prüfhinweis an Administratoren gemeldet. Nutzer können eigene entfernte Anzeigen und Kontomaßnahmen im Konto-Bereich anfechten.

Gelöschte Anzeigen werden zunächst mit ihrem Inhalt und Löschgrund im wiederherstellbaren Moderationsarchiv aufbewahrt und für Nutzer ausgeblendet. Beachte bei Aufbewahrung und endgültiger Löschung die für deinen Betrieb geltenden Datenschutz- und Aufbewahrungspflichten.

### „Invalid login credentials“ sicher prüfen

Diese Meldung kommt vom Passwort-Login in Supabase Auth. Sie bedeutet, dass die eingegebene E-Mail/Passwort-Kombination für das in `supabase-config.js` konfigurierte Supabase-Projekt nicht akzeptiert wurde. Zu diesem Zeitpunkt sind MFA, Super-Admin-Rolle und Setup-Token noch nicht geprüft. Häufige Ursachen sind ein anderes Supabase-Projekt, eine abweichende E-Mail-Adresse, ein falsches Passwort oder ein nicht fertig bestätigtes Konto. Das Passwort nicht in SQL eingeben oder an Dritte senden.

1. Vergleiche die Projekt-URL in `supabase-config.js` mit der Projekt-URL in deinem Supabase-Dashboard. Prüfe dort **Authentication → Users**, ob dein Konto mit exakt dieser E-Mail vorhanden ist und ob **Email confirmed** angezeigt wird. Diese Ansicht prüft nur das ausgewählte Supabase-Projekt.
2. Der folgende nur lesende SQL-Check kann im SQL Editor des Projekts zusätzlich Konto, Bestätigungszeit, MFA-Faktoren und neue Admin-Rolle prüfen. Er liest weder Passwort noch Token. Ersetze den Platzhalter in der WHERE-Klausel selbst und teile die Ausgabe nicht öffentlich:

   ```sql
   select
     u.id,
     u.email,
     u.email_confirmed_at,
     (p.id is not null) as profile_exists,
     coalesce(p.is_admin, false) as legacy_is_admin_not_used_for_new_admin_login,
     a.role as platform_admin_role,
     coalesce(
       jsonb_agg(
         jsonb_build_object('factor_type', f.factor_type, 'status', f.status)
       ) filter (where f.id is not null),
       '[]'::jsonb
     ) as mfa_factors
   from auth.users u
   left join public.profiles p on p.id = u.id
   left join public.platform_admins a on a.user_id = u.id
   left join auth.mfa_factors f on f.user_id = u.id
   where lower(u.email) = lower('DEINE-E-MAIL-ADRESSE')
   group by u.id, u.email, u.email_confirmed_at, p.id, p.is_admin, a.role;
   ```

   Keine Ergebniszeile bedeutet: Diese E-Mail ist in diesem Supabase-Projekt nicht registriert. `email_confirmed_at` muss gesetzt sein. `platform_admin_role` ist zunächst leer und wird erst nach dem einmaligen Setup zu `super_admin`. Ein `mfa_factors`-Eintrag mit `factor_type = totp` und `status = verified` zeigt eine bestätigte Authenticator-App. `legacy_is_admin_not_used_for_new_admin_login` ist das alte Feld und gewährt dem separaten Super-Admin-System keine Rolle.
3. Falls das Konto fehlt, registriere es über die Website und bestätige die Verifizierungs-E-Mail. Falls es existiert, aber unbestätigt ist, löse im Supabase-Dashboard für genau dieses Konto eine neue Bestätigungs-E-Mail aus. Bei einem tatsächlich falschen/vergessenen Passwort verwende den normalen **Passwort vergessen**-Ablauf; es gibt keinen Admin-Bypass.
4. Erst wenn E-Mail und Passwort funktionieren, melde dich unter `/admin/` an. Beim ersten Anmelden richtet die Admin-Seite TOTP ein: QR-Code mit einer Authenticator-App scannen und den aktuellen Code bestätigen. Danach ist die MFA-Session für das einmalige Setup erforderlich.
5. Wenn noch kein `super_admin` existiert, erzeuge als Projekteigentümer im SQL Editor das Setup-Token mit `select public.issue_super_admin_setup_token();`. Es erscheint nur in der SQL-Antwort, wird serverseitig ausschließlich gehasht gespeichert, läuft nach 30 Minuten ab und kann einmal verwendet werden. Gib es nur im Setup-Formular der Admin-Seite ein. Falls bereits ein nicht abgelaufenes Token existiert, kann kein weiteres erzeugt werden; verwende dieses innerhalb der Frist. Bei Ablauf kann der Projekteigentümer ein neues anfordern.
6. Nach erfolgreicher Einrichtung den Diagnose-Check erneut ausführen. Er sollte `email_confirmed_at`, einen verifizierten TOTP-Faktor und `platform_admin_role = super_admin` zeigen. Erst danach führt die Admin-Anmeldung zum Dashboard.

Wenn **Invalid login credentials** trotz bestätigtem Konto weiterhin erscheint, prüfe die Projekt-URL und die Auth-Logs unter **Supabase → Authentication → Logs**. Teile niemals Passwort, TOTP-Code oder Setup-Token. Bereits vorhandene Anzeigen, Konten und andere Projektdaten müssen für diese Diagnose nicht gelöscht oder verändert werden.

## Funktionen

- Französisch und Arabisch
- Suche, Stadt-/Kategorie-Filter und Sortierung
- Registrierung mit Adresse, E-Mail und Passwort; Anmeldung erst nach E-Mail-Bestätigung
- Anzeigen mit bestätigtem E-Mail-Konto und gespeicherter Adresse veröffentlichen und bearbeiten
- Anzeigen dauerhaft speichern, bearbeiten und löschen
- Mehrere Bilder pro Anzeige (JPG, PNG oder WebP; maximal 10 Bilder zu je 5 MB)
- Kontoansicht für eigene Anzeigen, Favoriten und Nachrichten
- Private Nachrichten zwischen Käufer und Verkäufer
- Meldungen und ein separates, TOTP-geschütztes Administrator-Dashboard
- Einmalige Super-Admin-Ersteinrichtung, rollenbasierte Admin-Verwaltung, Anzeigenarchiv, Benutzermaßnahmen und unveränderbares Aktionsprotokoll

Ohne Supabase-Konfiguration zeigt die Seite Demo-Anzeigen. Konten und Backend-Funktionen sind dann nicht verfügbar.
