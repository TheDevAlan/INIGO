const { app, BrowserWindow, Tray, Menu, Notification, ipcMain, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// ═══════════════════ DATA ═══════════════════
const DATA_DIR  = path.join(app.getPath('userData'), 'INIGO-data');
const DATA_FILE = path.join(DATA_DIR, 'data.json');
const DATA_TMP  = DATA_FILE + '.tmp';

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
  try {
    ensureDataDir();
    // Atomic write: write to .tmp then rename to prevent corruption on crash
    fs.writeFileSync(DATA_TMP, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(DATA_TMP, DATA_FILE);
    return true;
  } catch (err) {
    console.error('save-data failed:', err);
    return false;
  }
});

ipcMain.handle('get-data-path', () => DATA_DIR);

// ═══════════════════ NOTIFICATIONS ═══════════════════
const APP_ICON_PATH   = path.join(__dirname, 'assets', 'INIGO-logo-mark.png');
const APP_DISPLAY_NAME = 'INI:GO';

app.setName(APP_DISPLAY_NAME);
app.setAppUserModelId('inigo');

ipcMain.handle('show-notification', (_event, title, body) => {
  const n = new Notification({ title, body, icon: APP_ICON_PATH, silent: false });
  n.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
  n.show();
  return true;
});

ipcMain.handle('get-version', () => app.getVersion());

ipcMain.handle('window-minimize', () => { if (mainWindow) mainWindow.minimize(); });
ipcMain.handle('window-maximize', () => { if (mainWindow) { mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize(); } });
ipcMain.handle('window-close',    () => { app.quit(); });

ipcMain.handle('open-external', (_event, url) => {
  const { shell } = require('electron');
  shell.openExternal(url);
  return true;
});

// ═══════════════════ WINDOW & TRAY ═══════════════════
let mainWindow = null;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 980,
    height: 580,
    minWidth: 640,
    minHeight: 500,
    backgroundColor: '#0e0c0a',
    icon: APP_ICON_PATH,
    frame: false,
    title: APP_DISPLAY_NAME,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // In dev mode pass ?dev=1 so the renderer can enable test helpers
  mainWindow.loadFile('index.html', app.isPackaged ? {} : { query: { dev: '1' } });
  mainWindow.setMenuBarVisibility(false);

  mainWindow.on('close', () => { app.quit(); });
}

function createTray() {
  const trayIcon = fs.existsSync(APP_ICON_PATH)
    ? nativeImage.createFromPath(APP_ICON_PATH)
    : nativeImage.createEmpty();

  const img = trayIcon.isEmpty()
    ? nativeImage.createFromBuffer(Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMElEQVQ4y2Ng+M9QzwAFjFAMBf8ZGBj+M0DB/0EEBnQBqjUQHxdYDCYX0NcLgwAAr0kIEVfyoWcAAAAASUVORK5CYII=',
        'base64'))
    : trayIcon.resize({ width: 18, height: 18 });

  tray = new Tray(img);

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open', click: () => { mainWindow.show(); mainWindow.focus(); } },
    { type: 'separator' },
    { label: 'Quit', click: () => { app.isQuitting = true; app.quit(); } }
  ]);

  tray.setToolTip(APP_DISPLAY_NAME);
  tray.setContextMenu(contextMenu);
  tray.on('click', () => { mainWindow.show(); mainWindow.focus(); });
}

app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on('window-all-closed', () => { app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
app.on('before-quit', () => { app.isQuitting = true; });
