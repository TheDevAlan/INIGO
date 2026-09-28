# INI:GO — Projektplan

_Dieses Dokument existierte vor Änderung 01 nicht (organisch gewachsenes
Projekt). Es wurde mit Änderung 01 minimal angelegt, um künftigen
`/dev-change`- und `/dev-split-code`-Durchläufen einen Anker zu geben —
Details zur Architektur stehen im jeweiligen Änderungsdokument, nicht hier._

## Projektziel
Persönliche Desktop-App für fokussiertes Arbeiten (Pomodoro-Timer) und
tägliches Wohlbefinden-Tracking. Läuft vollständig lokal, keine Cloud, kein
Tracking, keine Werbung.

## Tech-Stack
| | |
|---|---|
| Framework | Electron 28 |
| Frontend | Vanilla HTML / CSS / JS, eine `index.html` |
| Datenhaltung | Lokale `data.json` via Node.js `fs` (IPC über `main.js`/`preload.js`) |
| Plattform | Windows (Portable-Build + Microsoft Store / APPX) |

## Änderungen
- [ ] 01 — Tagesblatt: vollflächige Tagesansicht mit neuen Kategorien
  (Journal, Training, Skincare, Emotionen) (Update) →
  docs/changes/01-update-tagesblatt.md · geplant
