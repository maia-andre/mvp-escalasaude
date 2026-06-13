/**
 * Processo principal do Electron: abre o banco, registra os handlers de IPC e
 * cria a janela do app. Em desenvolvimento carrega o dev server do Vite
 * (http://localhost:3000); empacotado, carrega o build estático em `dist/`.
 */
import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { registerIpc } from './ipc';
import { getDb } from './db';

const DEV_SERVER_URL = 'http://localhost:3000';

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: '#070b13',
    title: 'EscalaSaúde',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (!app.isPackaged) {
    void win.loadURL(DEV_SERVER_URL);
  } else {
    void win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  getDb(); // abre a conexão + roda as migrations
  registerIpc();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
