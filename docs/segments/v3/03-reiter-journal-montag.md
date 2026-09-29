# Segment 03: Reiter "Journal", nur an Montagen sichtbar
Status: erledigt · Hängt ab von: 02
Aus: docs/changes/02-umbau-tagesblatt-tabs.md

## Kontext
_Stand bei Erstellung (2026-09-29): Das hier ist bei der Umsetzung zu prüfen, nicht einfach zu übernehmen._

Nach Segment 01 und 02 hat das Tagesblatt die Reiter Daily Check-in, Logbook,
Training und Skincare. Die letzten beiden sind Platzhalter. Alle Panels
werden in `openDaysheet(key)` gemeinsam gerendert, die Umschaltung läuft nur
über die Sichtbarkeit. Vor dem Bauen das tatsächliche Muster im Code
nachlesen und ihm folgen.

`openDaysheet` bekommt den Tag als Schlüssel im Format `YYYY-MM-DD`. Im Code
wird dieser String derzeit bereits in seine Teile zerlegt, um das Datum im
Header anzuzeigen.

## Aufgabe
Einen fünften Reiter **Journal** nach "Skincare" anhängen. Wie die beiden
Reiter aus Segment 02 bekommt er nur einen Tab-Rahmen mit Platzhaltertext.

**Sichtbarkeitsregel** (Soll 2 des Änderungsdokuments): Der Reiter und sein
Panel gibt es nur, wenn der **im Tagesblatt geöffnete Tag** ein Montag ist.
Maßgeblich ist also nicht der heutige Kalendertag. An allen anderen
Wochentagen fehlt der Reiter vollständig: Er wird dann gar nicht gerendert,
nicht nur ausgegraut oder deaktiviert.

Designentscheidung zur Wochentags-Bestimmung: Den Wochentag aus Jahr, Monat
und Tag des Schlüssels als **lokales** Datum bilden (`new Date(y, m - 1, d)`).
Den Schlüssel-String nicht direkt an `new Date(...)` übergeben, denn ein
reiner ISO-Datumsstring wird als UTC interpretiert und kann je nach Zeitzone
den falschen Wochentag liefern. Die Prüfung gehört in eine kleine, benannte
Hilfsfunktion (sinngemäß "ist dieser Schlüssel ein Montag?"), damit sie
später für den echten Journal-Inhalt wiederverwendbar ist.

Scope-Grenze: kein Journal-Inhalt, keine Mehrfacheinträge, keine
Speicherlogik. Das kommt in einem eigenen, später zu planenden Segment.

## Akzeptanzkriterien
- Beim Tagesblatt für einen Montag (z. B. 2026-09-28) zeigt die Leiste fünf
  Reiter, der letzte ist "Journal" mit Platzhaltertext.
- Beim Tagesblatt für einen Dienstag (z. B. 2026-09-29) oder einen Sonntag
  (z. B. 2026-09-27) zeigt die Leiste vier Reiter. "Journal" fehlt, und auch
  im DOM gibt es kein Journal-Panel.
- Die Regel hängt am geöffneten Tag, nicht am heutigen Datum: Einen
  vergangenen Montag öffnen, während heute kein Montag ist. "Journal" ist da.
- Wechsel zwischen zwei Tagen hintereinander (Montag schließen, Dienstag
  öffnen) liefert keine Reste: Beim Dienstag ist kein Journal-Reiter zu sehen.
- Fünf Reiter passen weiterhin in eine Zeile, auch im kleinsten Fenster
  (980×580).

## Regressionsprüfung
- **Pomodoro-Timer:** Starten und pausieren funktioniert, ebenso der
  Moduswechsel.
- **Bestehender Check-in-Datenfluss:** Gespeicherte Werte eines Tages sind
  vorbelegt, und Speichern ohne Änderung verliert nichts.
- **Automatischer Tages-Check-in beim ersten Start:** Das Tagesblatt öffnet
  sich mit "Daily Check-in" aktiv. Ist heute Montag, ist auch Journal
  sichtbar.
- **Escape schließt zuverlässig:** Das gilt in jedem Reiter, auch in
  "Journal".
- **Tracker-Konfiguration:** Sie wirkt weiterhin im Reiter "Daily Check-in".
- **Statistik-Ansicht:** Sie öffnet sich unverändert.
- **JSON-Backup & -Import:** Export und Import funktionieren. Durch den
  Journal-Platzhalter kommen keine neuen Schlüssel in `DATA`.
- **Zukünftige Tage bleiben nicht klickbar.** Das gilt auch für einen
  zukünftigen Montag.
- **Speichern über Reitergrenzen** (aus Segment 01): Ablauf
  Logbook → Check-in → Logbook → Save. Alles ist gespeichert, auch wenn Save
  aus dem Journal-Reiter heraus geklickt wird.

## So prüfst du es (für den Nutzer)
Starte die App mit `npm start`.
1. Klicke in der Heatmap auf einen vergangenen **Montag**: Oben stehen fünf
   Reiter, ganz rechts "Journal".
2. Schließe das Tagesblatt und öffne einen **Dienstag**: Dort gibt es nur
   vier Reiter, "Journal" fehlt.

## Abschluss
Nach bestandenem Test:
- `git add` und `commit` mit einer aussagekräftigen Nachricht.
- Status in dieser Datei, in `docs/PLAN.md` und in
  `docs/changes/02-umbau-tagesblatt-tabs.md` auf "erledigt" setzen.
- Änderung 02 im Änderungsdokument und in `docs/PLAN.md` auf "erledigt"
  setzen, weil das das letzte Segment dieser Runde ist.
- In Klartext kurz erklären, was gebaut wurde und wie man es ausführt.

Grounding-Befunde: 0
