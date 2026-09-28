# Entscheidungen

Kurzprotokoll wichtiger Weichenstellungen — warum der Code so aussieht, wie
er aussieht. Neue Einträge oben anfügen.

---

## 2026-09-28 — Tagesblatt statt Tab-Leiste für neue Kategorien
**Kontext:** Vier neue Tages-Kategorien (Journal, Training, Skincare,
Emotionen) sollten in INI:GO eingebaut werden. Der Kopfbereich der App
(980×580, min. 640×500) ist bereits mit Fensterleiste, Support-Button,
Zahnrad-Menü und Mode-Toggle voll.

**Alternativen:**
- Tab-Leiste oben, eine Kategorie pro Tab.
- Umschalter "Fokus / Tagebuch" zwischen zwei gleichrangigen Welten.
- Bestehenden Heatmap-Klick (öffnete bisher ein kleines Check-in-Modal) zu
  einer vollflächigen Tagesansicht ausbauen.

**Begründung:** Eine Tab-Leiste erzwingt einen Umbau des bereits vollen
Kopfbereichs und macht den Timer nur noch zu einem von sechs gleichrangigen
Bereichen — das widerspricht der heutigen Identität der App ("Timer +
Tagesrückblick"). Der Heatmap-Klick existiert bereits als Navigationsweg
(`openCheckin`, `index.html:1982`) und alle neuen Kategorien sind ohnehin
datumsgebunden — sie passen fachlich exakt dorthin.

**Konsequenz:** Der Klick auf einen Heatmap-Tag öffnet ab Änderung 01 eine
vollflächige Ansicht ("Tagesblatt") statt des kleinen `#overlay`-Modals. Der
Timer-Startbildschirm bleibt unangetastet. Siehe
`docs/changes/01-update-tagesblatt.md`.

---

## 2026-09-28 — Neue Tagesblatt-Felder liegen in `DATA`, nicht in `localStorage`
**Kontext:** Die App hat heute zwei getrennte Speicher: `DATA` (pro Tag, über
IPC in `data.json` persistiert, `main.js:28-45`) und mehrere unabhängige
`localStorage`-Werte (`trackersConfig`, Session-Log, Timer-Minuten). Nur
`DATA` landet vollständig im JSON-Backup (`index.html:2163-2167`) —
`trackersConfig` z. B. nicht.

**Alternativen:**
- Neue Felder (Journal, Training, Skincare, Emotionen) ebenfalls in
  `localStorage` ablegen, analog zu `trackersConfig`.
- Neue Felder additiv unter `DATA[dateKey]` ablegen.

**Begründung:** `localStorage` für die neuen, potenziell wertvollen
Tagebuch-/Trainingsdaten zu nutzen, hätte das bestehende Backup-Loch nur
vergrößert. Da `DATA` ohnehin schon vollständig gesichert wird, ist die
Ablage dort ohne zusätzlichen Aufwand am Export-Code sofort backup-sicher.

**Konsequenz:** Alle neuen Kategorien werden additiv unter `DATA[dateKey]`
gespeichert. Das bestehende Loch bei `trackersConfig`/Session-Log wird dabei
**nicht** rückwirkend behoben — das bleibt ein bewusst unangetasteter,
bekannter Zustand außerhalb dieser Änderung.

---

## 2026-09-28 — Reminder-Feature und Detail-Trainingsprotokoll vertagt
**Kontext:** Beim Brainstorming zu den neuen Kategorien wurden auch ein
Daily-Routine-Reminder ("um 15 Uhr Dehnen") und ein strukturiertes
Trainings-Protokoll (Übungen/Sätze/Gewicht) angesprochen.

**Alternativen:**
- Beides direkt mit in Änderung 01 aufnehmen.
- Beides auf spätere, eigene Änderungen verschieben.

**Begründung:** Der Reminder ist fachlich kein Tagesblatt-Thema, sondern ein
eigenständiges Benachrichtigungs-/Scheduling-Problem (inkl. der Frage, ob die
App dafür mit Windows starten soll). Das Detail-Trainingsprotokoll ist eine
Ausbaustufe des einfachen Trainings-Felds und lässt sich später sauber
draufsetzen, ohne die Grundstruktur zu gefährden. Beides jetzt mit
reinzunehmen, hätte Änderung 01 unnötig vergrößert.

**Konsequenz:** Änderung 01 baut nur das einfache Training-Feld (Art, Dauer,
Notiz) und lässt den Reminder komplett außen vor. Beides sind Kandidaten für
eigene künftige `/dev-change`-Durchläufe.
