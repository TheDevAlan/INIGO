# Änderung 02: Tagesblatt-Tabs
Typ: Umbau · Stand: 2026-09-29 · Status: in Umsetzung
Zweig: change/02-tagesblatt-tabs

## Anliegen
Das Tagesblatt (eingeführt mit Änderung 01) zeigt seinen Inhalt heute als
eine einzige scrollbare Seite mit gestapelten Abschnitten. Alan möchte
stattdessen eine Tab-Leiste oben im Tagesblatt: **Daily Check-in**,
**Logbook** (bisher "Emotions" genannt), **Training**, **Skincare**,
**Journal**. Der Journal-Reiter soll nur sichtbar sein, wenn der im
Tagesblatt geöffnete Tag ein Montag ist — an allen anderen Wochentagen fehlt
er komplett.

Diese Änderung betrifft ausschließlich die **Präsentation** innerhalb des
Tagesblatts, nicht dessen Öffnen/Schließen-Mechanik (Änderung 01, Segment 01)
und nicht die fachlichen Inhalte der noch nicht gebauten Bereiche
(Training, Skincare, Journal).

## Ist-Analyse (Stand: 2026-09-28)
- `openDaysheet(key)` (`index.html:2086-2178`) baut den gesamten sichtbaren
  Tagesblatt-Inhalt bei **jedem Öffnen komplett neu** als HTML-String und
  schreibt ihn einmalig in `$daysheetContent.innerHTML` (`index.html:2135`).
  Aktuell entstehen dabei zwei gestapelte `.daysheet-section`-Blöcke:
  "Daily Check-in" (`index.html:2097-2119`) und "Emotions"
  (`index.html:2122-2131` — in dieser Session als Segment 02 gebaut, siehe
  unten).
- Kein Tab-Konzept existiert im Code — weder CSS-Klassen noch JS-Logik für
  Tab-Umschaltung sind vorhanden. `.daysheet-section` (`index.html:647-648`,
  CSS) ist rein vertikal gestapelt (`margin-bottom`), kein
  `display:none`-Mechanismus.
- Container-Struktur: `#daysheet` → `.daysheet-inner` (`max-width:640px`,
  `index.html:642`) → `.daysheet-header` (Datum + X-Button) +
  `#daysheetContent` (`index.html:1019-1026`, HTML-Skelett). Genug Breite für
  eine horizontale Tab-Leiste darüber.
- Speichern läuft über einen einzigen globalen Save-Button (`#saveBtn`,
  `index.html:2150-2168`), der beim Klick **alle** Felder aus dem kompletten
  DOM von `$daysheetContent` per `document.getElementById(...)` ausliest und
  additiv in `DATA[editKey]` schreibt (`Object.assign({}, existing,
  newEntry)`, Zeile 2164). Das funktioniert heute nur, weil alle Felder
  gleichzeitig im DOM stehen — kein Tab-bedingtes Ein-/Ausblenden.
- `vals` (`index.html:2084`) hält die aktuell gewählten Scale-/Yesno-Werte
  über alle Felder hinweg, unabhängig von ihrer Position im DOM — bereits
  ortsunabhängig (siehe Grounding zu Segment 02).
- **Stand des bisherigen Segments 02** ("Emotionen"): mood-Regler
  (`final-field`) und ein Notizfeld `emotionNote` sind bereits als
  gestapelter Abschnitt gebaut und als `WIP:`-Commit gesichert
  (`eb98a0f` auf `change/01-tagesblatt`). Dieser Code wird durch die
  vorliegende Änderung nicht verworfen, sondern in den neuen "Logbook"-Tab
  überführt.

## Nullpunkt (Stand vor der Änderung)
`npm start` in dieser Session mehrfach ausgeführt — App startet fehlerfrei,
kein Fehler im Log, Electron-Prozesse laufen stabil. Kein automatisiertes
Test-Skript vorhanden (unverändert seit Änderung 01, `package.json` hat kein
`test`-Skript).

