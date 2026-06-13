/**
 * Preload: expõe uma API mínima e tipada em `window.api` para o renderer,
 * usando contextBridge (contextIsolation ligado). O contrato espelha
 * `ElectronApi` em src/lib/electronApi.ts.
 */
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  loadState: () => ipcRenderer.invoke('db:load'),
  seedIfEmpty: (data: unknown) => ipcRenderer.invoke('db:seedIfEmpty', data),
  saveEscalas: (escalas: unknown) => ipcRenderer.invoke('db:saveEscalas', escalas),
  saveHistorico: (historico: unknown) => ipcRenderer.invoke('db:saveHistorico', historico),
});
