# INI:GO

A personal desktop app for focused work and daily wellbeing tracking. Built with Electron — runs fully local, no cloud, no tracking, no ads.

---

## Requirements

- [Node.js](https://nodejs.org/) (v18 or newer)

## Installation & Start

```bash
npm install
npm start
```

## Build portable .exe

```bash
npm run build
```

Creates a portable `.exe` in the `dist/` folder — no installer needed.

## Data Storage

All data is stored locally:

```
%APPDATA%/INIGO/INIGO-data/data.json
```

---

## Features

### Pomodoro Timer

- **Two modes**: Rhythm (classic Pomodoro) and Focus (deep work), each with independent focus and break durations configurable in **Timer Settings**
- **Manual break start**: after focus ends, the break screen appears but the break countdown only starts when you press Play — giving you control over pacing
- **Break reminders**: MOVE, DRINK, BREATHE icons with evidence-based hover tooltips during break
- **Post-break prompt**: after the break countdown finishes, a "NEXT SESSION" screen appears before returning to idle
- OS notifications at each phase transition

---

### Mood Heatmap

- Full-year calendar grid (GitHub contributions style)
- Cell color based on daily **Mood** score (1–5)
- Navigate between years
- Hover tooltip shows all tracked values for that day
- Today highlighted with accent border
- Context stats below: current streak, year average, trend vs. last month

---

### Daily Check-in

- Opens automatically on first app launch of the day
- Manually accessible by clicking any heatmap cell
- Configurable tracker categories (Settings → Trackers)
- Default trackers: Workout (Yes/No), Steps (Number), Sleep (1–5), Recovery (Yes/No), Gratitude (Text), Mood (1–5)

---

### Statistics

- Per-tracker line charts showing historical data
- Average value and entry count per tracker
- Accessible via Settings → Statistics

---

### Tracker Configuration

- Add, remove, and configure tracking categories
- Per category: label, question text, type (Scale 1–5, Number, Yes/No, Text), active/inactive toggle
- Mood tracker is locked as it drives the heatmap color

---

### Data & Export

- All data stored **locally** — no internet required
- **CSV Export** — all entries as a flat table
- **JSON Backup** — full data export
- **JSON Import** — merge a backup into existing data

---

### Support

- ♡ button (top left) opens the support modal
- App runs in the **system tray** — right-click the tray icon to reopen or quit
- `Escape` closes any open menu or modal

---

## Tech Stack

| | |
|---|---|
| Framework | Electron 28 |
| Frontend | Vanilla HTML / CSS / JS |
| Fonts | JetBrains Mono, DM Sans, Cormorant Garamond |
| Storage | Local JSON via Node.js `fs` |
| Platform | Windows (Portable Build) |
