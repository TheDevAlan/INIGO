# AURORA Work & Wellbeing

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
%APPDATA%/daily-flow/daily-flow-data/data.json
```

---

## Changelog

### v0.4.0 — Pomodoro Redesign & Full English UI

**Timer — complete rework**
- **Pomodoro state machine**: `idle → focus → break-ready → break → post-break`
- Two modes with independent durations:
  - **Rhythm** — classic Pomodoro (25 min focus / 5 min break, configurable)
  - **Flow** — deep work sessions (60 min focus / 10 min break, configurable)
- Focus timer ends → OS notification → `break-ready` screen appears (blurred overlay), user starts break manually
- Break timer ends → `post-break` screen with "NEXT SESSION" prompt, blur stays until user presses Play
- **Break can be paused and resumed** mid-countdown
- **PRODUCTIVITY** label slides in above timer when focus is active
- **BREAK** label appears above timer on break screen
- **NEXT SESSION** label appears after break ends
- Play / Pause buttons changed from circles to **rounded rectangles** matching app design language
- Reset button only visible when a session is active

**Break screen**
- Full-screen blur overlay activates immediately on break-ready state
- Three wellbeing reminders shown below Play button: **MOVE · DRINK · BREATHE**
- Each reminder has a hover tooltip with science-backed guidance (0.3 s delay, smooth slide-in animation)
- Reminders are symmetrically spaced with DRINK centered

**OS Notifications** (replaces in-app popups)
- "☕ Focus complete!" — when focus timer ends
- "☕ Break time!" — when break starts
- "✅ Break over" — when break countdown finishes

**Mode tooltips**
- Hovering Rhythm or Flow button shows current durations + description (0.75 s delay)
- Tooltip text updates dynamically when durations are changed in Timer Settings

**UI / Design**
- Play button icon replaced with geometrically centered SVG triangle
- Timer block shifted down for better vertical balance
- Removed: in-app break popup, Impressum menu item, app logo/glow, session tracking, periodic reminder notifications (movement + breathing intervals)

**Full English UI**
- All text, menus, modals, tooltips, notifications, and heatmap labels translated to English
- Tracker defaults migrated to English (Activity, Sleep, Steps, Meditation, Mood) with auto-migration of existing localStorage data
- Menu item renamed: "Break Rules" → **"Timer Settings"**
- Month labels: Jan–Dec, weekday labels: Mo–Su

**Statistics modal**
- Accessible from Settings → Statistics
- Per-tracker line charts with averages and trend indicators

---

### v0.3.0 — Design System & Visual Polish

- Dark warm-tone color palette (amber / deep brown)
- JetBrains Mono + DM Sans typography
- Animated focus backdrop blur
- Heatmap month labels with proportional spacing (column of 1st of each month)
- Context stats: streak, year average, trend vs. last month
- Trend tooltip explaining calculation method

---

### v0.2.0 — Branding & Layout

- AURORA / ZENITH branding
- System tray integration
- Yearly heatmap navigation

---

### v0.1.0 — Initial Release

- Flowtime timer with Healthy / Deep Work modes
- Daily check-in modal
- Mood heatmap (GitHub-style)
- Local JSON data storage
- CSV + JSON export / import

---

## Features

### Pomodoro Timer

- **Two modes**: Rhythm (classic Pomodoro) and Flow (deep work), each with independent focus and break durations configurable in **Timer Settings**
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
- Default trackers: Activity, Meditation, Sleep, Steps, Mood

---

### Statistics

- Per-tracker line charts showing historical data
- Average value and entry count per tracker
- Accessible via Settings → Statistics

---

### Tracker Configuration

- Add, remove, and configure tracking categories
- Per category: label, question text, type (Scale 1–5 or Number), active/inactive toggle
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
- App runs in the **system tray** — closing the window keeps it running in the background
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
