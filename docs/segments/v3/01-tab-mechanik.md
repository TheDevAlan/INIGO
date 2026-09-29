# Segment 01: Tab-Mechanik mit "Daily Check-in" und "Logbook"
Status: offen · Hängt ab von: — (baut auf v2/01 Tagesblatt-Grundgerüst auf, bereits erledigt)
Aus: docs/changes/02-umbau-tagesblatt-tabs.md

## Kontext
_Stand bei Erstellung (2026-09-29): Das hier ist bei der Umsetzung zu prüfen, nicht einfach zu übernehmen._

INI:GO ist eine Electron-App. Die gesamte Oberfläche steckt in einer einzigen
`index.html` (Vanilla HTML/CSS/JS). Tagesdaten liegen in `DATA[dateKey]` und
werden über IPC in `data.json` gespeichert.

Das Tagesblatt (`#daysheet`) wird von `openDaysheet(key)` bei **jedem Öffnen
komplett neu** als HTML-String gebaut und in `#daysheetContent` geschrieben.
Derzeit liegen dort zwei gestapelte `.daysheet-section`-Blöcke: "Daily
Check-in" (die bestehenden Tracker) und "Emotions" (Mood-Regler plus Notizfeld
`f_emotionNote`). Der zweite Block stammt aus dem WIP-Commit `eb98a0f`
(ehemals v2/02). Darunter stehen die Buttons Skip und Save (`#saveBtn`).

Der Save-Handler liest **alle** Felder über `document.getElementById(...)` bzw.
das `vals`-Objekt aus. Anschließend führt er sie additiv mit dem bestehenden
Eintrag zusammen (`Object.assign`). Das klappt nur, solange alle Felder im DOM
stehen, und genau das muss diese Änderung erhalten.

Im Code gibt es noch keine Tabs, weder als CSS noch als JS. Als optisches
Vorbild eignen sich die bestehenden Umschalt-Elemente (`.mode-toggle` /
`.mode-btn` im Timer-Kopf) und die Farb-Variablen in `:root`. Ein eigenes
Design-Referenzdokument unter `docs/` gibt es nicht.

## Aufgabe
Oben im Tagesblatt, zwischen dem Header (Datum + ✕) und dem bisherigen Inhalt,
kommt eine horizontale Tab-Leiste mit zwei Reitern: **Daily Check-in** und
**Logbook**. Der bisherige Check-in-Block wird zum Inhalt von "Daily Check-in".
Der bisherige "Emotions"-Block wird zum Inhalt von "Logbook" und bekommt auch
diese Überschrift. Fachlich ändert sich nichts: gleiche Felder, gleiche IDs,
gleiche Feldnamen in `DATA` (`mood`, `emotionNote`).

**Verbindliche technische Festlegung** (aus dem Änderungsdokument, Soll 3):
Die Inhalte beider Reiter werden beim Öffnen gemeinsam gerendert und bleiben
dauerhaft im DOM. Ein Reiterwechsel schaltet nur die Sichtbarkeit um, zum
Beispiel mit einer Klasse am Panel. Beim Wechsel wird **nicht** neu gerendert
und nichts aus dem DOM entfernt. Nur so bleiben ungespeicherte Eingaben in
einem inaktiven Reiter erhalten.

Designentscheidungen:
- Beim Öffnen des Tagesblatts ist immer "Daily Check-in" aktiv. Der zuletzt
  gewählte Reiter wird nicht gemerkt, weil `openDaysheet` ohnehin alles neu
  baut.
- Skip und Save stehen **außerhalb** der Panels, also unter allen Reitern, und
  sind in jedem Reiter sichtbar. Der Save-Handler selbst bleibt unverändert.
- Die Tab-Leiste soll erweiterbar sein. Weitere Reiter hängen die Segmente 02
  und 03 an, möglichst ohne die Umschaltlogik anzufassen. Zum Beispiel:
  Reiter und Panel über ein gemeinsames `data-`-Attribut koppeln, statt jeden
  Reiter einzeln zu verdrahten.
