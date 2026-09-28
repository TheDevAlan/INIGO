# Segment 04: Abschnitt "Skincare" — Checkliste mit Standard-Schritten
Status: offen · Hängt ab von: 01 _(Muster aus 02/03 übernehmen, wenn bereits gebaut)_
Aus: docs/changes/01-update-tagesblatt.md

## Kontext
_Stand bei Erstellung (2026-09-28) — zur Bauzeit prüfen, nicht glauben._

Die vollflächige Tagesansicht steht seit Segment 01. Dieses Segment fügt den
Skincare-Abschnitt hinzu: eine **Checkliste zum Abhaken**, getrennt nach
Morgen- und Abendroutine.

**Dieses Segment arbeitet bewusst mit fest eingebauten Standard-Schritten.**
Die Möglichkeit, eigene Schritte anzulegen und zu entfernen, ist Segment 05.
Der Grund für den Schnitt: so ist die Checkliste nach diesem Segment schon
benutzbar, und die Konfigurierbarkeit kann sauber darauf aufsetzen, statt
beides gleichzeitig zu bauen und zu testen.

Damit Segment 05 nichts umbauen muss, gilt hier eine Vorgabe: **die
Standard-Schritte werden als Liste an einer Stelle definiert**, aus der die
Anzeige sie liest — nicht als fest verdrahtete Häkchen im HTML. Das Projekt
hat dafür bereits ein Vorbild: `TRACKER_DEFAULTS` definiert die
Standard-Tracker als Liste von Objekten mit Kennung und Beschriftung, und
`loadTrackers()` liest sie. An diesem Muster entlangbauen.

## Aufgabe
Einen Abschnitt "Skincare" in die Tagesansicht einhängen.

1. **Zwei Gruppen** — "Morgens" und "Abends", jeweils mit einer Liste von
   Schritten zum Abhaken.
2. **Standard-Schritte als Liste definieren** — sinnvolle Vorgaben, z. B.
   Reinigung, Serum, Feuchtigkeitspflege, Sonnenschutz (morgens) sowie
   Reinigung, Pflege, Nachtcreme (abends). Jeder Schritt hat eine **stabile
   Kennung** (die in den Daten landet) und eine **Beschriftung** (die
   angezeigt wird) — die Beschriftung darf sich später ändern, ohne dass
   gespeicherte Daten unlesbar werden.
3. **Datenstruktur** — gespeichert im Tageseintrag unter dem Feldnamen
   **`skincare`** als Objekt mit den Untergruppen `am` und `pm`, darin je
   Schritt-Kennung der Zustand (verbindliche Festlegung dieses Segments).
   Nur abgehakte Schritte müssen festgehalten werden.
4. **Speichern ergänzend, nicht ersetzend** — nur die eigenen Felder
   schreiben, alle anderen Felder des Tages bleiben unangetastet.
5. **Unbekannte Schritte nicht verlieren** — enthalten die Daten eines Tages
   eine Schritt-Kennung, die in der aktuellen Liste nicht (mehr) vorkommt,
   darf sie beim Speichern nicht stillschweigend gelöscht werden. Das wird
   ab Segment 05 relevant, wenn Schritte entfernt werden können.
6. **Leerer Zustand sauber** — ein Tag ohne abgehakte Schritte erzeugt keinen
   leeren `skincare`-Eintrag.
7. **Platzsparend darstellen** — der Abschnitt steht zusammen mit vier
   weiteren in einem 580px hohen Fenster. Eine kompakte Darstellung wählen
   (z. B. mehrspaltig), nicht eine lange Liste untereinander.
8. **Optisch im Bestand bleiben** — vorhandene Klassen und CSS-Variablen
   wiederverwenden.

**Nicht Teil dieses Segments:** eigene Schritte anlegen/entfernen/umbenennen
(das ist Segment 05), Auswertung in der Statistik, Erinnerungen an die
Routine, Produkte oder Marken erfassen.

## Akzeptanzkriterien
- Die Tagesansicht zeigt einen Abschnitt "Skincare" mit getrennten Gruppen
  für morgens und abends.
- Abgehakte Schritte sind nach Speichern, Schließen und erneutem Öffnen
  desselben Tages noch abgehakt — auch nach einem Neustart der App.
- Die Daten landen im Tageseintrag unter `skincare` und sind im JSON-Backup
  enthalten.
- Zwei verschiedene Tage haben unabhängige Häkchen (Tag A abhaken ändert
  nichts an Tag B).
- Das Speichern der Checkliste löscht keine Check-in-, Emotions- oder
  Trainingsdaten desselben Tages.
- Ein Tag ohne Häkchen erzeugt keinen leeren `skincare`-Eintrag in der Datei.
- Die Standard-Schritte stehen als Liste an einer Stelle im Code und sind
  nicht einzeln ins HTML geschrieben.

## Regressionsprüfung
- **Timer:** Rhythm starten → läuft und benachrichtigt wie gewohnt.
- **Check-in-Daten:** Vergangenen Tag öffnen, Check-in-Wert ändern, speichern,
  neu öffnen → Wert steht, Skincare-Häkchen desselben Tages ebenfalls.
- **Auto-Check-in:** `inigo-last-checkin-date` löschen, App neu starten →
  Tagesansicht öffnet automatisch, danach Rückblick-Popup.
- **Escape:** schließt die Tagesansicht, Tag gilt als gecheckt.
- **Tracker-Konfiguration:** Zahnrad → Trackers funktioniert unverändert.
- **Statistik:** Zahnrad → Statistics öffnet fehlerfrei.
- **Backup/Import:** Import einer alten Backup-Datei (ohne `skincare`) läuft
  ohne Fehlermeldung durch.
- **Zukunft:** Zukünftige Heatmap-Zellen bleiben nicht anklickbar.

## So prüfst du es (für den Nutzer)
1. Starte die App mit `npm start`.
2. Klicke im Kalender auf den heutigen Tag → es gibt jetzt einen Bereich
   "Skincare" mit Morgen- und Abendroutine.
3. Hake ein paar Schritte ab und speichere.
4. Schließe die Ansicht, öffne denselben Tag erneut → deine Häkchen sind noch
   gesetzt.
5. Öffne einen anderen Tag → dort ist nichts abgehakt (jeder Tag zählt für
   sich).
6. Starte die App neu und sieh nochmal nach → Häkchen sind noch da, und deine
   Check-in-Antworten ebenfalls.

## Abschluss
Nach bestandenem Test: git add + commit mit sprechender Nachricht,
Status in dieser Datei und in docs/PLAN.md auf "erledigt" setzen,
kurz in Klartext erklären, was gebaut wurde und wie man es ausführt.
Grounding-Befunde: _(trägt /dev-build ein)_
