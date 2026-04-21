# ZENITH Work & Wellbeing

Persönliche Desktop-App für produktives Arbeiten und tägliches Wellbeing-Tracking. Gebaut mit Electron – läuft lokal, ohne Cloud, ohne Tracking.

## Voraussetzungen

- [Node.js](https://nodejs.org/) (v18 oder neuer)

## Installation & Start

```bash
cd daily-flow
npm install
npm start
```

## Als .exe bauen

```bash
npm run build
```

Erzeugt eine portable `.exe` im `dist/` Ordner.

## Daten

Alle Daten werden lokal gespeichert:

```
%APPDATA%/daily-flow/daily-flow-data/data.json
%APPDATA%/daily-flow/daily-flow-data/reminders.json
```

---

## Features

### Timer

- **Flowtime-Timer** – kein festes Intervall, du arbeitest so lange du im Flow bist
- **Zwei Modi** wählbar:
  - `Healthy` – Standard-Modus mit Pausen-Erinnerungen
  - `Deep Work` – Erinnerungen werden zurückgehalten und nach der Session gesammelt angezeigt
- **Automatische Pause** – nach jeder beendeten Session startet ein Pausen-Countdown (20 % der Arbeitszeit, min. 1 Minute)
- **Session-Tagging** – beim Beenden einer Session kannst du auswählen, woran du gearbeitet hast (vordefinierte Tags oder eigener Text)
- **52-Minuten-Warnung** – Timer wechselt die Farbe und schlägt eine Bewegungspause vor

---

### Mood Heatmap

- **Jahresansicht** aller Einträge als farbiges Raster (wie GitHub Contributions)
- Farbe jeder Zelle basiert auf dem **Morgengeführ-Wert** (1–5)
- Navigation zwischen Jahren
- **Tooltip** beim Hover über eine Zelle zeigt alle Tageswerte
- **Heute** wird mit einem blauen Rahmen markiert
- Zukünftige Tage sind ausgegraut und nicht anklickbar

| Wert | Farbe |
|------|-------|
| – | Grau (kein Eintrag) |
| 1 | Rot |
| 2 | Orange |
| 3 | Gelb |
| 4 | Dunkelgrün |
| 5 | Hellgrün |

---

### Daily Check-in

- Öffnet sich automatisch beim ersten Start des Tages
- Manuell aufrufbar durch Klick auf eine Zelle in der Heatmap
- Felder konfigurierbar über **Einstellungen → Tracker** (Standard: Aktivität, Meditation, Schlaf, Schritte, Morgengeführ)
- Bereits gespeicherte Sessions des Tages werden als Balkendiagramm angezeigt

---

### Zusammenfassung unter der Heatmap

- Zeigt **Durchschnittswerte** aller aktiven Tracker-Kategorien für das angezeigte Jahr
- **Trend-Pfeile** (▲ ▼ ▶) zeigen, ob sich der Durchschnitt verbessert oder verschlechtert hat
- Hover über einen Trend-Pfeil erklärt die **Berechnungsformel** (Ø letzte 7 Tage vs. Ø vorherige 7 Tage)

---

### Erinnerungen

Konfigurierbar über **Einstellungen → Erinnerungen**:

- Zwei Standard-Erinnerungen vorinstalliert:
  - **Bewegungspause** – alle 50 Minuten
  - **Die Perfekte Atmung** – alle 60 Minuten
- Pro Erinnerung einstellbar: **Titel**, **Nachrichtentext**, **Intervall in Minuten**, **aktiv/inaktiv**
- Neue Erinnerungen hinzufügen und bestehende löschen
- Änderungen greifen sofort ohne App-Neustart

---

### Tracker-Kategorien

Konfigurierbar über **Einstellungen → Tracker**:

- Standardmäßig: Aktivität, Meditation, Schlaf, Schritte, Morgengeführ
- Pro Kategorie einstellbar:
  - **Name** – wie die Kategorie im Check-in und der Zusammenfassung heißt
  - **Frage** – der angezeigte Text im Check-in-Modal
  - **Typ** – `Skala 1–5` oder `Zahl`
  - **Aktiv/Inaktiv** – blendet die Kategorie aus Check-in und Zusammenfassung aus
  - **Ø Zusammenfassung** – steuert separat, ob der Durchschnitt unter der Heatmap angezeigt wird
- Neue Kategorien (Skala 1–5) hinzufügen und löschen
- Morgengeführ ist gesperrt (🎨), da es die Heatmap-Farbe steuert

---

### Dark / Light Mode

Umschaltbar über **Einstellungen → Lightmode**:

- **Dark Mode** ist Standard (GitHub-inspiriertes Dunkelthema)
- **Light Mode** mit hellem Apple-ähnlichem Hintergrund
- Auswahl wird gespeichert und beim nächsten Start wiederhergestellt

---

### Daten & Export

- Alle Daten werden **lokal** gespeichert (kein Internet erforderlich)
- **CSV-Export** – alle Einträge als Tabelle
- **JSON-Backup** – vollständiger Daten-Export
- **JSON-Import** – bestehende Backups importieren und mit vorhandenen Daten zusammenführen

---

### Sonstiges

- **Support-Modal** über den ♡-Button oben links
- Läuft als **System-Tray-App** – beim Schließen des Fensters bleibt die App im Hintergrund aktiv
- `Escape` schließt offene Menüs und Modals

---

## Technologie

| | |
|---|---|
| Framework | Electron 28 |
| Frontend | Reines HTML/CSS/JS (kein Framework) |
| Schriften | JetBrains Mono, DM Sans |
| Datenspeicherung | Lokales JSON via Node.js `fs` |
| Plattform | Windows (Portable Build) |
