/**
 * Handlers de IPC: o renderer (UI) chama estes canais via `window.api`
 * (exposto no preload). Toda a leitura/escrita no banco acontece aqui, no
 * processo principal — o renderer nunca acessa o SQLite diretamente.
 */
import { ipcMain } from 'electron';
import { getDb } from './db';
import { loadState, seedIfEmpty, saveEscalas, saveHistorico, type PersistedState } from './db/repositories';
import type { Escala, HistoricoItem } from '../src/types';

export function registerIpc(): void {
  ipcMain.handle('db:load', () => loadState(getDb()));
  ipcMain.handle('db:seedIfEmpty', (_event, data: PersistedState) => seedIfEmpty(getDb(), data));
  ipcMain.handle('db:saveEscalas', (_event, escalas: Escala[]) => saveEscalas(getDb(), escalas));
  ipcMain.handle('db:saveHistorico', (_event, historico: HistoricoItem[]) => saveHistorico(getDb(), historico));
}
