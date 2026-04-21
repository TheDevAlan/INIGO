const { app, BrowserWindow, Tray, Menu, Notification, ipcMain, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

// ═══════════════════ DATA ═══════════════════
const DATA_DIR = path.join(app.getPath('userData'), 'daily-flow-data');
const DATA_FILE = path.join(DATA_DIR, 'data.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '{}', 'utf-8');
}

ipcMain.handle('load-data', () => {
  ensureDataDir();
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')); }
  catch { return {}; }
});

ipcMain.handle('save-data', (_event, data) => {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  return true;
});

ipcMain.handle('get-data-path', () => DATA_DIR);

// ═══════════════════ NOTIFICATIONS ═══════════════════
let reminderIntervals = [];
let notificationsEnabled = true;
const APP_ICON_PATH = path.join(__dirname, 'assets', 'zenith-logo-mark.png');
const APP_DISPLAY_NAME = 'ZENITH Work & Wellbeing';
const APP_USER_MODEL_ID = 'zenith.workwellbeing';

app.setName(APP_DISPLAY_NAME);
app.setAppUserModelId(APP_USER_MODEL_ID);

const REMINDERS_FILE = path.join(app.getPath('userData'), 'daily-flow-data', 'reminders.json');

const DEFAULT_REMINDERS = [
  { id: 1, title: 'Bewegungspause', body: 'Gönn deinem Körper zwei Minuten Freiheit. Kurz aufstehen, strecken und die Beine lockern.', intervalMinutes: 50, enabled: true },
  { id: 2, title: 'Die Perfekte Atmung', body: 'Mund zu, Zunge an den Gaumen. 5,5 Sekunden ein, 5,5 Sekunden aus.', intervalMinutes: 60, enabled: true }
];

function loadRemindersConfig() {
  ensureDataDir();
  try {
    if (fs.existsSync(REMINDERS_FILE)) return JSON.parse(fs.readFileSync(REMINDERS_FILE, 'utf-8'));
  } catch {}
  return DEFAULT_REMINDERS;
}

function saveRemindersConfig(reminders) {
  ensureDataDir();
  fs.writeFileSync(REMINDERS_FILE, JSON.stringify(reminders, null, 2), 'utf-8');
}

function startReminders() {
  stopReminders();
  loadRemindersConfig().forEach(r => {
    if (!r.enabled || !r.intervalMinutes) return;
    reminderIntervals.push(setInterval(() => {
      if (!notificationsEnabled) return;
      new Notification({ appID: APP_USER_MODEL_ID, title: r.title, body: r.body, icon: APP_ICON_PATH, silent: false }).show();
    }, r.intervalMinutes * 60 * 1000));
  });
}

function stopReminders() {
  reminderIntervals.forEach(iv => clearInterval(iv));
  reminderIntervals = [];
}

ipcMain.handle('show-notification', (_event, title, body) => {
  new Notification({
    appID: APP_USER_MODEL_ID,
    title,
    body,
    icon: APP_ICON_PATH,
    silent: false
  }).show();
  return true;
});

ipcMain.handle('toggle-notifications', (_event, enabled) => {
  notificationsEnabled = enabled;
  return notificationsEnabled;
});

ipcMain.handle('get-version', () => app.getVersion());

ipcMain.handle('open-external', (_event, url) => {
  const { shell } = require('electron');
  shell.openExternal(url);
  return true;
});

ipcMain.handle('get-reminders', () => loadRemindersConfig());

ipcMain.handle('save-reminders', (_event, reminders) => {
  saveRemindersConfig(reminders);
  startReminders();
  return true;
});

// ═══════════════════ WINDOW & TRAY ═══════════════════
let mainWindow = null;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1060,
    height: 780,
    minWidth: 640,
    minHeight: 500,
    backgroundColor: '#0d1117',
    icon: APP_ICON_PATH,
    titleBarStyle: 'default',
    title: APP_DISPLAY_NAME,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
  mainWindow.setMenuBarVisibility(false);

  mainWindow.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  if (fs.existsSync(APP_ICON_PATH)) {
    const trayIcon = nativeImage.createFromPath(APP_ICON_PATH);
    tray = trayIcon.isEmpty()
      ? new Tray(nativeImage.createFromBuffer(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMElEQVQ4y2Ng+M9QzwAFjFAMBf8ZGBj+M0DB/0EEBnQBqjUQHxdYDCYX0NcLgwAAr0kIEVfyoWcAAAAASUVORK5CYII=', 'base64')))
      : new Tray(trayIcon.resize({ width: 18, height: 18 }));
  } else {
    const img = nativeImage.createFromBuffer(
      Buffer.from('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMElEQVQ4y2Ng+M9QzwAFjFAMBf8ZGBj+M0DB/0EEBnQBqjUQHxdYDCYX0NcLgwAAr0kIEVfyoWcAAAAASUVORK5CYII=', 'base64')
    );
    tray = new Tray(img);
  }

  const contextMenu = Menu.buildFromTemplate([
    { label: '\u00d6ffnen', click: () => { mainWindow.show(); mainWindow.focus(); } },
    { label: 'Erinnerungen', type: 'checkbox', checked: true, click: (item) => {
      notificationsEnabled = item.checked;
      if (notificationsEnabled) startReminders(); else stopReminders();
    }},
    { type: 'separator' },
    { label: 'Beenden', click: () => { app.isQuitting = true; stopReminders(); app.quit(); } }
  ]);

  tray.setToolTip(APP_DISPLAY_NAME);
  tray.setContextMenu(contextMenu);
  tray.on('click', () => { mainWindow.show(); mainWindow.focus(); });
}

app.whenReady().then(() => {
  createWindow();
  createTray();
  startReminders();
});

app.on('window-all-closed', () => {});
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
app.on('before-quit', () => { app.isQuitting = true; stopReminders(); });
