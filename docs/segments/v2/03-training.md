# Segment 03: Abschnitt "Training" im Tagesblatt
Status: überholt durch Änderung 02 (wird neu geplant) · Hängt ab von: 01 _(Muster aus 02 übernehmen, wenn bereits gebaut)_
Aus: docs/changes/01-update-tagesblatt.md

## Kontext
_Stand bei Erstellung (2026-09-28) — zur Bauzeit prüfen, nicht glauben._

Die vollflächige Tagesansicht steht seit Segment 01 und trägt Abschnitte, die
aus `DATA[dateKey]` lesen und ergänzend dorthin zurückschreiben. Dieses
Segment fügt den Trainings-Abschnitt hinzu.

**Bewusst einfach gehalten.** Alan hat sich beim Zuschnitt ausdrücklich für
die schlanke Variante entschieden: Art des Trainings, Dauer, freie Notiz. Ein
strukturiertes Protokoll mit einzelnen Übungen, Sätzen, Wiederholungen und
Gewichten ist **ausdrücklich außerhalb des Scopes** dieser Änderung — es ist
als spätere Ausbaustufe vorgesehen, die auf dem hier gebauten Feld aufsetzt.
Das heißt für die Umsetzung: die Datenstruktur so wählen, dass ein späteres
Übungs-Array daneben passt, ohne das Bestehende umbauen zu müssen.

Zur Einordnung: es gibt bereits einen Check-in-Tracker "Workout" (Kennung
`sport`, Ja/Nein). Der bleibt, wie er ist — er beantwortet "hast du
trainiert?", der neue Abschnitt beantwortet "was und wie lange?". Die beiden
werden **nicht** zusammengeführt; eine automatische Kopplung (Training
ausgefüllt → `sport` auf "yes") ist nicht Teil dieses Segments.

## Aufgabe
Einen Abschnitt "Training" in die Tagesansicht einhängen.

1. **Drei Eingaben** — Art des Trainings (Auswahl aus einer festen Liste, z. B.
   Kraft / Cardio / Mobility / Sonstiges), Dauer in Minuten (Zahl), freie
   Notiz (mehrzeiliger Text).
2. **Datenstruktur** — gespeichert im Tageseintrag unter dem Feldnamen
   **`training`** als Objekt mit den Schlüsseln `type`, `minutes` und `note`
   (verbindliche Festlegung dieses Segments). Ein späteres Übungs-Array kann
   dann als weiterer Schlüssel daneben treten, ohne Migration.
3. **Speichern ergänzend, nicht ersetzend** — nur die eigenen Felder
   schreiben, alle anderen Felder des Tages bleiben unangetastet.
4. **Leerer Zustand sauber** — ein Tag ohne Training speichert keinen
   halbleeren `training`-Eintrag, der später als "es gab ein Training"
   fehlgedeutet wird. Nur speichern, wenn tatsächlich etwas eingetragen wurde.
5. **Dauer robust behandeln** — keine negativen Werte, leere Eingabe ist
   erlaubt und bedeutet "nicht angegeben", nicht "0 Minuten".
6. **Optisch im Bestand bleiben** — vorhandene Form-Klassen (`.field`,
   `.input`) und CSS-Variablen wiederverwenden. Für die Auswahlliste an den
   Stil der bestehenden Eingabefelder anschließen.

**Nicht Teil dieses Segments:** Übungen/Sätze/Gewichte, Trainingspläne,
Auswertung der Trainingsdaten in der Statistik, Verknüpfung mit dem
`sport`-Tracker, Anzeige eines Trainings-Symbols in der Heatmap.

## Akzeptanzkriterien
- Die Tagesansicht zeigt einen Abschnitt "Training" mit Art, Dauer und Notiz.
- Eingetragene Werte sind nach Speichern, Schließen und erneutem Öffnen
  desselben Tages noch da — auch nach einem Neustart der App.
- Die Daten landen im Tageseintrag unter `training` und sind im JSON-Backup
  enthalten (Zahnrad → "↓ Create Backup", Datei öffnen und nachsehen).
- Das Speichern des Trainings löscht weder Check-in-Werte noch die
  Emotions-Notiz desselben Tages.
- Ein Tag ohne Trainingseingabe erzeugt keinen leeren `training`-Eintrag in
  der Datei.
- Eine leere Dauer führt nicht zu einer gespeicherten 0.

## Regressionsprüfung
- **Timer:** Rhythm starten → läuft und benachrichtigt wie gewohnt.
- **Check-in-Daten:** Vergangenen Tag öffnen, Check-in-Wert ändern, speichern,
  neu öffnen → Wert steht, Trainingsdaten desselben Tages ebenfalls noch da.
- **Auto-Check-in:** `inigo-last-checkin-date` löschen, App neu starten →
  Tagesansicht öffnet automatisch, danach Rückblick-Popup.
- **Escape:** schließt die Tagesansicht, Tag gilt als gecheckt.
- **Tracker-Konfiguration:** Zahnrad → Trackers funktioniert unverändert; der
  bestehende "Workout"-Tracker ist weiterhin da.
- **Statistik:** Zahnrad → Statistics öffnet fehlerfrei.
- **Backup/Import:** Import einer alten Backup-Datei (ohne `training`) läuft
  ohne Fehlermeldung durch.
- **Zukunft:** Zukünftige Heatmap-Zellen bleiben nicht anklickbar.

## So prüfst du es (für den Nutzer)
1. Starte die App mit `npm start`.
2. Klicke im Kalender auf den heutigen Tag → es gibt jetzt einen Bereich
   "Training".
3. Wähle eine Art (z. B. Kraft), trage 65 Minuten ein und schreibe
   "Push-Day, lief gut" in die Notiz. Speichern.
4. Schließe die Ansicht, öffne denselben Tag erneut → alle drei Angaben
   stehen da.
5. Starte die App neu und sieh nochmal nach → immer noch da.
6. Öffne einen Tag, an dem du nicht trainiert hast → der Bereich ist leer und
   sieht nicht kaputt aus.

## Abschluss
Nach bestandenem Test: git add + commit mit sprechender Nachricht,
Status in dieser Datei und in docs/PLAN.md auf "erledigt" setzen,
kurz in Klartext erklären, was gebaut wurde und wie man es ausführt.
Grounding-Befunde: _(trägt /dev-build ein)_
