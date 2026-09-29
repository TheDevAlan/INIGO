# Segment 02: Reiter "Training" und "Skincare" als Platzhalter
Status: offen · Hängt ab von: 01
Aus: docs/changes/02-umbau-tagesblatt-tabs.md

## Kontext
_Stand bei Erstellung (2026-09-29): Das hier ist bei der Umsetzung zu prüfen, nicht einfach zu übernehmen._

Segment 01 hat im Tagesblatt eine Tab-Leiste mit "Daily Check-in" und
"Logbook" gebaut. Alle Panels werden in `openDaysheet(key)` gemeinsam
gerendert und bleiben im DOM, beim Wechsel wird nur die Sichtbarkeit
umgeschaltet. Vor dem Bauen den tatsächlichen Mechanismus aus Segment 01 im
Code nachlesen, also wie Reiter und Panel gekoppelt sind, und genau diesem
Muster folgen.

## Aufgabe
Zwei weitere Reiter anhängen, in dieser Reihenfolge nach "Logbook":
**Training** und **Skincare**. Beide bekommen nur den Tab-Rahmen: ein Panel
mit Überschrift und einem kurzen, ruhigen Platzhaltertext (sinngemäß "Kommt
bald"). Die Sprache richtet sich nach den übrigen UI-Texten im Tagesblatt.

Die Umschaltlogik aus Segment 01 soll dafür **nicht** umgebaut werden. Wenn
sich die neuen Reiter nur mit Eingriffen in die Umschaltlogik anhängen lassen,
ist das ein Hinweis, dass Segment 01 nicht erweiterbar gebaut wurde. Das dann
benennen und gezielt beheben, nicht mit einer Sonderlösung umgehen.

Die Tab-Leiste hat jetzt vier Reiter (später an Montagen fünf) und muss in der
Breite des Tagesblatts (`.daysheet-inner`, max. 640px) sauber in eine Zeile
passen. Nichts darf umbrechen oder abgeschnitten werden.

Scope-Grenze: kein fachlicher Inhalt, keine Felder, keine Speicherlogik für
Training oder Skincare. Das kommt in eigenen, später zu planenden Segmenten.
Die Platzhalter-Panels enthalten keine Eingabefelder und schreiben nichts in
`DATA`.

## Akzeptanzkriterien
- Die Tab-Leiste zeigt: Daily Check-in · Logbook · Training · Skincare.
- Training und Skincare zeigen je ihre Überschrift und einen Platzhaltertext.
- Die Leiste steht in einer Zeile, auch im kleinsten App-Fenster (980×580).
- Save aus dem Reiter "Training" oder "Skincare" heraus speichert weiterhin
  die Werte aus Check-in und Logbook. Der Ablauf aus Segment 01 funktioniert
  also auch, wenn man zwischendurch einen Platzhalter-Reiter besucht.
- Nach Save aus einem Platzhalter-Reiter kommen keine neuen Schlüssel in
  `DATA[dateKey]` dazu (im exportierten JSON prüfbar).

## Regressionsprüfung
- **Pomodoro-Timer:** Starten und pausieren funktioniert, ebenso der
  Moduswechsel.
- **Bestehender Check-in-Datenfluss:** Einen Tag mit gespeicherten Werten
  öffnen. Die Werte sind vorbelegt, und Speichern ohne Änderung verliert
  nichts.
- **Automatischer Tages-Check-in beim ersten Start:** Das Tagesblatt öffnet
  sich, "Daily Check-in" ist aktiv.
- **Escape schließt zuverlässig:** Escape schließt das Tagesblatt in jedem
  Reiter, auch in Training und Skincare.
- **Tracker-Konfiguration:** Änderungen unter Settings → Trackers wirken
  weiterhin im Reiter "Daily Check-in".
- **Statistik-Ansicht:** Sie öffnet sich unverändert.
- **JSON-Backup & -Import:** Export und Import funktionieren, `mood` und
  `emotionNote` sind enthalten.
- **Zukünftige Tage bleiben nicht klickbar.**
- **Speichern über Reitergrenzen** (aus Segment 01): Ablauf
  Logbook → Check-in → Logbook → Save. Alles ist gespeichert.

## So prüfst du es (für den Nutzer)
Starte die App mit `npm start` und öffne einen Tag. Oben siehst du jetzt vier
Reiter. Klicke auf "Training" und auf "Skincare": Dort steht jeweils nur ein
Platzhalter. Trage im Check-in etwas ein, wechsle zu "Skincare" und klicke
dort auf Save. Öffne den Tag erneut: Dein Check-in-Wert ist gespeichert.

## Abschluss
Nach bestandenem Test:
- `git add` und `commit` mit einer aussagekräftigen Nachricht.
- Status in dieser Datei, in `docs/PLAN.md` und in
  `docs/changes/02-umbau-tagesblatt-tabs.md` auf "erledigt" setzen.
- In Klartext kurz erklären, was gebaut wurde und wie man es ausführt.

Grounding-Befunde: _(trägt /dev-build ein)_
