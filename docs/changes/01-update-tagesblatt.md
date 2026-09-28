# Änderung 01: Tagesblatt — vollflächige Tagesansicht mit neuen Kategorien
Typ: Update · Stand: 2026-09-28 · Status: geplant
Zweig: change/01-tagesblatt

## Anliegen
INI:GO ist heute ein Pomodoro-Timer mit einem täglichen Kurz-Check-in (Workout,
Schritte, Schlaf, Recovery, Gratitude, Mood) in einem kleinen Popup-Fenster.
Alan möchte die App um vier neue Tages-Kategorien erweitern: **Journal**,
**Trainings-Protokoll**, **Skincare-Routine** und ein **Emotions-Logbuch**.

Nach gemeinsamem Brainstorming ist die Richtung klar: keine Tab-Leiste oben
(zu wenig Platz, entwertet den Timer als Herzstück der App). Stattdessen wird
die Jahres-Heatmap — die es schon gibt und die schon anklickbar ist — zum
Einstiegspunkt in eine neue **vollflächige Tagesansicht ("Tagesblatt")**, die
beim Klick auf einen Tag das komplette Fenster einnimmt (statt wie bisher ein
kleines zentriertes Popup). Das Tagesblatt bündelt fünf Bereiche für den
gewählten Tag: Check-in-Werte (bestehend), Emotionen, Training, Skincare,
Journal.

Der Timer-Startbildschirm bleibt dabei unverändert — die neue Tiefe steckt
ausschließlich hinter dem Klick auf einen Kalendertag.

**Ausdrücklich vertagt** (siehe Scope-Grenze): Daily-Routine-Reminder
("um 15 Uhr Dehnen") und die detaillierte Trainings-Protokollierung mit
einzelnen Übungen/Sätzen/Gewicht — beides kommt als eigene, spätere Änderung.

## Ist-Analyse (Stand: 2026-09-28)
Organisch gewachsenes Projekt ohne vorherige `docs/` — die folgende Analyse
stammt ausschließlich aus dem Code selbst.

**Architektur:** Electron-App, eine einzige `index.html` (~2710 Zeilen, HTML+
CSS+JS in einer Datei), `main.js` als Hauptprozess (IPC für Datei-I/O und
Fenstersteuerung), `preload.js` als schmale Context-Bridge (`window.api.*`).
Kein Framework, kein Build-Schritt für den Renderer-Code — die Datei wird
direkt geladen.

**Bildschirmaufbau heute** (`index.html:923-1002`): ein einziger sichtbarer
Screen — `.timer-section` (Pomodoro-Timer, fix `padding-top:168px`) über
`.heatmap-section` (Jahres-Heatmap). Fenstergröße `980×580`, minimal
`640×500` (`main.js:88-92`). Kopfbereich ist bereits dreifach belegt:
Fensterleiste (`#titlebar`), Support-Herz oben links (`#supportToggle`),
Zahnrad-Menü oben rechts (`#settingsToggle` → `#settingsMenu` mit Timer
Settings / Trackers / Statistics / Backup / Bug Report / About). Alles
Weitere läuft über `.overlay`/`.modal` — zentrierte Popups mit
`max-width:420px`, `max-height:85vh` (`index.html:628-636`).

**Heatmap → Check-in (heutiger Weg):** Klick auf eine Zelle ruft
`openCheckin(k)` auf (`index.html:1982`), sofern die Zelle nicht in der
Zukunft liegt. `openCheckin(key)` (`index.html:2065-2149`) baut das
Modal-HTML aus `trackersConfig` (den konfigurierten Trackern) und dem
bestehenden Eintrag `DATA[key]`, öffnet `#overlay`. Drei weitere Aufrufstellen
öffnen automatisch denselben Check-in für **heute**:
- nach Onboarding, einmalig (`index.html:1432`)
- beim täglichen ersten Start, wenn heute noch kein Check-in stattfand
  (`index.html:2701-2705`, gesteuert über `CHECKIN_DATE_KEY`)
- danach folgt ggf. das `dailyPopupOverlay` (Rückblick auf gestern,
  `checkDailyPopup()`, `index.html:2588-2645`) — verkettet über
  `pendingDailyPopup` und `closeCheckin()` (`index.html:2151-2159`)

