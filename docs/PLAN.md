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
  docs/changes/01-update-tagesblatt.md → docs/segments/v2/ · in Umsetzung

## Segmente

### v2 — Änderung 01: Tagesblatt — vollflächige Tagesansicht mit neuen Kategorien
- [ ] 01 — Tagesblatt-Grundgerüst: Check-in zieht in die Vollbild-Ansicht um → `docs/segments/v2/01-tagesblatt-grundgeruest.md`
- [ ] 02 — Abschnitt "Emotionen" (Stimmung + Notiz) → `docs/segments/v2/02-emotionen.md`
- [ ] 03 — Abschnitt "Training" (Art, Dauer, Notiz) → `docs/segments/v2/03-training.md`
- [ ] 04 — Abschnitt "Skincare": Checkliste mit Standard-Schritten → `docs/segments/v2/04-skincare-checkliste.md`
- [ ] 05 — Skincare-Schritte selbst konfigurieren → `docs/segments/v2/05-skincare-konfiguration.md`
- [ ] 06 — Abschnitt "Journal" (mehrere Einträge pro Tag) → `docs/segments/v2/06-journal.md`

_Frühere Runden: keine — v1 (Erstaufbau) wurde ohne Segmente gebaut._
