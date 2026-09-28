# Segment 05: Skincare-Schritte selbst konfigurieren
Status: offen · Hängt ab von: 04
Aus: docs/changes/01-update-tagesblatt.md

## Kontext
_Stand bei Erstellung (2026-09-28) — zur Bauzeit prüfen, nicht glauben._

Segment 04 hat die Skincare-Checkliste mit fest eingebauten Standard-Schritten
gebaut, die bereits als Liste an einer Stelle definiert sind. Dieses Segment
macht diese Liste **vom Nutzer bearbeitbar**: eigene Schritte anlegen,
umbenennen, entfernen — getrennt für Morgen- und Abendroutine.

Das Projekt hat dafür ein direktes Vorbild: die Tracker-Konfiguration
(Zahnrad → "Trackers") mit `TRACKER_DEFAULTS`, `loadTrackers()`,
`saveTrackers()` und dem zugehörigen Bearbeitungs-Dialog. An diesem Muster
entlangbauen — Bedienung und Aussehen sollen sich für Alan vertraut anfühlen.

**Eine bewusste Abweichung vom Tracker-Vorbild, die dieses Segment umsetzen
muss — bitte genau lesen:**

Die Tracker-Konfiguration liegt heute **nur im `localStorage`** und ist
deshalb **nicht im JSON-Backup enthalten** — legt Alan eigene Tracker an und
setzt den Rechner neu auf, sind sie weg. `docs/decisions.md` hält fest, dass
dieser Fehler mit den neuen Kategorien **nicht wiederholt** werden soll. Die
Skincare-Schritt-Konfiguration gehört deshalb dorthin, wo auch gesichert
wird: in die `DATA`-Struktur, die über `window.api.saveData` in `data.json`
landet und vom Backup vollständig erfasst wird.

Das hat eine Konsequenz, die **zwingend mit erledigt werden muss**: der
Backup-Import prüft heute jeden Schlüssel in den eingelesenen Daten gegen ein
Datumsmuster (`YYYY-MM-DD`) und bricht mit einer Fehlermeldung ab, sobald ein
Schlüssel nicht wie ein Datum aussieht. Ein Konfigurations-Schlüssel neben den
Tagesdaten würde also **jeden Import einer neuen Backup-Datei sprengen**.
Die Import-Prüfung muss daher so erweitert werden, dass Nicht-Datums-Schlüssel
akzeptiert und sinnvoll behandelt werden, statt einen Abbruch auszulösen.
Diese Prüfung sitzt im Import-Handler des Backup-Imports (`importFile`) — zur
Bauzeit dort suchen, wo die Datumsprüfung und das anschließende
Zusammenführen der Tagesdaten stattfinden.

## Aufgabe
Die Skincare-Schritte konfigurierbar machen.

1. **Bearbeitungs-Oberfläche** — Schritte anlegen, umbenennen und entfernen,
   getrennt nach Morgens und Abends. Erreichbar an einer naheliegenden Stelle:
   entweder als eigener Eintrag im Zahnrad-Menü (analog zu "Trackers") oder
   direkt aus dem Skincare-Abschnitt der Tagesansicht heraus. Die Umsetzung
   entscheidet, welche der beiden Varianten besser ins Bestehende passt.
2. **Stabile Kennungen vergeben** — beim Anlegen eines Schrittes wird eine
   Kennung erzeugt, die sich beim Umbenennen **nicht** ändert. Sonst verlieren
   bereits gespeicherte Häkchen ihren Bezug.
3. **Konfiguration backup-sicher ablegen** — in der `DATA`-Struktur unter
   einem reservierten Schlüssel, der kein Datum ist (Vorschlag: `_config` mit
   einem Unterschlüssel für die Skincare-Schritte). Die Umsetzung legt den
   genauen Namen fest und hält ihn im Code an einer Stelle fest.
4. **Import-Prüfung erweitern** — siehe Kontext: Nicht-Datums-Schlüssel dürfen
   den Import nicht mehr abbrechen lassen. Dabei mitentscheiden und im Commit
   kurz begründen, was beim Import mit einer *eingelesenen* Konfiguration
   passiert (übernehmen oder die lokale behalten) — beides ist vertretbar,
   nur stillschweigend abstürzen darf es nicht.
