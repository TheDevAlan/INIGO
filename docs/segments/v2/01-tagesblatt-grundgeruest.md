# Segment 01: Tagesblatt-Grundgerüst — Check-in zieht in die Vollbild-Ansicht um
Status: erledigt · Hängt ab von: —
Aus: docs/changes/01-update-tagesblatt.md

## Kontext
_Stand bei Erstellung (2026-09-28) — zur Bauzeit prüfen, nicht glauben._

INI:GO ist eine Electron-App mit einer einzigen `index.html` (HTML+CSS+JS in
einer Datei, kein Framework, kein Build-Schritt für den Renderer). `main.js`
ist der Hauptprozess, `preload.js` stellt `window.api.*` bereit.

Heute öffnet ein Klick auf eine Heatmap-Zelle die Funktion `openCheckin(key)`,
die ein **kleines zentriertes Popup** (`#overlay` mit `#mainModal`, CSS-Klassen
`.overlay`/`.modal`) mit den konfigurierten Tracker-Feldern füllt.
`closeCheckin()` schließt es und macht dabei zwei Dinge mit, die leicht zu
übersehen sind: sie setzt `CHECKIN_DATE_KEY` auf den heutigen Tag (damit sich
der Check-in nicht mehrfach am selben Tag automatisch öffnet) und stößt über
`pendingDailyPopup` den Rückblick-Popup (`checkDailyPopup()`) an.

Diese Änderung ersetzt dieses Popup durch eine **vollflächige Tagesansicht**
("Tagesblatt"), die später fünf Abschnitte trägt. Dieses Segment baut das
Grundgerüst und holt die bestehenden Check-in-Felder unverändert hinein — die
vier neuen Abschnitte kommen in den Folgesegmenten.

**Zwei Befunde aus der Ist-Analyse, die dieses Segment tragen muss:**

1. **Der Speichervorgang ersetzt heute den kompletten Tageseintrag.** Im
   Save-Handler von `openCheckin` wird ein frisches `newEntry`-Objekt gebaut
   und der Tageseintrag in `DATA` damit **überschrieben** — eine bereits
   vorhandene Variable `existing` wird dabei gelesen, aber nicht verwendet.
   Solange nur Tracker-Felder existieren, fällt das nicht auf. Sobald die
   Folgesegmente Journal, Training, Skincare und Emotions-Notiz im selben
   Tageseintrag ablegen, würde **jedes Speichern des Check-ins diese Daten
   löschen.** Das zu beheben ist Teil dieses Segments und Voraussetzung für
   alles Weitere.
2. **Tooltip und Statistik sind unkritisch.** Beide lesen Tageseinträge
   gezielt über `trackersConfig` bzw. über `DATA[k][t.id]` — sie iterieren
   nicht blind über alle Felder eines Eintrags. Neue Felder brechen sie also
   nicht und brauchen hier keine Anpassung.

**Bekannte Grenze (nicht Teil dieses Segments):** Der Backup-Import ersetzt
ganze Tageseinträge (`Object.assign(DATA, incomingData)`). Ein altes Backup
überschreibt damit neuere Tagesblatt-Daten desselben Tages. Dieses Verhalten
existiert heute schon für Check-in-Daten und bleibt unverändert.

**Vor dem ersten Eingriff:** Sicherungskopie der echten Daten anlegen — in
der laufenden App über Zahnrad → "↓ Create Backup". Die Daten liegen unter
`%APPDATA%/INIGO-data/data.json`.

## Aufgabe
Die Tagesansicht als vollflächige Ansicht bauen und den bestehenden Check-in
vollständig dorthin verlagern — fachlich unverändert.

1. **Vollbild-Ansicht statt Popup.** Eine neue Ansicht, die das komplette
   Fenster einnimmt und Timer- sowie Heatmap-Bereich sichtbar ersetzt (nicht
   als zentriertes `.modal` mit `max-width`). Sie zeigt das Datum des
   gewählten Tages als Überschrift und hat einen sichtbaren Weg zurück
   (Schließen-Button). Der Inhaltsbereich muss **scrollbar** sein — das
   Fenster ist nur 580px hoch (minimal 500px) und trägt später fünf
   Abschnitte.
2. **Abschnitts-Struktur vorbereiten.** Der Inhalt wird in klar getrennte
   Abschnitte gegliedert; der erste ist "Check-in". Die Folgesegmente hängen
   ihre Abschnitte in dieselbe Struktur ein — sie so anlegen, dass ein
   weiterer Abschnitt ohne Umbau dazukommen kann.
3. **Check-in-Felder unverändert übernehmen.** Dieselben Feldtypen
   (`scale`, `number`, `yesno`, `text`) aus `trackersConfig`, dieselben
   Feldnamen im Tageseintrag, dieselbe Sonderstellung des `mood`-Trackers
   (`locked`, steht am Ende). Keine fachliche Änderung — nur ein neuer Ort.
4. **Speichern muss zusammenführen statt ersetzen.** Der Tageseintrag in
   `DATA` darf beim Speichern nur um die Check-in-Felder ergänzt werden;
   bereits vorhandene andere Felder bleiben erhalten. (Siehe Befund 1 oben.)
