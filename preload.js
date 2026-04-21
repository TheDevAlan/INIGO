const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  loadData: () => ipcRenderer.invoke('load-data'),
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  getDataPath: () => ipcRenderer.invoke('get-data-path'),
  showNotification: (title, body) => ipcRenderer.invoke('show-notification', title, body),
  toggleNotifications: (enabled) => ipcRenderer.invoke('toggle-notifications', enabled),
  getVersion: () => ipcRenderer.invoke('get-version'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  getReminders: () => ipcRenderer.invoke('get-reminders'),
  saveReminders: (reminders) => ipcRenderer.invoke('save-reminders', reminders),
});
