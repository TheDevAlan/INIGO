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
  docs/changes/01-update-tagesblatt.md → docs/segments/v2/ · abgelöst durch
  Änderung 02 (v2/01 erledigt, v2/02 geht in v3/01 auf, v2/03–06 überholt,
  Inhalte von Training/Skincare/Journal werden neu geplant)
- [ ] 02 — Tagesblatt-Tabs: gestapelte Abschnitte werden zur Tab-Leiste
  (Umbau) → docs/changes/02-umbau-tagesblatt-tabs.md → docs/segments/v3/ ·
  in Umsetzung

## Segmente

### v3 — Änderung 02: Tagesblatt-Tabs
- [ ] 01 — Tab-Mechanik mit "Daily Check-in" und "Logbook" → `docs/segments/v3/01-tab-mechanik.md`
- [ ] 02 — Reiter "Training" und "Skincare" als Platzhalter → `docs/segments/v3/02-reiter-training-skincare.md`
- [ ] 03 — Reiter "Journal", nur an Montagen sichtbar → `docs/segments/v3/03-reiter-journal-montag.md`

_Frühere Runden: `docs/segments/v2/` (Änderung 01; v1 wurde ohne Segmente gebaut)._
