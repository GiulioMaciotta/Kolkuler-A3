const { contextBridge, ipcRenderer } = require('electron');

// Expor APIs seguras para o frontend
contextBridge.exposeInMainWorld('electronAPI', {
  // Exemplo: abrir diálogos
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  
  // Exemplo: salvar dados
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  
  // Exemplo: obter info do sistema
  getVersion: () => ipcRenderer.invoke('get-version')
});