- Die Reiter sind echte `<button>`-Elemente, also per Tastatur erreichbar. Der
  aktive Reiter ist optisch klar markiert. Escape schließt das Tagesblatt
  weiterhin, egal welcher Reiter aktiv ist.

Scope-Grenze: Training, Skincare und Journal sind **nicht** Teil dieses
Segments. Es gibt keine neuen Felder, keine Änderung an der Save-Logik und
keine Datenänderung.

## Akzeptanzkriterien
- Das Tagesblatt zeigt eine Tab-Leiste mit "Daily Check-in" und "Logbook".
  Beim Öffnen ist "Daily Check-in" aktiv.
- Ein Klick auf einen Reiter zeigt dessen Inhalt und blendet den anderen aus.
  Im DOM bleiben beide erhalten (im DevTools-Elements-Panel prüfbar).
- **Speichern über Reitergrenzen** (Kernrisiko dieser Änderung):
  1. Im Reiter "Logbook" die Notiz eingeben und Mood ändern.
  2. Zu "Daily Check-in" wechseln und dort einen Tracker-Wert ändern.
  3. Ohne zu speichern zurück zu "Logbook" wechseln. Notiz und Mood stehen
     noch da.
  4. Save klicken.
  5. Das Tagesblatt für denselben Tag erneut öffnen. Alle drei Werte sind
     gespeichert.
- Save aus dem Reiter "Daily Check-in" heraus speichert auch den
  Logbook-Inhalt, und umgekehrt.
- Die Heatmap-Zelle färbt sich nach dem Speichern weiterhin nach `mood`.

## Regressionsprüfung
- **Pomodoro-Timer:** Timer starten und pausieren, der Moduswechsel
  funktioniert wie vorher.
- **Bestehender Check-in-Datenfluss:** Einen vergangenen Tag mit bereits
  gespeicherten Werten öffnen. Alle Werte erscheinen vorbelegt, und nach dem
  Speichern ohne Änderung ist nichts verloren.
- **Automatischer Tages-Check-in beim ersten Start:** Bei einem Start ohne
  heutigen Eintrag öffnet sich das Tagesblatt automatisch, mit dem Reiter
  "Daily Check-in" aktiv.
- **Escape schließt zuverlässig:** In beiden Reitern schließt Escape das
  Tagesblatt. Dasselbe gilt für ✕ und Skip.
- **Tracker-Konfiguration:** Unter Settings → Trackers einen Tracker
  deaktivieren. Er fehlt danach im Reiter "Daily Check-in". Deaktivierter Mood
  bedeutet: Der Logbook-Reiter zeigt nur noch die Notiz.
- **Statistik-Ansicht:** Sie öffnet sich und zeigt dieselben Werte wie vorher.
- **JSON-Backup & -Import:** Beim Export stehen `mood` und `emotionNote` im
  JSON. Ein Import stellt beide wieder her.
- **Zukünftige Tage bleiben nicht klickbar:** Ein Klick auf eine zukünftige
  Heatmap-Zelle öffnet nichts.

## So prüfst du es (für den Nutzer)
Starte die App mit `npm start` und klicke auf einen vergangenen Tag in der
Heatmap. Oben siehst du jetzt zwei Reiter.
1. Schreibe unter "Logbook" etwas in die Notiz.
2. Wechsle zu "Daily Check-in" und ändere dort einen Wert.
3. Wechsle zurück: Deine Notiz ist noch da.
4. Klicke auf Save und öffne den Tag erneut: Beides ist gespeichert.

## Abschluss
Nach bestandenem Test:
- `git add` und `commit` mit einer aussagekräftigen Nachricht.
- Status in dieser Datei, in `docs/PLAN.md` und in
  `docs/changes/02-umbau-tagesblatt-tabs.md` auf "erledigt" setzen.
- In Klartext kurz erklären, was gebaut wurde und wie man es ausführt.

Grounding-Befunde: 5
