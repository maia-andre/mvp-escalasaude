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

### Fase 4 — Modo apresentação / impressão
- Vista limpa para projetar na reunião ou imprimir/fixar no mural.

### Fase 5 — Tema claro/escuro
- Tokenizar as cores (hoje muitos hex literais nos componentes) e alternar tema.

### Transversal — Polimento (contínuo)
- Estados vazios, feedback de adequação de cargo **no mapa** (não só no painel),
  onboarding, micro-interações, acessibilidade.

> Ordem é proposta — pode ser repriorizada. Tema claro/escuro e polimento podem
> entrar em paralelo conforme a necessidade da demo.
