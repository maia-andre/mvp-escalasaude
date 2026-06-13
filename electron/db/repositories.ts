/**
 * Camada de acesso ao SQLite (processo principal do Electron).
 *
 * Fase 0: o banco espelha exatamente o modelo de domínio atual (funcionarios,
 * salas, escalas, historico). As colunas de multi-unidade e o Drizzle ORM
 * entram na Fase 1. Usa-se `better-sqlite3` (síncrono) com prepared statements.
 */
import type Database from 'better-sqlite3';
import type { Funcionario, Sala, Escala, HistoricoItem } from '../../src/types';

export interface PersistedState {
  funcionarios: Funcionario[];
  salas: Sala[];
  escalas: Escala[];
  historico: HistoricoItem[];
}

/** Cria as tabelas na primeira execução (idempotente). */
export function migrate(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS funcionarios (
      id              TEXT PRIMARY KEY,
      nome            TEXT NOT NULL,
      matricula       TEXT NOT NULL,
      vinculo         TEXT NOT NULL,
      cargo           TEXT NOT NULL,
      horario_inicio  TEXT NOT NULL,
      horario_fim     TEXT NOT NULL,
      ativo           INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS salas (
      id                   TEXT PRIMARY KEY,
      nome                 TEXT NOT NULL,
      tipo                 TEXT NOT NULL,
      svg_id               TEXT NOT NULL,
      capacidade           INTEGER NOT NULL,
      cargos_recomendados  TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS escalas (
      id              TEXT PRIMARY KEY,
      data            TEXT NOT NULL,
      turno           TEXT NOT NULL,
      sala_id         TEXT NOT NULL,
      funcionario_id  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS historico (
      id         TEXT PRIMARY KEY,
      acao       TEXT NOT NULL,
      timestamp  TEXT NOT NULL,
      usuario    TEXT NOT NULL,
      detalhes   TEXT NOT NULL
    );
  `);
}

/** Popula o banco com a seed (mocks) somente se ainda estiver vazio. */
export function seedIfEmpty(db: Database.Database, data: PersistedState): void {
  const { n } = db.prepare('SELECT COUNT(*) AS n FROM funcionarios').get() as { n: number };
  if (n > 0) return;

  const insFunc = db.prepare(
    `INSERT INTO funcionarios (id, nome, matricula, vinculo, cargo, horario_inicio, horario_fim, ativo)
     VALUES (@id, @nome, @matricula, @vinculo, @cargo, @horario_inicio, @horario_fim, @ativo)`,
  );
  const insSala = db.prepare(
    `INSERT INTO salas (id, nome, tipo, svg_id, capacidade, cargos_recomendados)
     VALUES (@id, @nome, @tipo, @svg_id, @capacidade, @cargos_recomendados)`,
  );
  const insEscala = db.prepare(
    `INSERT INTO escalas (id, data, turno, sala_id, funcionario_id)
     VALUES (@id, @data, @turno, @sala_id, @funcionario_id)`,
  );
  const insHist = db.prepare(
    `INSERT INTO historico (id, acao, timestamp, usuario, detalhes)
     VALUES (@id, @acao, @timestamp, @usuario, @detalhes)`,
  );

  const tx = db.transaction(() => {
    for (const f of data.funcionarios) {
      insFunc.run({
        id: f.id,
        nome: f.nome,
        matricula: f.matricula,
        vinculo: f.vinculo,
        cargo: f.cargo,
        horario_inicio: f.horario.inicio,
        horario_fim: f.horario.fim,
        ativo: f.ativo ? 1 : 0,
      });
    }
    for (const s of data.salas) {
      insSala.run({
        id: s.id,
        nome: s.nome,
        tipo: s.tipo,
        svg_id: s.svgId,
        capacidade: s.capacidade,
        cargos_recomendados: JSON.stringify(s.cargosRecomendados ?? []),
      });
    }
    for (const e of data.escalas) {
      insEscala.run({
        id: e.id,
        data: e.data,
        turno: e.turno,
        sala_id: e.salaId,
        funcionario_id: e.funcionarioId,
      });
    }
    for (const h of data.historico) {
      insHist.run({
        id: h.id,
        acao: h.acao,
        timestamp: h.timestamp,
        usuario: h.usuario,
        detalhes: h.detalhes,
      });
    }
  });
  tx();
}

/** Lê todo o estado persistido e remapeia para os tipos de domínio. */
export function loadState(db: Database.Database): PersistedState {
  const funcionarios = (db.prepare('SELECT * FROM funcionarios').all() as Record<string, unknown>[]).map(
    (r): Funcionario => ({
      id: r.id as string,
      nome: r.nome as string,
      matricula: r.matricula as string,
      vinculo: r.vinculo as Funcionario['vinculo'],
      cargo: r.cargo as Funcionario['cargo'],
      horario: { inicio: r.horario_inicio as string, fim: r.horario_fim as string },
      ativo: !!r.ativo,
    }),
  );

  const salas = (db.prepare('SELECT * FROM salas').all() as Record<string, unknown>[]).map(
    (r): Sala => ({
      id: r.id as string,
      nome: r.nome as string,
      tipo: r.tipo as Sala['tipo'],
      svgId: r.svg_id as string,
      capacidade: r.capacidade as number,
      cargosRecomendados: JSON.parse((r.cargos_recomendados as string) || '[]') as Sala['cargosRecomendados'],
    }),
  );

  const escalas = (db.prepare('SELECT * FROM escalas').all() as Record<string, unknown>[]).map(
    (r): Escala => ({
      id: r.id as string,
      data: r.data as string,
      turno: r.turno as Escala['turno'],
      salaId: r.sala_id as string,
      funcionarioId: r.funcionario_id as string,
    }),
  );

  const historico = db
    .prepare('SELECT id, acao, timestamp, usuario, detalhes FROM historico')
    .all() as HistoricoItem[];

  return { funcionarios, salas, escalas, historico };
}

/** Substitui todas as alocações pela versão atual do store (write-through). */
export function saveEscalas(db: Database.Database, escalas: Escala[]): void {
  const del = db.prepare('DELETE FROM escalas');
  const ins = db.prepare(
    `INSERT INTO escalas (id, data, turno, sala_id, funcionario_id)
     VALUES (@id, @data, @turno, @sala_id, @funcionario_id)`,
  );
  const tx = db.transaction(() => {
    del.run();
    for (const e of escalas) {
      ins.run({
        id: e.id,
        data: e.data,
        turno: e.turno,
        sala_id: e.salaId,
        funcionario_id: e.funcionarioId,
      });
    }
  });
  tx();
}

/** Substitui todo o log de auditoria pela versão atual do store. */
export function saveHistorico(db: Database.Database, historico: HistoricoItem[]): void {
  const del = db.prepare('DELETE FROM historico');
  const ins = db.prepare(
    `INSERT INTO historico (id, acao, timestamp, usuario, detalhes)
     VALUES (@id, @acao, @timestamp, @usuario, @detalhes)`,
  );
  const tx = db.transaction(() => {
    del.run();
    for (const h of historico) {
      ins.run({
        id: h.id,
        acao: h.acao,
        timestamp: h.timestamp,
        usuario: h.usuario,
        detalhes: h.detalhes,
      });
    }
  });
  tx();
}
