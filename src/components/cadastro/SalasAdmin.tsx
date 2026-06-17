import React, { useState } from 'react';
import { useEscalaStore } from '../../store/useEscalaStore';
import { Sala, SalaTipo, CargoType } from '../../types';
import { getCargoLabel, CARGOS_DISPONIVEIS } from '../../utils/cargoHelper';
import { ChipMultiSelect } from './ChipMultiSelect';
import { Plus, Trash2, Save, X, DoorOpen, AlertTriangle } from 'lucide-react';

const TIPO_OPTIONS: { value: SalaTipo; label: string }[] = [
  { value: 'consultorio', label: 'Consultório' },
  { value: 'procedimento', label: 'Procedimento' },
  { value: 'apoio', label: 'Apoio' },
  { value: 'administrativo', label: 'Administrativo' },
  { value: 'recepcao', label: 'Recepção' },
];

const tipoLabel = (t: SalaTipo) => TIPO_OPTIONS.find((o) => o.value === t)?.label ?? t;

const novaSala = (): Sala => {
  const id = `sala-${Date.now()}`;
  return {
    id,
    nome: '',
    tipo: 'consultorio',
    svgId: `room_${id}`,
    capacidade: 1,
    cargosRecomendados: [],
    pos: { x: 30, y: 30, w: 150, h: 140 },
  };
};

const num = (v: string): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const SalasAdmin: React.FC = () => {
  const { salas, salvarSala, excluirSala } = useEscalaStore();
  const [form, setForm] = useState<Sala | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const upd = (patch: Partial<Sala>) => setForm((s) => (s ? { ...s, ...patch } : s));
  const updPos = (patch: Partial<NonNullable<Sala['pos']>>) =>
    setForm((s) => (s ? { ...s, pos: { ...(s.pos ?? { x: 30, y: 30, w: 150, h: 140 }), ...patch } } : s));

  const editar = (s: Sala) => {
    setForm({ ...s, cargosRecomendados: [...(s.cargosRecomendados ?? [])], pos: s.pos ? { ...s.pos } : undefined });
    setErro(null);
  };

  const excluir = (s: Sala) => {
    if (!window.confirm(`Remover o setor "${s.nome}"? As alocações nele também serão removidas.`)) return;
    excluirSala(s.id);
    if (form?.id === s.id) setForm(null);
  };

  const salvar = () => {
    if (!form) return;
    if (!form.nome.trim()) {
      setErro('O nome do setor é obrigatório.');
      return;
    }
    if (form.capacidade < 0) {
      setErro('A capacidade não pode ser negativa.');
      return;
    }
    salvarSala({
      ...form,
      nome: form.nome.trim(),
      svgId: form.svgId || `room_${form.id}`,
    });
    setForm(null);
    setErro(null);
  };

  const cargoOptions = CARGOS_DISPONIVEIS.map((c) => ({ value: c, label: getCargoLabel(c) }));

  return (
    <div className="flex h-full min-h-0">
      {/* Lista */}
      <div className="w-1/2 flex flex-col min-h-0 border-r border-slate-800">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 shrink-0">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            {salas.length} setores
          </span>
          <button
            onClick={() => {
              setForm(novaSala());
              setErro(null);
            }}
            className="flex items-center gap-1.5 bg-[#e5a93c] text-[#061026] text-xs font-bold px-3 py-1.5 rounded-lg hover:brightness-110 transition"
          >
            <Plus size={14} /> Nova
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 min-h-0">
          {salas.map((s) => {
            const ativo = form?.id === s.id;
            return (
              <div
                key={s.id}
                className={`group flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                  ativo ? 'bg-[#e5a93c]/10 border-[#e5a93c]/50' : 'bg-[var(--c-surface)]/60 border-slate-800 hover:border-slate-700'
                }`}
                onClick={() => editar(s)}
              >
                <DoorOpen size={15} className="text-[#e5a93c] shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-100 truncate flex items-center gap-1.5">
                    {s.nome || '(sem nome)'}
                    {!s.pos && (
                      <span title="Sem posição na planta — não aparece no mapa">
                        <AlertTriangle size={11} className="text-amber-400" />
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {tipoLabel(s.tipo)} • cap. {s.capacidade}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    excluir(s);
                  }}
                  className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10 shrink-0 opacity-0 group-hover:opacity-100 transition"
                  title="Remover"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formulário */}
      <div className="w-1/2 flex flex-col min-h-0">
        {!form ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
            <DoorOpen size={36} className="text-slate-700" />
            <p className="text-xs mt-3 max-w-[220px]">
              Selecione um setor para editar ou clique em <strong className="text-[#e5a93c]">Nova</strong> para criar.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0">
              <Campo label="Nome do setor">
                <input
                  value={form.nome}
                  onChange={(e) => upd({ nome: e.target.value })}
                  placeholder="Ex.: Consultório 9 (Med)"
                  className="input-cad"
                />
              </Campo>

              <div className="grid grid-cols-2 gap-3">
                <Campo label="Tipo">
                  <select
                    value={form.tipo}
                    onChange={(e) => upd({ tipo: e.target.value as SalaTipo })}
                    className="input-cad"
                  >
                    {TIPO_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Capacidade (no mesmo horário)">
                  <input
                    type="number"
                    min={0}
                    value={form.capacidade}
                    onChange={(e) => upd({ capacidade: num(e.target.value) })}
                    className="input-cad"
                  />
                </Campo>
              </div>

              <Campo label="Funções recomendadas">
                <ChipMultiSelect
                  options={cargoOptions}
                  selected={form.cargosRecomendados ?? []}
                  onChange={(cargosRecomendados) => upd({ cargosRecomendados: cargosRecomendados as CargoType[] })}
                />
              </Campo>

              <Campo label="Posição na planta (viewBox 1000 × 680)">
                <div className="grid grid-cols-4 gap-2">
                  {(['x', 'y', 'w', 'h'] as const).map((k) => (
                    <div key={k} className="flex flex-col gap-1">
                      <span className="text-[9px] text-slate-500 uppercase text-center">{k}</span>
                      <input
                        type="number"
                        value={form.pos?.[k] ?? 0}
                        onChange={(e) => updPos({ [k]: num(e.target.value) })}
                        className="input-cad text-center font-mono"
                      />
                    </div>
                  ))}
                </div>
              </Campo>

              {erro && <p className="text-[11px] text-red-400 font-medium">{erro}</p>}
            </div>

            <div className="flex items-center gap-2 p-3 border-t border-slate-800 shrink-0">
              <button
                onClick={salvar}
                className="flex-1 flex items-center justify-center gap-2 bg-[#e5a93c] text-[#061026] text-xs font-bold py-2 rounded-lg hover:brightness-110 transition"
              >
                <Save size={14} /> Salvar
              </button>
              <button
                onClick={() => {
                  setForm(null);
                  setErro(null);
                }}
                className="flex items-center justify-center gap-2 bg-slate-800 text-slate-300 text-xs font-bold py-2 px-4 rounded-lg hover:bg-slate-700 transition"
              >
                <X size={14} /> Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Campo: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="flex flex-col gap-1">
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
    {children}
  </label>
);
