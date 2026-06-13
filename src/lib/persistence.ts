/**
 * Liga o store Zustand ao banco local quando rodando dentro do Electron:
 *  1. faz a seed do banco (a partir dos mocks) na primeira execução;
 *  2. hidrata o store com o estado persistido;
 *  3. espelha (write-through) toda mudança de `escalas`/`historico` de volta
 *     ao SQLite.
 *
 * Em modo web puro (`electronApi` indefinido) é um no-op: o app segue usando os
 * mocks em memória, exatamente como antes.
 */
import { useEscalaStore } from '../store/useEscalaStore';
import { electronApi } from './electronApi';
import { mockFuncionarios } from '../data/funcionarios';
import { mockSalas } from '../data/salas';
import { mockEscalas } from '../data/escalas';

let started = false;

export async function initPersistence(): Promise<void> {
  const api = electronApi;
  if (started || !api) return; // modo web: sem persistência
  started = true;

  // 1. Seed apenas na primeira execução (o banco decide se já está populado).
  await api.seedIfEmpty({
    funcionarios: mockFuncionarios,
    salas: mockSalas,
    escalas: mockEscalas,
    historico: useEscalaStore.getState().historico,
  });

  // 2. Hidrata o store com o que está no banco.
  const state = await api.loadState();
  useEscalaStore.getState().hydrate({
    escalas: state.escalas,
    historico: state.historico,
  });

  // 3. Espelha mudanças futuras de volta ao SQLite.
  useEscalaStore.subscribe((s, prev) => {
    if (s.escalas !== prev.escalas) void api.saveEscalas(s.escalas);
    if (s.historico !== prev.historico) void api.saveHistorico(s.historico);
  });
}