5. **Schließ-Logik erhalten.** Das Schließen der Tagesansicht muss weiterhin
   `CHECKIN_DATE_KEY` setzen und die `pendingDailyPopup`-Verkettung zum
   Rückblick-Popup auslösen — sowohl über den Schließen-Button als auch über
   `Escape`. Der globale `Escape`-Handler behandelt das Check-in-Overlay
   heute bewusst vorrangig vor der generischen Overlay-Schließlogik; dieses
   Vorrecht muss die neue Ansicht erben.
6. **Alle Öffnungs-Stellen umstellen.** `openCheckin` wird heute aus mehreren
   Stellen aufgerufen — Größenordnung bei Planung: 3 (Klick auf eine
   Heatmap-Zelle, Ende des Onboardings, täglicher Erststart). Verbindlich ist
   das Grep-Ergebnis zur Bauzeit: alle Aufrufstellen suchen und auf die neue
   Ansicht umstellen.
7. **Optisch im Bestand bleiben.** Die vorhandenen Form-Klassen
   (`.field`, `.input`, `.scale`, `.btn`, `.btn-fill`, `.btn-ghost`,
   `.action-btn`) und die bestehenden CSS-Variablen (`--accent`, `--surface`,
   `--text`, `--text-muted`, `--border` …) wiederverwenden statt neue Stile
   zu erfinden. Schriften wie im Rest der App.

**Nicht Teil dieses Segments:** die vier neuen Abschnitte (Emotionen,
Training, Skincare, Journal) — die kommen in Segment 02 bis 06. Ebenso wenig
Reminder, Tooltip- oder Statistik-Anpassungen.

## Akzeptanzkriterien
- Ein Klick auf einen vergangenen oder heutigen Heatmap-Tag öffnet eine
  Ansicht, die das ganze Fenster einnimmt; Timer und Heatmap sind nicht mehr
  sichtbar.
- Die Ansicht zeigt das Datum des gewählten Tages und alle aktiven
  Check-in-Felder mit den bereits gespeicherten Werten dieses Tages.
- Speichern schreibt die Werte in `data.json`; nach einem Neustart der App
  sind sie noch da.
- Ein Tageseintrag, der zusätzlich ein fremdes Feld enthält (zum Testen
  manuell in `data.json` eintragen, z. B. `"testfeld": "bleibt"`), behält
  dieses Feld nach dem Speichern des Check-ins.
- Schließen-Button und `Escape` schließen die Ansicht und führen zurück zu
  Timer + Heatmap.
- Der automatische Tages-Check-in beim ersten Start des Tages öffnet die neue
  Ansicht, und nach dem Schließen erscheint der Rückblick-Popup wie bisher.
- Zukünftige Tage lassen sich weiterhin nicht anklicken.
- Der Inhalt ist auch bei kleinster Fenstergröße (640×500) vollständig
  erreichbar — notfalls durch Scrollen.

## Regressionsprüfung
Aus "Was NICHT kaputtgehen darf" des Änderungsdokuments — jeder Punkt einzeln
prüfen:
- **Timer:** App starten, Rhythm wählen, Play → Timer läuft, Break-Screen und
  Benachrichtigung kommen wie gewohnt.
- **Check-in-Daten:** Vergangenen Tag öffnen, Wert ändern, speichern, App neu
  starten → Wert korrekt, Heatmap-Zellfarbe passt zum `mood`-Wert.
- **Auto-Check-in:** `inigo-last-checkin-date` im localStorage löschen, App neu
  starten → Tagesansicht öffnet sich automatisch; nach Speichern/Skip kommt
  der Rückblick-Popup.
- **Escape:** Tagesansicht offen → `Escape` schließt sie, der Tag gilt als
  gecheckt (kein erneutes Auto-Öffnen am selben Tag), kein Overlay hängt.
- **Tracker-Konfiguration:** Zahnrad → Trackers → Tracker anlegen bzw.
  deaktivieren → wird in der Tagesansicht korrekt wiedergegeben.
- **Statistik:** Zahnrad → Statistics öffnet fehlerfrei mit Verlaufscharts.
- **Backup/Import:** Backup erstellen → enthält alle bisherigen Felder;
  Import einer alten Backup-Datei läuft ohne Fehlermeldung.
- **Zukunft:** Heatmap-Zelle in der Zukunft anklicken → nichts passiert.

## So prüfst du es (für den Nutzer)
1. Starte die App mit `npm start`.
2. Klicke unten im Kalender auf einen Tag, an dem du schon etwas eingetragen
   hast → die Tagesansicht füllt jetzt das ganze Fenster, mit dem Datum oben
   und deinen bisherigen Check-in-Fragen darunter.
3. Ändere einen Wert und klicke Speichern → du landest wieder bei Timer und
   Kalender.
4. Klicke denselben Tag nochmal an → dein geänderter Wert steht drin.
5. Drücke `Escape` → die Ansicht schließt sich.
6. Schließe die App und starte sie neu → dein Wert ist noch da, und die Farbe
   des Tages im Kalender passt weiterhin zu deiner Stimmung.

## Abschluss
Nach bestandenem Test: git add + commit mit sprechender Nachricht,
Status in dieser Datei und in docs/PLAN.md auf "erledigt" setzen,
kurz in Klartext erklären, was gebaut wurde und wie man es ausführt.
Grounding-Befunde: 0
