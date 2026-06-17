# 0001 — Persistência de dados, Backend e Electron

- **Status:** ⏸️ Adiado — retomar **após validação do MVP** com as gerentes das UBS.
- **Registrado em:** 16/06/2026
- **Contexto:** decisão tomada ao retomar o projeto após o merge do PR #2
  ("Fase 0: fundação Electron + persistência SQLite") na `main`.

---

## 1. Resumo da decisão

O MVP é um **protótipo de validação de ideia**. Antes de investir em backend/banco,
queremos confirmar com as gerentes das UBS que a abordagem visual (arrastar
profissionais na planta baixa) resolve o problema delas.

Portanto, **adiamos toda a camada de persistência** e seguimos desenvolvendo em
**modo web puro**, onde o estado vive só em memória (Zustand) e reseta a cada
refresh — o que é aceitável para demonstração e iteração rápida de UI/regra.

**Como rodar enquanto isso:**
```bash
npm run dev        # http://localhost:3000 — web puro, sem persistência
```

---

## 2. O que já existe na `main` (e fica dormente)

O PR #2 já trouxe uma fundação de desktop + persistência que **permanece no
código, porém inativa** no modo web:

- `electron/` — processo principal, preload, IPC e camada de banco.
  - `electron/main.ts` — cria a janela; em dev carrega `http://localhost:3000`.
  - `electron/db/index.ts` — abre o SQLite em `app.getPath('userData')/escalasaude.db`.
  - `electron/db/repositories.ts` — migrations e repositórios.
  - `electron/ipc.ts` — handlers IPC (load/seed/save).
- `src/lib/electronApi.ts` — ponte tipada `window.api`. **Já trata o modo web:**
  quando `window.api` é `undefined` (rodando sem Electron), o app funciona
  normalmente, só que sem salvar nada. Por isso a fundação Electron **não atrapalha**
  o desenvolvimento web.
- Dependências adicionadas no `package.json`: `better-sqlite3`, `electron`,
  `esbuild`, `concurrently`, `wait-on`, `@electron/...`.
- Scripts: `electron:dev`, `build:electron`, `typecheck`.

> **Importante:** não precisamos remover nada disso. O modo `npm run dev` ignora a
> camada Electron de forma limpa. A fundação fica pronta para quando (e se)
> decidirmos persistir.

---

## 3. O bloqueio descoberto no `npm run electron:dev`

Ao testar o app completo (Electron + SQLite), ele **quebra na inicialização**.
Diagnóstico feito em 16/06/2026:

- `better-sqlite3` é um **módulo nativo** (binário C++ atrelado à ABI do runtime).
- O binário instalado pelo `npm install` foi compilado para o **Node 24 do sistema
  (NODE_MODULE_VERSION 137)**, mas o **Electron 42 exige a ABI 146**. Erro exato:
  ```
  The module '...better_sqlite3.node' was compiled against a different Node.js
  version using NODE_MODULE_VERSION 137. This version of Node.js requires
  NODE_MODULE_VERSION 146.
  ```
- **Não há prebuild** publicado do `better-sqlite3` v12.10.0 para o Electron 42
  (`...electron-v146-win32-x64.tar.gz` → **HTTP 404**).
- Compilar do código-fonte exige o **Visual Studio C++ Build Tools**, que **não está
  instalado** nesta máquina (o `node-gyp` falha com "Could not find any Visual
  Studio installation").

### Lacuna do projeto

O `package.json` **não tem** nenhum passo automático (ex.: `@electron/rebuild` em
`postinstall`) que reconstrua o módulo nativo para a ABI do Electron. Qualquer
pessoa que clonar e rodar `npm run electron:dev` vai esbarrar nisso.

### Como destravar o Electron (quando for a hora)

1. Instalar o C++ Build Tools (pesado, requer admin):
   ```powershell
   winget install Microsoft.VisualStudio.2022.BuildTools --override "--quiet --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"
   ```
2. Recompilar o módulo para o Electron:
   ```bash
   npx @electron/rebuild -f -w better-sqlite3
   ```
3. Rodar: `npm run electron:dev`
4. (Recomendado) Automatizar: adicionar `@electron/rebuild` como devDependency e um
   script `postinstall`, e documentar o pré-requisito do Build Tools no README.

---

## 4. Opções de persistência/backend a avaliar (pós-validação)

Quando a ideia for aprovada, escolher a camada de dados conforme o cenário real
(uma UBS isolada? várias UBS? múltiplos gestores simultâneos? offline?). Opções,
do mais simples ao mais robusto:

| Opção | Esforço | Multiusuário | Offline | Observações |
|-------|---------|--------------|---------|-------------|
| **Em memória (atual)** | — | ❌ | ❌ | Só protótipo; reseta no refresh. |
| **localStorage / IndexedDB** | Baixo | ❌ (por navegador) | ✅ | Persiste no navegador sem backend. Ótimo para um piloto de 1 gestora. Migração simples a partir do Zustand. |
| **Electron + SQLite** (já iniciado) | Médio | ❌ (por máquina) | ✅ | Desktop instalável, dados locais. Resolve o atrito do build nativo (seção 3). Bom para uma recepção/gerência fixa. |
| **Backend web + Postgres** (NestJS/Express/Fastify) | Alto | ✅ | ❌ | App web hospedado, multiunidade, auth real, auditoria com usuário logado. Caminho da "Fase 2" do `docs/v1.md`. |
| **BaaS (Supabase / Firebase)** | Médio | ✅ | parcial | Banco + auth + realtime hospedados, sem manter servidor. Acelera muito o MVP→produção. Supabase = Postgres gerenciado. |

### Atualização (16/06/2026) — escopo da persistência cresceu

Com a **Fase 2**, `funcionarios` e `salas` deixaram de ser mocks imutáveis e agora
são **estado mutável no store** (CRUD pela tela "Gerenciar"). Quando a persistência
for retomada, ela precisará salvar/hidratar **também** esses cadastros — hoje
`src/lib/persistence.ts` só espelha `escalas` e `historico`, e o `PersistedState`
em `src/lib/electronApi.ts` + o schema em `electron/db/repositories.ts` teriam que
cobrir `funcionarios` e `salas` (incl. o campo `pos` das salas).

### Pontos a decidir junto

- **Modelo de implantação:** web (navegador) vs desktop (Electron) vs ambos.
- **Multiunidade:** seletor de UBS + plantas baixas distintas (ver `docs/v1.md`, Fase 2).
- **Autenticação/auditoria:** hoje o log usa "Gerente Geral (SJC)" fixo; com login,
  registrar o usuário real.
- **Coordenadas das salas:** hoje hardcoded em `MapaUnidade.tsx` (`coordMap`);
  num cenário multiunidade precisariam vir de dados/API.

---

## 5. Próximo passo imediato (foco atual)

Evoluir **regra de negócio + frontend** em modo web (`npm run dev`), validando as
telas e o fluxo com as gerentes. Persistência entra **depois** da validação.
