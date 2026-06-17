import React, { useState } from 'react';
import { useEscalaStore } from '../../store/useEscalaStore';
import { Funcionario, CargoType, VinculoType } from '../../types';
import {
  getCargoLabel,
  getCargoIcon,
  getCargoColorClass,
  getVinculoLabel,
  CARGOS_DISPONIVEIS,
  VINCULOS_DISPONIVEIS,
} from '../../utils/cargoHelper';
import { horaParaMinutos } from '../../utils/horarioHelper';
import { ChipMultiSelect } from './ChipMultiSelect';
import { Plus, Trash2, Save, X, UserPlus, Scissors, Combine, AlertTriangle } from 'lucide-react';

const novoFuncionario = (): Funcionario => ({
  id: `f-${Date.now()}`,
  nome: '',
  matricula: '',
  vinculo: 'efetivo',
  cargo: 'medico',
  funcoes: ['medico'],
  setoresPermitidos: [],
  horario: { inicio: '07:00', fim: '13:00' },
  ativo: true,
});

export const ProfissionaisAdmin: React.FC = () => {
  const {
    funcionarios,
    salas,
    salvarFuncionario,
    excluirFuncionario,
    dividirCargaFuncionario,
    juntarCargaFuncionario,
  } = useEscalaStore();
  const [form, setForm] = useState<Funcionario | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const upd = (patch: Partial<Funcionario>) => setForm((f) => (f ? { ...f, ...patch } : f));

  const editar = (f: Funcionario) => {
    setForm({ ...f, horario: { ...f.horario }, funcoes: [...f.funcoes], setoresPermitidos: [...f.setoresPermitidos] });
    setErro(null);
  };

  const excluir = (f: Funcionario) => {
    if (!window.confirm(`Remover o profissional "${f.nome}"? As alocações dele também serão removidas.`)) return;
    excluirFuncionario(f.id);
    if (form?.id === f.id) setForm(null);
  };

  const salvar = () => {
    if (!form) return;
    if (!form.nome.trim() || !form.matricula.trim()) {
      setErro('Nome e matrícula são obrigatórios.');
      return;
    }
    if (horaParaMinutos(form.horario.inicio) >= horaParaMinutos(form.horario.fim)) {
      setErro('O horário inicial deve ser anterior ao final.');
      return;
    }
    salvarFuncionario({
      ...form,
      nome: form.nome.trim(),
      matricula: form.matricula.trim(),
      funcoes: Array.from(new Set([form.cargo, ...form.funcoes])),
    });
    setForm(null);
    setErro(null);
  };

  const salaOptions = salas.map((s) => ({ value: s.id, label: s.nome }));
  const cargoOptions = CARGOS_DISPONIVEIS.map((c) => ({ value: c, label: getCargoLabel(c) }));

  return (
    <div className="flex h-full min-h-0">
      {/* Lista */}
      <div className="w-1/2 flex flex-col min-h-0 border-r border-slate-800">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 shrink-0">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            {funcionarios.length} profissionais
          </span>
          <button
            onClick={() => {
              setForm(novoFuncionario());
              setErro(null);
            }}
            className="flex items-center gap-1.5 bg-[#e5a93c] text-[#061026] text-xs font-bold px-3 py-1.5 rounded-lg hover:brightness-110 transition"
          >
            <Plus size={14} /> Novo
          </button>
        </div>

        {aviso && (
          <div className="mx-3 mt-2 px-3 py-2 rounded-lg bg-[var(--c-surface-2)] border border-amber-500/40 text-slate-200 text-[10px] flex items-start justify-between gap-2 shrink-0">
            <span className="flex items-center gap-1.5">
              <AlertTriangle size={12} className="text-amber-400 shrink-0" />
              {aviso}
            </span>
            <button onClick={() => setAviso(null)} className="shrink-0 text-slate-500 hover:text-slate-300">
              <X size={12} />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 min-h-0">
          {funcionarios.map((f) => {
            const Icon = getCargoIcon(f.cargo);
            const ativo = form?.id === f.id;
            return (
              <div
                key={f.id}
                className={`group flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                  ativo
                    ? 'bg-[#e5a93c]/10 border-[#e5a93c]/50'
                    : 'bg-[var(--c-surface)]/60 border-slate-800 hover:border-slate-700'
                }`}
                onClick={() => editar(f)}
              >
                <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${f.ativo ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-100 truncate flex items-center gap-1.5">
                    <span className="truncate">{f.nome || '(sem nome)'}</span>
                    {f.metade && (
                      <span className="shrink-0 text-[8px] font-bold px-1 py-0.5 rounded border border-[#e5a93c]/40 text-[#e5a93c] bg-[#e5a93c]/10">
                        {f.metade === 'manha' ? 'MANHÃ' : 'TARDE'}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Mat. {f.matricula || '—'} • {f.horario.inicio}–{f.horario.fim}
                  </div>
                </div>
                <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded border cargo-badge text-[9px] shrink-0 ${getCargoColorClass(f.cargo)}`}>
                  <Icon size={9} /> {getCargoLabel(f.cargo)}
                </span>
                {f.metade ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      juntarCargaFuncionario(f.id);
                    }}
                    className="text-slate-500 hover:text-[#e5a93c] p-1 rounded hover:bg-[#e5a93c]/10 shrink-0 transition"
                    title="Juntar a carga horária (desfazer divisão)"
                  >
                    <Combine size={13} />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const r = dividirCargaFuncionario(f.id);
                      if (!r.success && r.error) setAviso(r.error);
                      else setAviso(null);
                    }}
                    className="text-slate-500 hover:text-[#e5a93c] p-1 rounded hover:bg-[#e5a93c]/10 shrink-0 transition"
                    title="Dividir carga horária (manhã/tarde)"
                  >
                    <Scissors size={13} />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    excluir(f);
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
            <UserPlus size={36} className="text-slate-700" />
            <p className="text-xs mt-3 max-w-[220px]">
              Selecione um profissional para editar ou clique em <strong className="text-[#e5a93c]">Novo</strong> para
              cadastrar.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0">
              <Campo label="Nome completo">
                <input
                  value={form.nome}
                  onChange={(e) => upd({ nome: e.target.value })}
                  placeholder="Ex.: Dra. Amanda Silva Santos"
                  className="input-cad"
                />
              </Campo>

              <div className="grid grid-cols-2 gap-3">
                <Campo label="Matrícula">
                  <input
                    value={form.matricula}
                    onChange={(e) => upd({ matricula: e.target.value })}
                    placeholder="000000"
                    className="input-cad font-mono"
                  />
                </Campo>
                <Campo label="Vínculo">
                  <select
                    value={form.vinculo}
                    onChange={(e) => upd({ vinculo: e.target.value as VinculoType })}
                    className="input-cad"
                  >
                    {VINCULOS_DISPONIVEIS.map((v) => (
                      <option key={v} value={v}>
                        {getVinculoLabel(v)}
                      </option>
                    ))}
                  </select>
                </Campo>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Campo label="Função principal">
                  <select
                    value={form.cargo}
                    onChange={(e) => {
                      const cargo = e.target.value as CargoType;
                      upd({ cargo, funcoes: Array.from(new Set([cargo, ...form.funcoes])) });
                    }}
                    className="input-cad"
                  >
                    {cargoOptions.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Situação">
                  <button
                    type="button"
                    onClick={() => upd({ ativo: !form.ativo })}
                    className={`input-cad flex items-center justify-between ${form.ativo ? 'text-emerald-300' : 'text-slate-400'}`}
                  >
                    {form.ativo ? 'Ativo' : 'Inativo'}
                    <span className={`w-2 h-2 rounded-full ${form.ativo ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  </button>
                </Campo>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Campo label="Entrada">
                  <input
                    type="time"
                    value={form.horario.inicio}
                    onChange={(e) => upd({ horario: { ...form.horario, inicio: e.target.value } })}
                    className="input-cad"
                  />
                </Campo>
                <Campo label="Saída">
                  <input
                    type="time"
                    value={form.horario.fim}
                    onChange={(e) => upd({ horario: { ...form.horario, fim: e.target.value } })}
                    className="input-cad"
                  />
                </Campo>
              </div>

              <Campo label="Funções habilitadas (o que pode fazer)">
                <ChipMultiSelect
                  options={cargoOptions}
                  selected={form.funcoes}
                  onChange={(funcoes) => upd({ funcoes: funcoes as CargoType[] })}
                />
              </Campo>

              <Campo label="Setores permitidos (onde pode atuar — vazio = sem restrição)">
                <ChipMultiSelect
                  options={salaOptions}
                  selected={form.setoresPermitidos}
                  onChange={(setoresPermitidos) => upd({ setoresPermitidos })}
                  emptyHint="Nenhum setor cadastrado."
                />
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