## Soll-Zustand
1. Das Tagesblatt bekommt oberhalb des bisherigen Inhalts eine horizontale
   Tab-Leiste mit den Reitern "Daily Check-in", "Logbook", "Training",
   "Skincare", "Journal".
2. **Journal ist nur an Montagen sichtbar** — bezogen auf den Wochentag des
   im Tagesblatt geöffneten Datums (nicht auf den heutigen Kalendertag). An
   allen anderen Wochentagen fehlt der Reiter vollständig, kein
   deaktivierter/ausgegrauter Zwischenzustand.
3. **Technische Festlegung:** Beim Wechsel zwischen Reitern bleiben die
   Inhalte **aller** Reiter im DOM — nur die Sichtbarkeit wechselt (z. B.
   über eine CSS-Klasse), es wird **nicht** neu gerendert. Grund: Der
   bestehende globale Save-Button liest alle Felder aus dem DOM aus: würde
   ein nicht aktiver Reiter beim Wechsel aus dem DOM entfernt, gingen dort
   eingegebene, aber noch nicht gespeicherte Werte beim späteren Speichern
   in einem anderen Reiter verloren.
4. Der bestehende globale Save-Button bleibt unverändert bestehen und
   speichert weiterhin die Werte aller Reiter auf einmal — kein
   Reiter-eigenes Speichern. Durch Punkt 3 ist das ohne Umbau der
   Save-Logik selbst weiterhin möglich.
5. Inhalt "Daily Check-in" (bestehende Tracker) und "Logbook" (mood +
   `emotionNote`, bisher "Emotions" genannt) ziehen fachlich unverändert in
   ihre jeweiligen Tabs um — keine neuen Felder, keine geänderten
   Feldnamen.
6. "Training" und "Skincare" bekommen in dieser Änderung **nur den
   Tab-Rahmen** (leerer/Platzhalter-Inhalt) — ihr tatsächlicher Inhalt ist
   Aufgabe der noch zu planenden Segmente. "Journal" bekommt ebenfalls nur
   den Tab-Rahmen plus die Montags-Sichtbarkeitsregel aus Punkt 2.

## Was NICHT kaputtgehen darf
Alle Punkte aus Änderung 01 gelten unverändert weiter (Prüfschritte dort):
- Pomodoro-Timer (Rhythm & Focus)
- Bestehender Check-in-Datenfluss
- Automatischer Tages-Check-in beim ersten Start
- Escape schließt zuverlässig
- Tracker-Konfiguration (Settings → Trackers)
- Statistik-Ansicht
- JSON-Backup & -Import
- Zukünftige Tage bleiben nicht klickbar

Neu durch diesen Umbau:
- **Speichern über Tab-Grenzen hinweg** → Prüfschritt: Wert im Reiter
  "Logbook" ändern, zu "Daily Check-in" wechseln, dort ebenfalls einen Wert
  ändern, ohne zwischendurch zu speichern zu "Logbook" zurückwechseln → Wert
  steht dort noch, dann Save klicken → beide Werte landen in `DATA`.
- **Journal-Sichtbarkeit korrekt an den Wochentag gekoppelt** →
  Prüfschritt: Tagesblatt für einen Montag öffnen → Reiter "Journal" da;
  Tagesblatt für einen Dienstag öffnen → Reiter "Journal" fehlt.
- **Tab-Wechsel verändert nicht den aktuell bearbeiteten Tag** →
  Prüfschritt: zwischen Reitern wechseln, kein Datenverlust der bereits
  gespeicherten Werte des geöffneten Tages (Regressionstest aus Änderung 01
  weiterhin gültig).

## Scope-Grenze
Ausdrücklich NICHT Teil dieser Änderung:
- Der tatsächliche fachliche Inhalt der Reiter "Training", "Skincare",
  "Journal" (Felder, Speicherlogik, Journal-Mehrfacheinträge) — kommt in
  eigenen, noch zu planenden Segmenten.
