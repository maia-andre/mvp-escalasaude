/**
 * Contrato tipado da ponte Electron exposta no preload como `window.api`.
 *
 * Em modo web puro (`npm run dev` sem Electron) `window.api` é `undefined` e o
 * app funciona normalmente, sem persistência. Em modo Electron, este é o único
 * caminho do renderer para o banco SQLite (via IPC).
 */
import type { Funcionario, Sala, Escala, HistoricoItem } from '../types';

export interface PersistedState {
  funcionarios: Funcionario[];
  salas: Sala[];
  escalas: Escala[];
  historico: HistoricoItem[];
}

export interface ElectronApi {
  loadState: () => Promise<PersistedState>;
  seedIfEmpty: (data: PersistedState) => Promise<void>;
  saveEscalas: (escalas: Escala[]) => Promise<void>;
  saveHistorico: (historico: HistoricoItem[]) => Promise<void>;
}

declare global {
  interface Window {
    api?: ElectronApi;
  }
}

export const electronApi: ElectronApi | undefined =
  typeof window !== 'undefined' ? window.api : undefined;

export const isElectron = (): boolean => !!electronApi;
