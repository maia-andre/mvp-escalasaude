# CLAUDE.md

Guidance for AI assistants working in this repository.

## Overview

**EscalaSaúde** is a front-end-only MVP: a visual shift-scheduling ("escala")
dashboard for a pilot health unit (UBS) of the **São José dos Campos (SJC)**
municipality. A manager drags-and-drops staff (`funcionários`) onto an SVG
floor-plan of the unit, with live capacity / coverage / role-suitability
validations and a session audit log.

Key facts to internalize before editing:

- **No backend, no persistence.** All data is in-memory mock data. A page refresh
  resets everything to the seed state. There is no API, database, router, or auth.
- **Domain language is Portuguese.** Variables, types, store actions, and UI strings
  use Portuguese terms (`sala` = room, `cargo` = role, `vínculo` = employment type,
  `turno` = shift/period, `escala` = schedule, `funcionário` = staff member). Code
  comments mix Portuguese and English. Match this when adding code.

## Commands

```bash
npm install        # install dependencies
npm run dev        # Vite dev server on PORT 3000, auto-opens browser
npm run build      # tsc -b && vite build (production build)
npm run preview    # serve the built output locally
npx tsc -b         # type-check only, without building
```

There is **no test runner and no ESLint/Prettier config**. Type-checking via
`tsc -b` (part of `npm run build`) is the only automated gate — run `npx tsc -b`
to validate types after changes. TypeScript `strict` is on, but `noUnusedLocals`
and `noUnusedParameters` are intentionally **off**.

## Tech stack

- **React 19** + **TypeScript 6** (strict)
- **Vite 8** (`vite.config.ts` sets port 3000 and `open: true`)
- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin — configured in CSS through
  an `@theme` block in `src/index.css`, **not** a `tailwind.config.js`.
- **Zustand 5** for state (`src/store/useEscalaStore.ts`)
- **@dnd-kit/core** + **@dnd-kit/utilities** for drag-and-drop
- **lucide-react** for icons

> Note: the `README.md` says "React 18" — that is stale. `package.json` is the
> source of truth (React 19.2.6, TS 6, Vite 8, Tailwind v4).

## Project structure

```
src/
  main.tsx                      # React entry, mounts <App>
  App.tsx                       # Single DndContext + handleDragEnd router + toast
  index.css                     # Tailwind import, @theme tokens, glass/animation classes
  types/index.ts                # All domain types
  data/                         # Mock data = source of truth
    funcionarios.ts             # mockFuncionarios (staff)
    salas.ts                    # mockSalas (rooms)
    escalas.ts                  # mockEscalas (seed allocations)
  store/useEscalaStore.ts       # Zustand store: state + all mutations + audit log
  utils/cargoHelper.ts          # Label/icon/color helpers per cargo & vínculo
  components/
    layout/Header.tsx           # Top bar: date/turno selectors + stats
    layout/Sidebar.tsx          # Left: available staff list + "desalocate" drop zone
    mapa/MapaUnidade.tsx        # Center: SVG floor-plan, coordMap, coverage alert
    mapa/SalaSVG.tsx            # One room: <g> droppable wrapping HTML via foreignObject
    mapa/BadgeFuncionario.tsx   # Draggable staff chip rendered inside a room
    painel/DetalheSala.tsx      # Right: room detail OR audit/quick-actions panel
    ui/FuncionarioCard.tsx      # Draggable staff card in the sidebar
```

## Architecture & data flow

- **Entry:** `main.tsx` → `App.tsx`. `App` owns the single `DndContext`
  (a `PointerSensor` with an 8px activation distance so buttons/inputs inside
  draggables still work) and the `handleDragEnd` router.
- **Layout:** three fixed columns — `Sidebar`, `MapaUnidade` (center, `flex-1`),
  `DetalheSala` — plus `Header` and a footer.
- **State lives in one Zustand store** (`useEscalaStore`): `dataSelecionada`,
  `turnoSelecionado`, `escalas[]`, `salaSelecionada`, and `historico[]`. **All
  mutations live in the store** and each appends a `HistoricoItem` to the audit log:
  - `moverFuncionario(funcionarioId, salaDeId, salaParaId)` — validates capacity,
    removes the staff's prior allocation for that day+turno, then re-allocates.
    Returns `{ success, error? }`.
  - `removerFuncionario(funcionarioId, salaId)` — desallocate.
  - `limparEscalaDia()` — clear all allocations for the current day+turno.
  - `copiarDiaAnterior()` — load the base seed allocations into the current day,
    **only if that turno is currently empty**.
