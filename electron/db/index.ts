/**
 * Conexão com o SQLite local. O arquivo `.db` fica na pasta de dados do usuário
 * do app (app.getPath('userData')), garantindo persistência por máquina.
 */
import BetterSqlite3 from 'better-sqlite3';
import { app } from 'electron';
import path from 'node:path';
import { migrate } from './repositories';

let _db: BetterSqlite3.Database | null = null;

export function getDb(): BetterSqlite3.Database {
  if (_db) return _db;
  const dbPath = path.join(app.getPath('userData'), 'escalasaude.db');
  _db = new BetterSqlite3(dbPath);
  _db.pragma('journal_mode = WAL');
  migrate(_db);
  return _db;
}