`closeCheckin()` macht mehr als nur schließen: sie setzt
`CHECKIN_DATE_KEY = today()` (markiert den Tag als "heute schon gecheckt")
und triggert danach ggf. das Popup. Der globale `Escape`-Handler
(`index.html:1316-1323`) behandelt `#overlay` explizit vorrangig und ruft
dafür extra `closeCheckin()` statt der generischen Overlay-Schließlogik —
das ist bewusst so gebaut, damit dieses Verhalten bei jedem Escape-Druck
erhalten bleibt.

**Datenhaltung — zwei getrennte Speicher, das ist heute schon eine
Bruchstelle:**
- `DATA` (`index.html:1161`) — ein Tageseintrag pro Datumsschlüssel
  (`YYYY-MM-DD`), z. B. `DATA["2026-09-28"] = { sport:"yes", steps:8000,
  mood:4, gratitude:"…", ts:"…" }`. Wird über `window.api.loadData()` /
  `saveData()` geladen/gespeichert (`preload.js:5-6` → `main.js:28-45`),
  landet **atomar** in `%APPDATA%/INIGO-data/data.json`
  (`main.js:19-21,34-45`, Tmp-Write + Rename).
- `trackersConfig`, das Pomodoro-Session-Log und die Timer-Minuten liegen
  dagegen **nur in `localStorage`** (`index.html:1852`, `1183`, `1477-1481`)
  — nicht in `data.json`.
- Das JSON-Backup (`index.html:2163-2167`, Klick auf "↓ Create Backup")
  exportiert `{ data: DATA, sessions: loadSessionLog() }` — es sichert also
  `DATA` **vollständig** (jedes Feld, das dort landet, ist automatisch mit
  im Backup), aber **nicht** `trackersConfig`. Ein CSV-Export existiert nicht
  mehr (wurde in Commit `447e9ed` entfernt — README ist an dieser Stelle
  veraltet, das ist aber nicht Teil dieser Änderung).

**Tracker-Konfiguration** (`index.html:1829-1888`) ist bereits ein
funktionierendes Muster für "vom Nutzer konfigurierbare Liste von Feldern":
vier Typen (`scale` 1–5, `number`, `yesno`, `text`), je Feld
`label`/`question`/`enabled`/`showInSummary`, mit Default-Migration beim
Laden. Dieses Muster eignet sich als Vorlage für konfigurierbare
Skincare-Schritte (siehe Soll-Zustand).

**Mood-Wert:** `entry.mood` treibt die Heatmap-Zellfarbe (`c.classList.add('m'
+ entry.mood)`, `index.html:1974`) und ist als einziger Tracker `locked`
(`index.html:1836`) — kann nicht deaktiviert werden. Das Emotions-Logbuch
(siehe unten) baut bewusst auf diesem Wert auf, statt ihn zu duplizieren.

## Nullpunkt (Stand vor der Änderung)
Kein automatisierter Test vorhanden (`package.json` hat kein `test`-Skript,
kein Test-Ordner im Repo). Electron-Abhängigkeit ist installiert
(`node_modules/electron` vorhanden). Die App ist eine GUI-Anwendung, die sich
in dieser Terminal-Session nicht headless verifizieren lässt; Alan hat selbst
bestätigt, dass sie "soweit sehr gut" läuft. Als Sicherheitsnetz für die
Umsetzung gilt daher: **vor dem ersten Segment app manuell starten
(`npm start`) und den bisherigen Ablauf einmal durchklicken** (Timer starten,
einen Heatmap-Tag anklicken, Check-in speichern) — das ist die einzig
verlässliche Baseline hier.

Kein `docs/`-Ordner vorhanden — dieses Dokument und `docs/decisions.md` sind
die ersten ihrer Art in diesem Projekt.

## Soll-Zustand
1. **Klick auf einen (nicht-zukünftigen) Heatmap-Tag öffnet das Tagesblatt**
   — eine neue, vollflächige Ansicht (nimmt das komplette Fenster ein,
   ersetzt sichtbar Timer + Heatmap, nicht mehr das kleine `#overlay`-Modal).
   Ein Weg zurück zur Startseite (z. B. X-Button oder Escape) ist Pflicht.
