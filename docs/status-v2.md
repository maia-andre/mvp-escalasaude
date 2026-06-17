# Status v2 — MVP de validação (frontend, Fases 1–7)

**Data:** 2026-06-17
**Trilha:** A — MVP de validação, web puro (ver [`roadmap.md`](./roadmap.md))
**Situação:** ✅ Fases 1 a 7 implementadas; `tsc -b` e `vite build` limpos.
⚠️ Implementadas **sem preview visual no ambiente** — requerem validação de UI
(rodar `npm run dev` e conferir).

## Contexto e decisão

Ao retomar o projeto (após o merge da Fase 0 — Electron + SQLite), a direção foi
**reaberta**: em vez de seguir para o app desktop com persistência, o cliente optou
por **evoluir regra de negócio e frontend para validar a ideia com as gerentes das
UBS** e só **depois** decidir backend/persistência. A fundação Electron permanece no
código, **dormente** (modo web a ignora). Decisão e opções registradas no
[backlog 0001](./backlog/0001-persistencia-backend-electron.md).

Tudo roda com `npm run dev` (web puro); estado em memória (Zustand), reseta no
refresh — aceitável para protótipo.

## O que foi entregue (por fase)

### Fase 1 — Horário livre + capacidades
- Removidos os **turnos fixos** (manhã/tarde com match exato). O Header passou a ter
  um **slider de "horário de referência"** (06:00–20:00); o mapa e a lista mostram
  quem está presente *naquele instante*, por **sobreposição** do horário próprio de
  cada profissional.
- **Capacidade por sobreposição**: manhã e tarde podem dividir o mesmo setor.
- **Capacidades por profissional**: `funcoes[]` (o que pode fazer) e
  `setoresPermitidos[]` (onde pode atuar), com **avisos de adequação** no painel.
- Novos helpers `src/utils/horarioHelper.ts` e `regrasHelper.ts`.

### Fase 2 — Cadastros (CRUD)
- Modal **"Gerenciar"** no Header com abas **Profissionais** e **Setores**.
- `funcionarios` e `salas` deixaram de ser mocks imutáveis e viraram **estado no
  store** (ações `salvar*`/`excluir*`, com log de auditoria).
- Coordenadas das salas saíram do `coordMap` hardcoded em `MapaUnidade` para
  `Sala.pos` — **resolve o débito técnico nº 4** do `v1.md`: salas são criáveis e
  editáveis (inclusive posição na planta).

### Fase 3 — Visão semanal
- Toggle **Mapa | Semana** no Header (`modoVisao` no store).
- Grade **setor × 7 dias** com ocupação (`n/capacidade`) e cobertura; linhas-resumo
  de alocados e setores sem cobertura; cabeçalho de datas fixo ao rolar.
- Clicar num dia/célula abre aquele dia na planta. Novo `src/utils/dataHelper.ts`.

### Fase 4 — Apresentação / impressão
- Overlay de tela cheia: banner (logo/UBS/data/horário), KPIs, grade de setores com
  os profissionais por cargo, legenda. Botão **"Apresentar"** no Header.
- **"Imprimir"** usa `window.print()`; CSS `@media print` esconde a interface e
  imprime só o quadro, preservando as cores (`print-color-adjust: exact`).

### Fase 5 — Tema claro/escuro
- Toggle **sol/lua** no Header; preferência persistida em `localStorage` (classe
  `theme-light` no `<html>`).
- Superfícies migradas para **variáveis semânticas** (`--c-bg/--c-surface/...`); no
  tema claro, **inversão da escala `slate`** do Tailwind adapta a "chrome" inteira.
- A planta (SVG) também tematiza (cores das salas em variáveis); **apresentação e
  toast** ficam sempre escuros via `.surface-dark`. No tema claro, o texto do crachá
  de cargo acompanha a cor do nome (`.cargo-badge`).

### Fase 6 — Dividir carga horária (turno partido)
- Botão **tesoura** por profissional: corta a jornada ao meio e gera uma **2ª
  instância vinculada** (badges **Manhã/Tarde**). Como as faixas não se sobrepõem,
  cada metade é alocável a uma sala diferente no seu horário.
- Botão **juntar** desfaz. Store: `dividirCargaFuncionario`/`juntarCargaFuncionario`;
  campos `metade` e `divididoDe` em `Funcionario`.

### Fase 7 — Fixar e replicar escala
- Modal **"Replicar / Modelos"** (pelo painel de controles e pela Visão Semanal).
- **Replicar** o dia para um intervalo (presets ou datas livres), com **pular fins de
  semana** e modo **sobrescrever** vs **mesclar**.
- **Modelos**: fixar a escala do dia como modelo nomeado e aplicá-lo depois.
- Store: `modelos` + `salvarModelo`/`aplicarModelo`/`excluirModelo`/`replicarDia`.

## Decisões técnicas

- **Sem grande refactor para o turno partido:** dividir carga = gerar uma instância
  vinculada com janela não sobreposta, reaproveitando a regra de presença por horário.
  Alternativa estrutural (alocação carregar a própria janela) fica para o futuro.
- **Tema sem reescrever componente a componente:** inversão de `--color-slate-*` +
  variáveis de superfície resolvem a maior parte; exceções (sempre escuras) usam
  `.surface-dark`.
- **Mapa e apresentação** são "telas táticas": a planta tematiza, mas a apresentação
  permanece escura de propósito (projeção).

## Como rodar

```bash
npm install
npm run dev        # http://localhost:3000 — web puro, sem persistência
```

## Verificação feita neste ambiente

- ✅ `npx tsc -b` (renderer) — sem erros, em todas as fases.
- ✅ `npx vite build` — bundle de produção gerado, sem erros.
- ✅ Confirmações pontuais no bundle (ex.: `text-white`/`slate` usam variáveis;
  opacidade com `var()` vira `color-mix`).

## Pendências de verificação

- ⏳ **Validação visual de UI.** O Electron deste ambiente não abre a página
  (sandbox de rede), então não foi possível tirar screenshots. Rodar `npm run dev` e
  conferir, com atenção ao **tema claro** (acabamento) e às novas telas.
- ⏳ **Persistência** segue adiada (backlog 0001). Quando entrar, terá de cobrir
  também `funcionarios`/`salas`/`modelos` (hoje só `escalas`/`historico` são
  espelhados pela Fase 0).

## Entrega (PRs empilhados)

Trabalho fatiado em PRs por fase, empilhados (cada um sobre o anterior):
`#3` (Fases 1–2) → `#4` (Fase 3) → `#5` (Fase 4) → `#6` (Fase 5) → `#7` (Fase 6) →
`#8` (Fase 7). Ordem de merge: do #3 para o #8.

## Próximo passo

Validar a Trilha A com as gerentes; em paralelo, **polimento** (transversal) e, ao
aprovar, abrir o **Ponto de decisão de persistência** (roadmap / backlog 0001).