- Die konfigurierbaren Skincare-Schritte (ehemals als Segment 05 geplant).
- Jede Datenstruktur-Änderung — reine Präsentationsänderung.

## Datenmigration
Nicht nötig. Es ändert sich keine Datenstruktur, nur die Darstellung.
`mood` und `emotionNote` (aus dem bisherigen Segment 02) bleiben unter
denselben Feldnamen additiv in `DATA[dateKey]`.

## Abhängigkeiten & Reihenfolge
Segment 01 (Tagesblatt-Grundgerüst, Öffnen/Schließen/Escape) trägt weiterhin
unverändert die Grundlage. Das bisherige Segment 02 ("Emotionen" als
gestapelter Abschnitt) wird nicht separat fortgeführt, sondern geht im neuen
"Logbook"-Tab auf — der bereits gebaute Code (WIP-Commit `eb98a0f`) ist die
Grundlage dafür, nicht Wegwerfarbeit.

Größtes Risiko sitzt in Punkt 3 des Soll-Zustands: der Umbau von "alle
Felder gleichzeitig sichtbar" auf "alle Felder im DOM, aber teilweise
versteckt" muss sorgfältig geprüft werden, sonst drohen beim Speichern
stille Datenverluste in nicht aktiven Reitern. Das sollte im ersten Segment
dieser Änderung (die Tab-Mechanik selbst) explizit verifiziert werden, bevor
weitere Reiter-Inhalte draufgesetzt werden.

Die bestehenden Segment-Dateien `docs/segments/v2/03-06-*.md` sind auf das
alte Stapel-Layout zugeschnitten und werden durch diese Änderung inhaltlich
überholt — sie werden von `/dev-split-code` nicht mehr verwendet, sondern
durch neue Segmente in `docs/segments/v3/` ersetzt.

## Bezug zu bestehenden Entscheidungen
- **"Tagesblatt statt Tab-Leiste"** (`docs/decisions.md`, 2026-09-28): bezog
  sich auf den bereits vollen App-Kopfbereich (980×580) — eine Tab-Leiste
  dort hätte den Timer als Herzstück der App entwertet. Diese Änderung
  betrifft eine andere Ebene: Tabs **innerhalb** des ohnehin schon
  vollflächigen Tagesblatts, das durch genau diese frühere Entscheidung
  entstanden ist. Kein Widerspruch, aber ein neuer, enger gefasster Fall —
  wird mit dieser Änderung um einen eigenen, ergänzenden Eintrag erweitert
  (siehe Commit dieser Änderung).
- **"Neue Tagesblatt-Felder liegen in DATA, nicht in localStorage"**
  (`docs/decisions.md`, 2026-09-28): unverändert gültig, betrifft diese
  Änderung nicht (keine neuen Felder, keine neue Ablage).

## Rollback
Zweig `change/02-tagesblatt-tabs`, abgezweigt von `change/01-tagesblatt`
(dort gesichert als WIP-Commit `eb98a0f`). `git checkout
change/01-tagesblatt` bringt dich zurück auf den Stand vor diesem Umbau —
der alte Zweig bleibt unangetastet und enthält weiterhin den gestapelten
"Emotions"-Abschnitt als Ausgangsbasis, falls der Tab-Umbau verworfen wird.

## Segmente
Ablage: `docs/segments/v3/`

Reihenfolge nach Risiko: Zuerst kommt die Tab-Mechanik selbst, inklusive des
Speichertests über Reitergrenzen. Danach werden die Platzhalter-Reiter
angehängt, und zum Schluss die Journal-Montagsregel.

- [ ] 01 — Tab-Mechanik mit "Daily Check-in" und "Logbook" (inkl. Speichern
  über Reitergrenzen) → `docs/segments/v3/01-tab-mechanik.md`
- [ ] 02 — Reiter "Training" und "Skincare" als Platzhalter →
  `docs/segments/v3/02-reiter-training-skincare.md`
- [ ] 03 — Reiter "Journal", nur an Montagen sichtbar →
  `docs/segments/v3/03-reiter-journal-montag.md`