2. Das Tagesblatt zeigt fünf Bereiche für den gewählten Tag:
   - **Check-in-Werte** — die bestehenden, konfigurierten Tracker (Workout,
     Schritte, Schlaf, Recovery, Gratitude) wie bisher, nur am neuen Ort statt
     im kleinen Modal. Fachlich unverändert.
   - **Emotionen** — der bestehende `mood`-Wert (1–5, aus den Check-in-Werten
     übernommen, keine Dopplung) plus ein neues freies Notizfeld
     ("was hat den Tag geprägt"). **Ein** Eintrag pro Tag, kein Log über den
     Tagesverlauf.
   - **Training** — einfache Erfassung: Art (Auswahl, z. B. Kraft/Cardio/
     Sonstiges), Dauer in Minuten, freier Notiztext. Kein strukturiertes
     Übungs-/Satz-Protokoll (das ist explizit spätere Ausbaustufe, siehe
     Scope-Grenze).
   - **Skincare** — Checkliste mit Schritten, getrennt nach Morgens/Abends,
     zum Abhaken. Die Schritte selbst sind konfigurierbar, nach demselben
     Muster wie die heutige Tracker-Konfiguration (`index.html:1829-1888`)
     — eigene Konfigurationsliste, eigene Defaults, aber analoge Struktur.
   - **Journal** — freier Text, mehrere Einträge pro Tag möglich, je Eintrag
     mit Uhrzeit versehen (wie ein klassisches Tagebuch).
3. Alle neuen Felder werden **additiv unter `DATA[dateKey]`** gespeichert
   (also über `window.api.saveData`, landet in `data.json`) — **nicht** in
   `localStorage`. Damit sind sie automatisch im bestehenden JSON-Backup
   enthalten, ohne dass am Export-Code etwas geändert werden muss (siehe
   Ist-Analyse: `DATA` wird dort bereits vollständig gespiegelt).
4. Bestehende Check-in-Daten (`sport`, `steps`, `sleep`, `meditation`,
   `gratitude`, `mood`) bleiben unverändert lesbar und editierbar — sie
   ziehen ins Tagesblatt um, ändern aber weder Feldnamen noch Struktur.
5. Die drei automatischen Öffnungs-Stellen (Onboarding-Ende, täglicher
   Erststart, `dailyPopupOverlay`-Verkettung) öffnen künftig das Tagesblatt
   für heute statt des kleinen Modals — inklusive der bestehenden
   `CHECKIN_DATE_KEY`-Markierung und der `pendingDailyPopup`-Verkettung.
6. Die Heatmap-Zellfarbe bleibt vom `mood`-Wert getrieben — unverändert.

## Was NICHT kaputtgehen darf
- **Pomodoro-Timer (Rhythm & Focus)** → Prüfschritt: App starten, Rhythm-
  Modus wählen, Play drücken → Timer läuft runter, Break-Screen erscheint
  nach Ablauf, Benachrichtigung kommt.
- **Bestehender Check-in-Datenfluss** → Prüfschritt: Tagesblatt für einen
  vergangenen Tag öffnen, einen Check-in-Wert ändern, speichern, App neu
  starten → Wert ist weiterhin korrekt gesetzt und die Heatmap-Zellfarbe
  stimmt mit dem `mood`-Wert überein.
- **Automatischer Tages-Check-in beim ersten Start** → Prüfschritt:
  `CHECKIN_DATE_KEY` im DevTools-localStorage löschen, App neu starten →
  Tagesblatt für heute öffnet sich automatisch, nach Speichern/Skip erscheint
  ggf. der Rückblick-Popup für gestern.
- **Escape schließt zuverlässig** → Prüfschritt: Tagesblatt offen, `Escape`
  drücken → schließt, markiert den Tag als gecheckt (kein erneutes Auto-Öffnen
  am selben Tag), kein anderes Overlay bleibt hängen.
- **Tracker-Konfiguration (Settings → Trackers)** → Prüfschritt: Zahnrad →
  Trackers → neuen Tracker anlegen/bestehenden deaktivieren → im Tagesblatt
  korrekt wiedergegeben.
- **Statistik-Ansicht** → Prüfschritt: Zahnrad → Statistics öffnet weiterhin
  fehlerfrei die Verlaufscharts der bestehenden Tracker.
