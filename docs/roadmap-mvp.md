# 🧭 Roteiro de Evolução — MVP EscalaSaúde (Frontend + Regra de Negócio)

Modo **protótipo de validação**: rodamos em web puro (`npm run dev`), sem
persistência (ver [backlog 0001](./backlog/0001-persistencia-backend-electron.md)).
Foco em evoluir regra de negócio e telas para validar a ideia com as gerentes das UBS.

Escopo acordado em 16/06/2026 (todas as frentes abaixo + extras já incluídos).

## Ordem proposta (fundação → telas → acabamento)

### Fase 1 — Fundação de regra de negócio  ✅ (16/06/2026)
- **Horário livre por profissional:** removidos os turnos fixos; Header tem slider de
  "horário de referência" e a presença é por sobreposição do horário próprio de cada um.
- **Capacidades por profissional:** `funcoes[]` (o que pode fazer) + `setoresPermitidos[]`
  (onde pode atuar), com avisos de adequação no painel. Capacidade por sobreposição.

### Fase 2 — Telas de gestão (cadastro)  ✅ (16/06/2026)
- CRUD de **profissionais** e de **salas/setores** via modal "Gerenciar" (Header).
- `funcionarios` e `salas` migrados de mock imutável para **estado no store**.
- Coordenadas das salas saíram do `coordMap` hardcoded e foram para `Sala.pos`
  (débito técnico nº 4 do `v1.md` resolvido) — salas agora são criáveis/editáveis.

### Fase 3 — Visão semanal da escala  ✅ (16/06/2026)
- Toggle Mapa | Semana no Header; grade setor × 7 dias com ocupação e cobertura.
- Navegação entre semanas; clicar num dia/célula abre aquele dia na planta.
- Novo `dataHelper` para a aritmética de semana; estado `modoVisao` no store.

### Fase 4 — Modo apresentação / impressão  ✅ (17/06/2026)
- Overlay limpo (banner + KPIs + grade de setores com profissionais + legenda)
  para projetar na reunião ou imprimir/fixar no mural.
- Botão "Apresentar" no Header; botão "Imprimir" usa `window.print()` com CSS de
  impressão (`@media print`) que esconde a interface e preserva as cores do quadro.

### Fase 5 — Tema claro/escuro  ✅ (17/06/2026)
- Toggle sol/lua no Header; preferência persistida em `localStorage`.
- Superfícies viram variáveis semânticas (`--c-bg/--c-surface/--c-surface-2`) e o
  tema claro inverte a escala `slate` do Tailwind — adapta a "chrome" inteira sem
  editar componente a componente.
- **A planta interativa (SVG) e o modo apresentação permanecem escuros** de
  propósito ("telas táticas"), evitando problemas de contraste no croqui.
- ⚠️ Precisa de **validação visual** (foi implementado sem preview no ambiente).

### Fase 6 — Dividir carga horária (turno partido)  ✅ (17/06/2026)
Botão **"Dividir carga horária"** (tesoura) na lista de Profissionais. Permite que
um profissional fique disponível **duas vezes no mesmo dia**, em faixas que **não
se sobrepõem** (ex.: Dra. Daniela de manhã no Acolhimento e à tarde no Consultório).

Implementado conforme a abordagem abaixo: a divisão corta a jornada ao meio e gera
uma 2ª instância vinculada (badges **Manhã/Tarde**); o botão **Juntar** desfaz.
Ações `dividirCargaFuncionario` / `juntarCargaFuncionario` no store; campos
`metade` e `divididoDe` em `Funcionario`.

Abordagem proposta (aproveita o modelo atual, sem grande refactor):
- O botão divide a janela do profissional em duas (no ponto médio ou num horário
  escolhido) e gera uma **segunda "instância" vinculada** do profissional (mesma
  matrícula e capacidades), uma cobrindo a manhã e outra a tarde.
- Como as janelas não se sobrepõem, cada instância é alocável a uma sala diferente
  sem conflito, usando a regra de presença por horário **já existente**.
- Marcar o vínculo (campo `divididoDe` / sufixo "(Manhã)"/"(Tarde)") para permitir
  "juntar de volta" e para a auditoria.
- Alternativa mais estrutural (futuro): a **alocação** carregar a própria janela de
  horário, permitindo N alocações/dia por pessoa nativamente.

### Fase 7 — Fixar e replicar escala  ✅ (17/06/2026)
- **Fixar** a escala do dia como **modelo nomeado** e **aplicar** um modelo ao dia
  selecionado (aba "Modelos").
- **Replicar** o dia atual para um intervalo (presets: resto da semana, próximos
  7/30 dias, ou datas livres), com **pular fins de semana** e modo **sobrescrever**
  vs **mesclar** (mesclar não duplica a mesma pessoa no dia).
- Modal "Replicar / Modelos" acessível pelo painel de controles e pela Visão Semanal.
- Desfazer: via "Limpar Dia" no destino ou re-replicar; tudo fica no log de auditoria.
  (Undo granular fica para o polimento.)

### Transversal — Polimento (próximo / contínuo)
- Estados vazios, feedback de adequação de cargo **no mapa** (não só no painel),
  onboarding, micro-interações, acessibilidade, e ajuste fino do tema claro.

> Ordem é proposta — pode ser repriorizada. Tema claro/escuro e polimento podem
> entrar em paralelo conforme a necessidade da demo.