- **Mock data is the source of truth.** The store and components import
  `mockFuncionarios`, `mockSalas`, `mockEscalas` directly. To change seed staff,
  rooms, or schedule, edit the files in `src/data/`.
- **Types** are centralized in `src/types/index.ts` (`Funcionario`, `Sala`,
  `Escala`, `HistoricoItem`, `CargoType`, `VinculoType`, `SalaTipo`).
- **Presentation helpers** in `src/utils/cargoHelper.ts` map a `cargo`/`vínculo` to
  its label, Lucide icon, and Tailwind color classes. **Reuse these — do not
  hardcode role labels or colors.** Adding a new `CargoType` requires updating every
  `Record<CargoType, ...>` map in this file (TS will flag the missing keys).

## Drag-and-drop contract

Getting this right is the core convention of the app.

- **Draggables** set `data: { funcionarioId, originalSalaId }`:
  - `FuncionarioCard` (sidebar) uses `originalSalaId: null`.
  - `BadgeFuncionario` (inside a room) passes that room's id as `originalSalaId`.
- **Droppable ids:**
  - Rooms: `droppable-<salaId>` (defined in `SalaSVG`).
  - Sidebar (acts as a "desalocate" target): `sidebar-droppable`.
- **`handleDragEnd` in `App.tsx`** routes the drop:
  - Drop on `sidebar-droppable` → `removerFuncionario` (only if it had an origin room).
  - Drop on a room → strip the `droppable-` prefix → `moverFuncionario`.
  - Drop on the same room → no-op.
  - A failed move surfaces `result.error` as a gold/red toast (auto-hides after 4s).

### Validation rules

- **Capacity** is a **hard block** enforced in `moverFuncionario` (cannot exceed
  `sala.capacidade`); the failure becomes a toast.
- **Role suitability ("adequação")** is a **soft warning** computed in
  `DetalheSala` by comparing allocated staff against `sala.cargosRecomendados`.
- **Coverage gaps** (rooms with zero staff, excluding `copa`) are counted in
  `MapaUnidade` and shown as a header alert.

## SVG floor-plan convention

`MapaUnidade` renders the unit as an SVG on a `1000×680` viewBox. It holds a
`coordMap` keyed by `sala.id` giving each room's `{ x, y, w, h }`. Each room is a
`SalaSVG` `<g>` whose `<rect>` is the dnd droppable and whose content is HTML drawn
through a `<foreignObject>`.

> **Adding a room requires BOTH** an entry in `src/data/salas.ts` **and** a matching
> entry in `MapaUnidade`'s `coordMap`. A room missing from `coordMap` is skipped and
> will not render.

## Styling conventions

- Theme tokens live in the `@theme` block of `src/index.css`: SJC palette
  (`--color-sjc-blue-*`, `--color-sjc-gold-*`, `--color-sjc-silver-*`) and per-cargo
  colors (`--color-cargo-*`). The visual identity is SJC's dark blue + metallic gold
  + silver, with glassmorphism.
- Reusable classes are also in `src/index.css`: `.glass-panel`, `.glass-card`,
  `.glow-gold`, plus keyframe animations `shake` (capacity-rejection feedback),
  `pulse-border` (empty rooms), and the SVG room helpers.
- Inline Tailwind utility classes dominate the components; many use literal hex
  colors (e.g. `#e5a93c` gold, `#0c1527` blue) alongside the theme tokens.

## Gotchas

- **No persistence** — every change is session-only; refresh resets to seed data.
- **Staff are assigned to a turno by `horario.inicio`:** `07:00` → manhã,
  `13:00` → tarde. The `gerente` (manager) is treated as working **all** turnos
  (special-cased in `Sidebar` and `Header`).
- **`copiarDiaAnterior` only fills an empty turno** — it no-ops if allocations exist.
- New allocation/history ids are generated with `Date.now()` + random suffixes.

## Working agreement

- This is documentation/MVP code — keep changes minimal and in the existing style.
- After any change, run `npx tsc -b` to confirm types still pass (the only gate).
- When asked to "run the app", use `npm run dev` (port 3000).