- **JSON-Backup & -Import** → Prüfschritt: Backup erstellen, Datei öffnen →
  enthält weiterhin alle bisherigen Felder korrekt; Import einer alten
  Backup-Datei (ohne die neuen Felder) funktioniert ohne Fehler.
- **Zukünftige Tage bleiben nicht klickbar** → Prüfschritt: Heatmap-Zelle in
  der Zukunft anklicken → nichts öffnet sich (wie bisher, `index.html:1982`).

## Scope-Grenze
Ausdrücklich NICHT Teil dieser Änderung:
- **Daily-Routine-Reminder** ("um 15 Uhr Dehnen") — eigenständiges Thema
  (Benachrichtigungs-Timing, ggf. Windows-Autostart), Alan will das später
  gesondert klären.
- **Strukturiertes Trainings-Protokoll** (einzelne Übungen mit Sätzen/
  Wiederholungen/Gewicht) — kommt als spätere Ausbaustufe auf dem jetzt
  gebauten einfachen Training-Feld auf.
- **Emotionen als Verlaufs-Log** (mehrere Einträge über den Tag verteilt) —
  bewusst auf einen Eintrag pro Tag beschränkt.
- **CSV-Export** — existiert im Projekt aktuell nicht mehr und wird hier
  nicht wieder eingeführt.
- Das bestehende `localStorage`-Speicherloch bei `trackersConfig` und dem
  Session-Log wird **nicht** rückwirkend behoben — das ist ein bekannter,
  aber unabhängiger Zustand (siehe Bezug zu bestehenden Entscheidungen). Nur
  die *neuen* Felder dieser Änderung werden von Anfang an richtig
  (in `DATA`) abgelegt.

## Datenmigration
Keine Struktur-Änderung an bestehenden Feldern — die neuen Kategorien werden
additiv unter `DATA[dateKey]` ergänzt (neue Schlüssel wie z. B. `emotionNote`,
`training`, `skincareAM`/`skincarePM`, `journal`). Alte Einträge ohne diese
Schlüssel bleiben gültig (Felder sind schlicht `undefined`/leer).

**Trotzdem vor dem ersten Segment: eine Sicherungskopie von `data.json`**
(`%APPDATA%/INIGO-data/data.json`, z. B. über den vorhandenen "↓ Create
Backup"-Button) — kein Muss durch eine Strukturänderung, aber Alans echte,
gewachsene Daten liegen dort, und das kostet nichts.

## Abhängigkeiten & Reihenfolge
Die Tagesblatt-Ansicht (Layout, Öffnen/Schließen, Umbau der drei
Auto-Öffnen-Stellen) ist die Grundlage und muss zuerst stehen — die vier
neuen Bereiche (Emotionen, Training, Skincare, Journal) hängen inhaltlich
nicht voneinander ab und können danach in beliebiger Reihenfolge folgen.
Skincare hat die größte Nähe zum bestehenden Tracker-Konfigurationsmuster
und eignet sich daher an, das Konfigurations-Prinzip fürs Tagesblatt einmal
sauber zu etablieren, bevor Journal (mehrere Einträge, eigene kleine
Liste pro Tag) folgt. Das größte Risiko liegt in Schritt 1: der Umbau der
Escape-/Auto-Öffnen-/`pendingDailyPopup`-Verkettung, weil dort mehrere
bestehende Verhaltensweisen an einer Stelle zusammenlaufen.

## Bezug zu bestehenden Entscheidungen
`docs/decisions.md` existierte vor dieser Änderung nicht — es wird mit
diesem Update neu angelegt und hält die in diesem Brainstorming getroffenen
Entscheidungen fest (Tagesblatt statt Tab-Leiste, neue Felder in `DATA`
statt `localStorage`, Reminder & Detail-Trainingsprotokoll bewusst vertagt).

## Rollback
Zweig `change/01-tagesblatt`; falls etwas nicht passt: `git checkout main`
bringt dich zurück auf den unangetasteten alten Stand, der Zweig bleibt
daneben erhalten und kann jederzeit weiterverwendet oder verworfen werden.

## Segmente
Ablage: `docs/segments/v2/` — _(Ordner und Inhalt legt /dev-split-code an)_
