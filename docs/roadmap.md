# Roadmap — EscalaSaúde

Plano de evolução do MVP **EscalaSaúde** (painel visual de escala de UBS, São José
dos Campos). Este documento é a referência viva da direção do projeto. O progresso
por fase é registrado em arquivos `docs/status-*.md`.

## Visão

Sair de um MVP front-only com dados mockados em memória para um **aplicativo desktop
instalável**, rodando **localmente** na máquina de cada gerente de UBS, com
**persistência real** dos dados, cadastro próprio (profissionais, salas, planta),
login, gestão completa de escala e relatórios.

## Decisões de arquitetura (definidas com o cliente)

- **Empacotamento:** aplicativo **desktop com Electron** (programa instalável, sem
  terminal), tendo a UI React/Vite atual como *renderer*.
- **Persistência:** **SQLite** local (arquivo `.db` na máquina), via
  `better-sqlite3` no processo principal. Drizzle ORM (schema/migrations tipados)
  é introduzido a partir da Fase 1, quando o schema cresce com multi-unidade.
- **Multi-unidade:** o app guarda **as duas UBS** e a unidade fica **atrelada ao
  login da gerente** (seletor de unidade), já preparado para escalar para mais
  unidades no futuro.
- **Planta por unidade:** cada UBS tem layout diferente; a geometria das salas
  (x/y/w/h) passa a ser **dado por unidade**, não mais `coordMap` hardcoded.
- **Acesso:** login local (só perfil `gerente` por ora; campo `role` já preparado).
- **Escala:** turnos fixos (manhã/tarde) evoluem para **horários flexíveis**
  (início/fim), com visões semanal e mensal e gestão de ausências.
- **Plataforma:** desktop web (Windows) por enquanto.

## Arquitetura-alvo

- **Renderer:** app React 19 + Vite 8 + Zustand + dnd-kit + Tailwind v4 (atual).
- **Main process (Electron):** janela, ciclo de vida, acesso ao SQLite.
- **Preload:** ponte segura (`contextBridge`) expondo uma API tipada em
  `window.api` (renderer nunca toca no banco direto; conversa por IPC).
- **Camada de dados:** o `useEscalaStore` continua sendo a fachada (mesmas ações),
  mas o estado é **hidratado do banco** na inicialização e **espelhado de volta**
  ao SQLite a cada mudança. Em modo web puro (`npm run dev`), a persistência é
  ignorada graciosamente e o app funciona como antes.

## Modelo de dados (evolução das tabelas)

- `unidades` — id, nome, município, config da planta.
- `usuarios` — id, nome, email, `senha_hash`, `role`, `unidade_id`.
- `salas` — + `unidade_id` + geometria (x, y, w, h) + `cargos_obrigatorios`.
- `funcionarios` — + `unidade_id` + `carga_horaria_semanal`.
- `alocacoes` (escalas) — `data`, `horario_inicio`/`horario_fim`, `sala_id`,
  `funcionario_id`.
- `ausencias` — `funcionario_id`, tipo (`folga`/`ferias`/`falta`/`afastamento`),
  `data_inicio`, `data_fim`, motivo.
- `historico` — log de auditoria, agora persistido.

## Fases

### Fase 0 — Fundação Electron + persistência ✅ (em execução)
Estruturar Electron (main/preload), SQLite local, *seed* a partir dos mocks atuais
e fazer o store hidratar do banco e espelhar mudanças. UI inalterada.
- *Pronto quando:* o app abre como janela desktop e **os dados sobrevivem ao
  fechar/reabrir**. Modo web continua funcionando.

### Fase 1 — Multi-unidade + login
Tabelas `unidades` e `usuarios`, tela de login, sessão, dados escopados por
unidade. Geometria da planta por unidade. Introdução do Drizzle ORM + migrations.
Cadastro das 2 UBS.
- *Pronto quando:* a gerente loga e vê **sua** unidade com **sua** planta.

### Fase 2 — Cadastros (CRUD) na plataforma
CRUD de funcionários, salas e dados da unidade. Editor simples de planta
(reposicionar/redimensionar salas) para desenhar a 2ª UBS pela interface.
- *Pronto quando:* dá para montar uma UBS do zero pela interface.

### Fase 3 — Motor de escala avançado
Horários flexíveis (início/fim), visões semanal e mensal com navegação por data,
e ausências (folga/férias/falta/afastamento) refletindo na disponibilidade.
- *Pronto quando:* dá para montar a escala da semana e marcar férias/folgas.

### Fase 4 — Validações operacionais
Carga horária (limite semanal por vínculo/contrato), função obrigatória por sala
(bloqueio configurável), conflito de horário do mesmo profissional e cobertura
mínima.
- *Pronto quando:* o sistema bloqueia/alerta conforme as regras.

### Fase 5 — Dashboard + PDF/impressão
Dashboard de indicadores (cobertura, horas, ausências, ocupação por sala) e modelo
imprimível + exportação PDF (via `webContents.printToPDF` do Electron).
- *Pronto quando:* dá para gerar PDF da escala e do dashboard.

### Fase 6 — Empacotamento e distribuição
`electron-builder` gera instalador (Windows) com ícone, sem terminal.
Backup/restore do arquivo `.db`.
- *Pronto quando:* existe um instalador que a gerente roda sem terminal.

## Premissas

- SO das gerentes: **Windows** (relevante na Fase 6).
- Login local, senha com hash; sem servidor/nuvem; cada máquina é independente.
- Mantemos React 19 + Zustand + dnd-kit + Tailwind; a UI é preservada — o que
  evolui é a camada de dados e os novos módulos (login, cadastros, dashboard).
