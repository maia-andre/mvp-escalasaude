import React from 'react';
import { useEscalaStore } from '../../store/useEscalaStore';
import { mockFuncionarios } from '../../data/funcionarios';
import { Calendar, Sun, Moon, MapPin, Users, CheckCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    dataSelecionada, 
    turnoSelecionado, 
    escalas,
    setDataSelecionada, 
    setTurnoSelecionado 
  } = useEscalaStore();

  // Calculate statistics for the selected day/turn
  const totalFuncionarios = mockFuncionarios.length;
  
  const funcionariosDoTurno = mockFuncionarios.filter(
    f => f.horario.inicio === (turnoSelecionado === 'manha' ? '07:00' : '13:00') || f.cargo === 'gerente'
  );
  
  const totalAlocados = escalas.filter(
    e => e.data === dataSelecionada && e.turno === turnoSelecionado
  ).length;

  const totalDisponiveis = funcionariosDoTurno.length;

  return (
    <header className="glass-panel border-b border-[rgba(229,169,60,0.15)] px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 z-10 shrink-0">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#0c2340] border border-[#e5a93c] flex items-center justify-center shrink-0 shadow-md">
          <span className="font-title font-bold text-lg text-[#e5a93c]">ES</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-title tracking-tight text-white flex items-center gap-2">
              Escala<span className="text-[#e5a93c]">Saúde</span>
            </h1>
            <span className="text-[10px] bg-[#e5a93c]/15 text-[#e5a93c] border border-[#e5a93c]/30 px-1.5 py-0.5 rounded font-mono font-medium">
              MVP FASE 1
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
            <MapPin size={12} className="text-[#e5a93c]" />
            <span>UBS Piloto • São José dos Campos</span>
          </div>
        </div>
      </div>

      {/* Date & Shift Controls */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-[#0c1527] border border-slate-700/50 rounded-lg px-3 py-1.5 shadow-inner">
          <Calendar size={15} className="text-[#e5a93c]" />
          <input
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
            className="bg-transparent border-none text-sm text-slate-200 focus:outline-none cursor-pointer font-medium"
          />
        </div>

        {/* Turn Selector */}
        <div className="flex bg-[#0c1527] border border-slate-700/50 rounded-lg p-0.5 shadow-inner">
          <button
            onClick={() => setTurnoSelecionado('manha')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
              turnoSelecionado === 'manha'
                ? 'bg-[#e5a93c] text-[#061026] shadow-sm font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sun size={14} />
            <span>MANHÃ (07h-13h)</span>
          </button>
          <button
            onClick={() => setTurnoSelecionado('tarde')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
              turnoSelecionado === 'tarde'
                ? 'bg-[#e5a93c] text-[#061026] shadow-sm font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Moon size={14} />
            <span>TARDE (13h-19h)</span>
          </button>
        </div>
      </div>

      {/* Quick KPIs */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[#0c1527]/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <Users size={14} className="text-blue-400" />
          <div className="text-[11px] leading-tight">
            <div className="text-slate-400">Total do Turno</div>
            <div className="font-bold text-white text-xs">{totalDisponiveis} profissionais</div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#0c1527]/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <CheckCircle size={14} className="text-emerald-400" />
          <div className="text-[11px] leading-tight">
            <div className="text-slate-400">Alocados</div>
            <div className="font-bold text-white text-xs">
              <span className="text-[#e5a93c]">{totalAlocados}</span> / {totalDisponiveis}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