5. **Bestehende Häkchen überleben lassen** — wird ein Schritt entfernt,
   bleiben die dazu bereits gespeicherten Häkchen in den Tagesdaten erhalten
   (sie werden nur nicht mehr angezeigt). Wird derselbe Schritt später wieder
   angelegt, darf er nicht versehentlich alte Häkchen erben, wenn er eine
   neue Kennung bekommen hat — das ist der Normalfall und in Ordnung.
6. **Mindestzustand abfangen** — eine leere Liste (alle Schritte entfernt)
   darf die Tagesansicht nicht kaputt machen; der Abschnitt zeigt dann einen
   verständlichen leeren Zustand.
7. **Umstieg von den Standard-Schritten** — beim ersten Öffnen ohne
   gespeicherte Konfiguration gelten die Standard-Schritte aus Segment 04.
   Bereits gespeicherte Häkchen aus Segment 04 müssen weiterhin korrekt
   angezeigt werden.

**Nicht Teil dieses Segments:** Reihenfolge der Schritte per Ziehen ändern,
Produkte/Marken je Schritt, Statistik über Skincare, Erinnerungen.

## Akzeptanzkriterien
- Ein eigener Schritt lässt sich anlegen, erscheint in der Tagesansicht und
  ist dort abhakbar.
- Ein Schritt lässt sich umbenennen; bereits gesetzte Häkchen dieses Schritts
  bleiben erhalten.
- Ein Schritt lässt sich entfernen; die Tagesansicht zeigt ihn nicht mehr,
  die App läuft fehlerfrei weiter.
- Die Konfiguration überlebt einen Neustart der App.
- Ein neu erstelltes JSON-Backup enthält die Skincare-Konfiguration.
- **Der Import eines neu erstellten Backups (mit Konfiguration) läuft ohne
  Fehlermeldung durch** — das ist der kritische Punkt dieses Segments.
- Der Import einer **alten** Backup-Datei (ohne Konfiguration) läuft ebenfalls
  ohne Fehlermeldung durch.
- Häkchen, die vor dieser Änderung gesetzt wurden, sind danach noch sichtbar.

## Regressionsprüfung
- **Timer:** Rhythm starten → läuft und benachrichtigt wie gewohnt.
- **Check-in-Daten:** Vergangenen Tag öffnen, Wert ändern, speichern, neu
  öffnen → Wert steht; Heatmap-Farbe passt weiterhin zum `mood`-Wert.
- **Auto-Check-in:** `inigo-last-checkin-date` löschen, App neu starten →
  Tagesansicht öffnet automatisch, danach Rückblick-Popup.
- **Escape:** schließt die Tagesansicht, Tag gilt als gecheckt.
- **Tracker-Konfiguration:** Zahnrad → Trackers funktioniert unverändert —
  die Skincare-Konfiguration darf ihr nicht ins Gehege kommen.
- **Statistik:** Zahnrad → Statistics öffnet fehlerfrei.
- **Backup/Import:** beide Richtungen wie oben unter Akzeptanzkriterien.
- **Zukunft:** Zukünftige Heatmap-Zellen bleiben nicht anklickbar.

## So prüfst du es (für den Nutzer)
1. Starte die App mit `npm start`.
2. Öffne die Skincare-Einstellungen und lege einen eigenen Schritt an, z. B.
   "Augencreme" für abends.
3. Öffne im Kalender den heutigen Tag → dein neuer Schritt steht in der
   Abendroutine und lässt sich abhaken. Speichern.
4. Benenne den Schritt um (z. B. in "Augenpflege") → dein Häkchen ist immer
   noch gesetzt.
5. Erstelle ein Backup (Zahnrad → "↓ Create Backup") und importiere dieselbe
   Datei direkt wieder (Zahnrad → "↑ Import Backup") → **keine
   Fehlermeldung**, alles ist noch da.
6. Starte die App neu → dein Schritt und deine Häkchen sind noch da.

## Abschluss
Nach bestandenem Test: git add + commit mit sprechender Nachricht,
Status in dieser Datei und in docs/PLAN.md auf "erledigt" setzen,
kurz in Klartext erklären, was gebaut wurde und wie man es ausführt.
Grounding-Befunde: _(trägt /dev-build ein)_
