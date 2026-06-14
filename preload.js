const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  loadData:         () => ipcRenderer.invoke('load-data'),
  saveData:         (data) => ipcRenderer.invoke('save-data', data),
  getDataPath:      () => ipcRenderer.invoke('get-data-path'),
  isDev:            () => ipcRenderer.invoke('is-dev'),
  showNotification: (title, body) => ipcRenderer.invoke('show-notification', title, body),
  getVersion:       () => ipcRenderer.invoke('get-version'),
  openExternal:     (url) => ipcRenderer.invoke('open-external', url),
  windowMinimize:   () => ipcRenderer.invoke('window-minimize'),
  windowMaximize:   () => ipcRenderer.invoke('window-maximize'),
  windowClose:      () => ipcRenderer.invoke('window-close'),
});
