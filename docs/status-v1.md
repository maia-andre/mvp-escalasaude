# Status v1 — Fase 0 (Fundação Electron + persistência)

**Data:** 2026-06-13
**Fase:** 0 de 6 (ver `docs/roadmap.md`)
**Situação:** ✅ Implementada e validada por type-check + teste do banco. Falta
apenas a verificação final abrindo a janela do Electron em uma máquina com tela
(não é possível neste ambiente headless — ver "Pendências de verificação").

## Objetivo da fase

Transformar o MVP front-only (dados mockados em memória, que somem ao recarregar)
em um app desktop com **persistência real** em SQLite local, **sem alterar a UI**.

## O que foi entregue

### Processo principal do Electron (`electron/`)
- `electron/main.ts` — cria a janela; em dev carrega o Vite (`localhost:3000`),
  empacotado carrega `dist/index.html`. Abre o banco e registra o IPC no startup.
- `electron/preload.ts` — expõe `window.api` via `contextBridge`
  (`contextIsolation: true`, `nodeIntegration: false`).
- `electron/ipc.ts` — handlers `db:load`, `db:seedIfEmpty`, `db:saveEscalas`,
  `db:saveHistorico`. O renderer **nunca** acessa o banco direto.
- `electron/db/index.ts` — conexão `better-sqlite3` no arquivo
  `<userData>/escalasaude.db` (persistência por máquina), com `journal_mode=WAL`.
- `electron/db/repositories.ts` — `migrate` (CREATE TABLE IF NOT EXISTS),
  `seedIfEmpty`, `loadState`, `saveEscalas`, `saveHistorico`. Mapeia as linhas de
  volta para os tipos de domínio (horário aninhado, `cargosRecomendados` em JSON,
  `ativo` booleano).
- `electron/tsconfig.json` — type-check isolado do processo principal.

### Renderer (`src/`)
- `src/lib/electronApi.ts` — contrato tipado de `window.api` + helper
  `isElectron()`. Em modo web, `window.api` é `undefined`.
- `src/lib/persistence.ts` — `initPersistence()`: faz seed → hidrata o store →
  assina mudanças e espelha `escalas`/`historico` de volta ao SQLite
  (write-through). **No-op em modo web.**
- `src/store/useEscalaStore.ts` — nova ação `hydrate(...)` para carregar o estado
  vindo do banco. As ações existentes (`moverFuncionario`, etc.) e as validações
  permanecem **inalteradas** e síncronas.
- `src/main.tsx` — chama `initPersistence()` antes de renderizar (evita "piscar" a
  seed antes da hidratação no Electron).

### Tooling
- `package.json` — `"main": "dist-electron/main.cjs"` e scripts:
  - `npm run electron:dev` — sobe o Vite, espera a porta 3000, bundla o main/preload
    e abre o Electron.
  - `npm run build:electron` — esbuild empacota `main`/`preload` em `dist-electron/`.
  - `npm run typecheck` — type-check do renderer **e** do Electron.
- `.gitignore` — criado (não existia): ignora `node_modules/`, `dist-electron/` e
  os arquivos `*.db` locais.

## Decisões desta fase

- **Compatibilidade web preservada:** `npm run dev` continua funcionando como antes,
  sem persistência. A persistência só liga dentro do Electron. Risco baixo, sem
  regressão na experiência atual.
- **Banco espelha o domínio atual.** As colunas de multi-unidade entram na Fase 1.
- **`better-sqlite3` puro nesta fase** (prepared statements). O **Drizzle ORM +
  migrations** foi adiado para a Fase 1, quando o schema cresce com multi-unidade —
  reduz risco e dependências agora.
- **Write-through por substituição** (`DELETE` + `INSERT` em transação) de `escalas`
  e `historico` a cada mudança. Suficiente para a escala atual; pode virar
  diffs incrementais se o volume crescer.

## Como rodar

```bash
npm install            # na máquina da gerente: baixa o Electron e compila o SQLite
npm run electron:dev   # abre o app desktop apontando para o Vite em dev
# modo web (sem persistência), inalterado:
npm run dev
```

## Verificação feita neste ambiente

- ✅ `npx tsc -b` (renderer) — sem erros.
- ✅ `tsc -p electron/tsconfig.json` (processo principal) — sem erros.
- ✅ `npm run build:electron` — esbuild gera `main.cjs` (8.2kb) e `preload.cjs`.
- ✅ **Teste de fumaça do banco** (better-sqlite3 em memória): `migrate` →
  `seedIfEmpty` (idempotente) → `loadState` → `saveEscalas`/`saveHistorico` →
  `loadState`, conferindo round-trip de JSON, horário aninhado e booleano. Passou.

## Pendências de verificação

- ⏳ **Abrir a janela do Electron de fato.** Este ambiente é headless e o binário do
  Electron não é baixado aqui, então a verificação visual ("dados sobrevivem ao
  fechar/reabrir o app") precisa ser feita em um desktop: rodar `npm install`
  (baixa o Electron, compila o `better-sqlite3` para o ABI do Electron) e
  `npm run electron:dev`, mover um profissional, fechar e reabrir.
- ⏳ Em alguns casos o `better-sqlite3` precisa de rebuild para o Electron
  (`electron-rebuild`); isso será endereçado no empacotamento (Fase 6).

## Observação de repositório (pré-existente)

`node_modules/` e `dist/` estão **commitados** no repositório (desde o commit
inicial). O `.gitignore` adicionado evita que as novas dependências sejam
commitadas, mas recomenda-se, num passo de limpeza futuro, `git rm -r --cached
node_modules dist` para deixar de versioná-los.

## Próximo passo

**Fase 1 — Multi-unidade + login:** tabelas `unidades`/`usuarios`, tela de login,
escopo por unidade, geometria da planta por unidade e introdução do Drizzle ORM.
