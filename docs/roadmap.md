# Roadmap — EscalaSaúde

Plano de evolução do **EscalaSaúde** (painel visual de escala de UBS, São José dos
Campos). Documento **único e vivo** da direção do projeto. O progresso por etapa é
registrado em `docs/status-*.md`.

> **Princípio atual (jun/2026): validar antes de investir em backend.**
> O EscalaSaúde está em modo **protótipo de validação**: roda em **web puro**
> (`npm run dev`), com estado em memória. O foco é evoluir **regra de negócio e
> frontend** para apresentar às gerentes das UBS. **Persistência, backend e
> empacotamento só serão decididos se/quando a ideia for aprovada** — ver o
> [Ponto de decisão](#ponto-de-decisão--persistência--backend) e o
> [backlog 0001](./backlog/0001-persistencia-backend-electron.md).

O projeto tem **duas trilhas**: a **Trilha A** (validação, em andamento/concluída) e
a **Trilha B** (produto, pós-validação).

---

## Trilha A — MVP de validação (frontend, web puro) ✅

Telas e regras para validar a ideia com as gerentes. Tudo rodando com `npm run dev`,
sem persistência. **Fases 1 a 7 concluídas** (detalhes em
[`status-v2.md`](./status-v2.md)).

| Fase | Entrega | Status |
|------|---------|--------|
| 1 | **Horário livre por profissional** (fim dos turnos fixos; slider de horário de referência; presença por sobreposição) e **capacidades** (`funcoes[]` + `setoresPermitidos[]`) com avisos de adequação | ✅ |
| 2 | **Cadastros** (CRUD de profissionais e salas via modal "Gerenciar"); dados migrados para o store; coordenadas das salas em `Sala.pos` (fim do `coordMap` hardcoded) | ✅ |
| 3 | **Visão semanal** (grade setor × 7 dias, cobertura, navegação; clicar abre o dia no mapa) | ✅ |
| 4 | **Modo apresentação / impressão** (quadro limpo para projetar/imprimir; `window.print()` + CSS de impressão) | ✅ |
| 5 | **Tema claro/escuro** (toggle persistido; superfícies em variáveis + inversão da escala slate) | ✅ |
| 6 | **Dividir carga horária** (turno partido: profissional disponível manhã e tarde em salas diferentes; juntar de volta) | ✅ |
| 7 | **Fixar e replicar escala** (modelos nomeados + replicação por intervalo, com pular fins de semana e sobrescrever/mesclar) | ✅ |

### Transversal — Polimento (próximo / contínuo)
Estados vazios, feedback de adequação de cargo **no próprio mapa** (não só no
painel), onboarding, micro-interações, **undo granular**, acessibilidade e ajuste
fino do tema claro.

---

## Ponto de decisão — Persistência & Backend

Hoje o estado vive **só em memória** (Zustand) e reseta no refresh — aceitável para
o protótipo. **Após a validação**, escolher a camada de dados conforme o cenário
real (1 UBS? várias? multiusuário? offline? desktop ou web?). Opções e trade-offs
detalhados no **[backlog 0001](./backlog/0001-persistencia-backend-electron.md)**:

- **localStorage / IndexedDB** — zero backend, persiste no navegador. Ótimo para um
  piloto enxuto.
- **Electron + SQLite** — desktop instalável, dados locais. **Já existe uma fundação
  pronta porém dormente** no código (`electron/`, `src/lib/persistence.ts`,
  `better-sqlite3`), entregue na Fase 0 — ver [`status-v1.md`](./status-v1.md).
- **Backend web + Postgres** (NestJS/Express) — multiunidade, auth real, hospedado.
- **BaaS (Supabase / Firebase)** — banco + auth + realtime gerenciados.

> A direção original (jun/2026, no `status-v1.md`) assumia **Electron + SQLite como
> decidido**. Nesta fase a decisão foi **reaberta**: validar primeiro, escolher a
> persistência depois. A Trilha B abaixo descreve o **produto-alvo** independentemente
> de qual camada de dados for escolhida.

---

## Trilha B — Produto (pós-validação)

Metas de produto a partir da aprovação da ideia. Pré-requisito: decidir a
persistência (acima). As etapas abaixo valem para qualquer camada escolhida.

- **Multiunidade + login.** Guardar as 2 UBS; unidade atrelada ao login da gerente
  (campo `role` já previsto). Dados escopados por unidade.
- **Planta por unidade.** Geometria das salas (`Sala.pos`) já é dado editável; falta
  um **editor visual de planta** (arrastar/redimensionar) e múltiplas plantas.
- **Motor de escala avançado.** Visão **mensal**; **ausências** (folga/férias/falta/
  afastamento) refletindo na disponibilidade; jornadas com início/fim por dia.
- **Validações operacionais.** Carga horária semanal por vínculo/contrato; função
  obrigatória por sala (bloqueio configurável, hoje é só aviso); conflito de horário;
  cobertura mínima.
- **Dashboard + PDF.** Indicadores (cobertura, horas, ausências, ocupação por sala) e
  exportação em PDF (no desktop, via `webContents.printToPDF`).
- **Empacotamento e distribuição** (se a via desktop for escolhida). `electron-builder`
  gera instalador Windows sem terminal; backup/restore do `.db`.

---

## Premissas

- SO das gerentes: **Windows**.
- A UI atual (React 19 + Vite 8 + Zustand + dnd-kit + Tailwind v4) é preservada; o
  que evolui é a camada de dados e os novos módulos.
- O `useEscalaStore` é a **fachada de dados**: as telas não mudam quando a
  persistência entrar — o store passa a hidratar/espelhar a partir da camada escolhida
  (padrão já provado na Fase 0 com o Electron).
