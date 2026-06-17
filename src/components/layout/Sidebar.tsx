import React, { useState } from 'react';
import { useEscalaStore } from '../../store/useEscalaStore';
import { FuncionarioCard } from '../ui/FuncionarioCard';
import { useDroppable } from '@dnd-kit/core';
import { CargoType } from '../../types';
import { ativoNoHorario } from '../../utils/horarioHelper';
import { Search, HelpCircle, Trash2 } from 'lucide-react';

const CARGOS: { value: CargoType | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'medico', label: 'Médico' },
  { value: 'enfermeiro', label: 'Enfermeiro' },
  { value: 'tec_enfermagem', label: 'Téc. Enfermagem' },
  { value: 'farmaceutico', label: 'Farmácia' },
  { value: 'dentista', label: 'Dentista' },
  { value: 'recepcionista', label: 'Recepção' },
  { value: 'administrativo', label: 'Adm' },
  { value: 'gerente', label: 'Gerente' },
];

export const Sidebar: React.FC = () => {
  const { funcionarios, dataSelecionada, horarioReferencia, escalas } = useEscalaStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCargo, setSelectedCargo] = useState<CargoType | 'todos'>('todos');

  // Soltar um card aqui desaloca o profissional.
  const { setNodeRef, isOver } = useDroppable({ id: 'sidebar-droppable' });

  // Profissionais ativos e presentes no horário de referência.
  const presentes = funcionarios.filter((f) => f.ativo && ativoNoHorario(f, horarioReferencia));

  // Já alocados no dia (1 alocação por pessoa/dia).
  const alocadosIds = escalas
    .filter((e) => e.data === dataSelecionada)
    .map((e) => e.funcionarioId);

  const disponiveis = presentes.filter((f) => !alocadosIds.includes(f.id));

  const filtrados = disponiveis.filter((f) => {
    const matchesSearch =
      f.nome.toLowerCase().includes(searchQuery.toLowerCase()) || f.matricula.includes(searchQuery);
    const matchesCargo = selectedCargo === 'todos' || f.cargo === selectedCargo;
    return matchesSearch && matchesCargo;
  });

  return (
    <aside
      ref={setNodeRef}
      className={`w-80 flex flex-col glass-panel border-r border-[rgba(229,169,60,0.15)] h-full shrink-0 select-none overflow-hidden transition-colors duration-200 ${
        isOver ? 'bg-[var(--c-surface-2)]/90 border-dashed border-[#e5a93c]' : ''
      }`}
    >
      {/* Title / Section Header */}
      <div className="p-4 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold font-title tracking-wider text-slate-200 uppercase">
            Profissionais Disponíveis
          </h2>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Presentes às {horarioReferencia} • {disponiveis.length} livres
          </p>
        </div>

        <span className="bg-[var(--c-surface)] border border-[#e5a93c]/30 text-[#e5a93c] text-xs font-mono px-2 py-0.5 rounded-full font-bold shadow-inner">
          {disponiveis.length} / {presentes.length}
        </span>
      </div>

      {/* Search Input */}
      <div className="px-4 pt-3 pb-2 shrink-0">
        <div className="relative flex items-center bg-[var(--c-surface)] border border-slate-800 rounded-lg focus-within:border-[#e5a93c]/50 transition-colors">
          <Search size={14} className="text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nome ou mat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-xs text-slate-200 pl-9 pr-3 py-2 focus:outline-none placeholder-slate-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-4 pb-3 flex gap-1.5 overflow-x-auto shrink-0 border-b border-slate-800/50 select-none">
        {CARGOS.map((cargo) => (
          <button
            key={cargo.value}
            onClick={() => setSelectedCargo(cargo.value)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all border ${
              selectedCargo === cargo.value
                ? 'bg-[#e5a93c] text-[#061026] border-[#e5a93c] font-bold'
                : 'bg-[var(--c-surface)]/50 text-slate-400 border-slate-800/80 hover:text-white hover:border-slate-700'
            }`}
          >
            {cargo.label}
          </button>
        ))}
      </div>

      {/* Drop Zone Indicator / Employee List */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 min-h-0">
        {isOver ? (
          <div className="flex-1 border-2 border-dashed border-[#e5a93c]/40 rounded-xl flex flex-col items-center justify-center p-6 text-center bg-[#e5a93c]/5">
            <Trash2 size={32} className="text-[#e5a93c] animate-bounce" />
            <h3 className="text-xs font-bold text-white mt-2">Solte para Desalocar</h3>
            <p className="text-[10px] text-slate-400 mt-1 max-w-[180px]">
              O profissional será retirado da escala e retornará à lista de disponíveis.
            </p>
          </div>
        ) : filtrados.length > 0 ? (
          filtrados.map((func) => <FuncionarioCard key={func.id} funcionario={func} />)
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl">
            <HelpCircle size={24} className="text-slate-600" />
            <h3 className="text-xs font-bold text-slate-400 mt-2">Nenhum profissional</h3>
            <p className="text-[10px] text-slate-500 mt-1 max-w-[180px]">
              {searchQuery || selectedCargo !== 'todos'
                ? 'Nenhum resultado corresponde aos filtros aplicados.'
                : `Todos os profissionais presentes às ${horarioReferencia} já foram alocados.`}
            </p>
          </div>
        )}
      </div>

      {/* Guide Info */}
      <div className="p-3 bg-[var(--c-surface)]/40 border-t border-slate-800/50 text-[10px] text-slate-400 flex items-center gap-2 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-[#e5a93c] shrink-0 animate-ping"></span>
        <span>Arraste o profissional para uma sala para alocá-lo.</span>
      </div>
    </aside>
  );
};
