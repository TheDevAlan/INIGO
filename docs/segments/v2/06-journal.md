# Segment 06: Abschnitt "Journal" im Tagesblatt
Status: offen · Hängt ab von: 01
Aus: docs/changes/01-update-tagesblatt.md

## Kontext
_Stand bei Erstellung (2026-09-28) — zur Bauzeit prüfen, nicht glauben._

Die vollflächige Tagesansicht steht seit Segment 01. Dieses Segment fügt den
letzten der fünf Abschnitte hinzu — und den strukturell aufwendigsten.

**Der Unterschied zu allen bisherigen Abschnitten:** Check-in, Emotionen,
Training und Skincare speichern je Tag **einen** Satz Werte. Das Journal
speichert eine **Liste** — mehrere Einträge pro Tag, jeder mit eigener
Uhrzeit und eigenem Text, einzeln hinzufügbar und löschbar. Es ist damit das
einzige Feld dieser Änderung, das eine variable Anzahl von Datensätzen je Tag
hält.

Ein Vorbild für die Bedienung gibt es im Projekt bereits: die
Tracker-Konfiguration zeigt eine Liste von Einträgen mit einem
Hinzufügen-Knopf und je Zeile einem Entfernen-Knopf (CSS-Klassen im Umfeld
von `.reminder-item`, `.reminder-del` und `.action-btn` — der Klassenname
`reminder` ist historisch und hat nichts mit Erinnerungen zu tun). Diese
Bedienlogik lässt sich übertragen.

Für das Gratitude-Feld gilt: das bleibt ein Check-in-Tracker und wird
**nicht** ins Journal überführt.

## Aufgabe
Einen Abschnitt "Journal" in die Tagesansicht einhängen.

1. **Mehrere Einträge pro Tag** — je Eintrag ein freier, mehrzeiliger Text und
   eine Uhrzeit. Beim Anlegen wird die aktuelle Uhrzeit vorbelegt; sie muss
   änderbar sein, damit man abends etwas vom Vormittag nachtragen kann.
2. **Hinzufügen und Löschen** — ein Knopf legt einen neuen Eintrag an, je
   Eintrag gibt es einen Weg ihn zu entfernen. Ein Löschen sollte nicht
   versehentlich passieren können (z. B. Rückfrage oder ein bewusst kleiner,
   klar zugeordneter Knopf — die Umsetzung entscheidet, passend zum
   restlichen Bedienstil der App).
3. **Datenstruktur** — gespeichert im Tageseintrag unter dem Feldnamen
   **`journal`** als Liste von Objekten mit `time` (Uhrzeit als `HH:MM`),
   `text` und einem Zeitstempel für die Sortierung (verbindliche Festlegung
   dieses Segments). Jeder Eintrag braucht eine **stabile eigene Kennung**,
   damit Bearbeiten und Löschen den richtigen Eintrag treffen, auch wenn zwei
   Einträge dieselbe Uhrzeit oder denselben Text haben.
4. **Sortierung** — Einträge werden nach Uhrzeit geordnet angezeigt.
5. **Speichern ergänzend, nicht ersetzend** — nur das eigene Feld schreiben,
   alle anderen Felder des Tages bleiben unangetastet.
6. **Leere Einträge vermeiden** — ein angelegter, aber nie ausgefüllter
   Eintrag wird nicht gespeichert; ein Tag ohne Einträge erzeugt keine leere
   `journal`-Liste.
7. **Platz und Lesbarkeit** — der Abschnitt steht als fünfter in einem 580px
   hohen Fenster. Lange Texte dürfen die Ansicht nicht sprengen; bei vielen
   Einträgen muss das Scrollen der Tagesansicht weiterhin funktionieren.
8. **Optisch im Bestand bleiben** — vorhandene Klassen (`.field`, `.input`,
   `.action-btn`) und CSS-Variablen wiederverwenden.

**Nicht Teil dieses Segments:** Suche über alle Journal-Einträge hinweg,
Journal-Übersicht über mehrere Tage, Formatierung (fett/kursiv), Bilder oder
Anhänge, Verschlüsselung, Anzeige eines Journal-Symbols in der Heatmap.

## Akzeptanzkriterien
- In der Tagesansicht lassen sich mehrere Journal-Einträge für denselben Tag
  anlegen, jeder mit Uhrzeit und Text.
- Die Einträge sind nach Speichern, Schließen und erneutem Öffnen desselben
  Tages vollständig da — auch nach einem Neustart der App.
- Ein einzelner Eintrag lässt sich löschen, ohne die anderen zu beschädigen —
  auch dann, wenn zwei Einträge denselben Text haben.
- Die Einträge landen im Tageseintrag unter `journal` und sind im JSON-Backup
  enthalten.
- Zwei verschiedene Tage haben unabhängige Journal-Einträge.
- Das Speichern des Journals löscht keine Check-in-, Emotions-, Trainings-
  oder Skincare-Daten desselben Tages.
- Ein Tag ohne Journal-Einträge erzeugt keine leere `journal`-Liste in der
  Datei.
- Bei fünf oder mehr Einträgen bleibt die Tagesansicht bedienbar (Scrollen
  funktioniert, nichts wird abgeschnitten).

## Regressionsprüfung
- **Timer:** Rhythm starten → läuft und benachrichtigt wie gewohnt.
- **Check-in-Daten:** Vergangenen Tag öffnen, Wert ändern, speichern, neu
  öffnen → Wert steht; Heatmap-Farbe passt weiterhin zum `mood`-Wert.
- **Auto-Check-in:** `inigo-last-checkin-date` löschen, App neu starten →
  Tagesansicht öffnet automatisch, danach Rückblick-Popup.
- **Escape:** schließt die Tagesansicht, Tag gilt als gecheckt — auch mit
  ungespeichertem Journal-Text im Feld darf nichts hängen bleiben.
- **Tracker-Konfiguration:** Zahnrad → Trackers funktioniert unverändert; der
  Gratitude-Tracker ist weiterhin im Check-in.
- **Statistik:** Zahnrad → Statistics öffnet fehlerfrei.
- **Backup/Import:** Import einer alten Backup-Datei (ohne `journal`) läuft
  ohne Fehlermeldung durch.
- **Zukunft:** Zukünftige Heatmap-Zellen bleiben nicht anklickbar.

## So prüfst du es (für den Nutzer)
1. Starte die App mit `npm start`.
2. Klicke im Kalender auf den heutigen Tag → unten gibt es jetzt den Bereich
   "Journal".
3. Lege einen Eintrag an, schreib ein paar Sätze, speichere.
4. Lege einen zweiten Eintrag mit einer anderen Uhrzeit an → beide stehen
   untereinander, nach Uhrzeit sortiert.
5. Lösche den ersten Eintrag → der zweite bleibt unverändert stehen.
6. Starte die App neu und öffne den Tag erneut → dein verbliebener Eintrag ist
   noch da, und deine Check-in-Antworten ebenfalls.
7. Öffne einen anderen Tag → dort ist das Journal leer.

## Abschluss
Nach bestandenem Test: git add + commit mit sprechender Nachricht,
Status in dieser Datei und in docs/PLAN.md auf "erledigt" setzen,
kurz in Klartext erklären, was gebaut wurde und wie man es ausführt.
Grounding-Befunde: _(trägt /dev-build ein)_
