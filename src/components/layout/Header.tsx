import React from 'react';
import { useEscalaStore } from '../../store/useEscalaStore';
import {
  ativoNoHorario,
  horaParaMinutos,
  minutosParaHora,
  HORARIO_MIN,
  HORARIO_MAX,
  HORARIO_PASSO,
} from '../../utils/horarioHelper';
import { Calendar, Clock, MapPin, Users, CheckCircle, Sunrise, Sun, Sunset, Settings, Map as MapIcon, CalendarRange, Presentation, Moon } from 'lucide-react';

interface HeaderProps {
  onGerenciar: () => void;
  onApresentar: () => void;
}

const PRESETS: { label: string; hora: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { label: 'Manhã', hora: '08:00', icon: Sunrise },
  { label: 'Meio-dia', hora: '12:00', icon: Sun },
  { label: 'Tarde', hora: '15:00', icon: Sun },
  { label: 'Fim', hora: '18:00', icon: Sunset },
];

export const Header: React.FC<HeaderProps> = ({ onGerenciar, onApresentar }) => {
  const {
    funcionarios,
    dataSelecionada,
    horarioReferencia,
    escalas,
    modoVisao,
    tema,
    setDataSelecionada,
    setHorarioReferencia,
    setModoVisao,
    alternarTema,
  } = useEscalaStore();

  // Quem está presente (e ativo) no horário de referência.
  const presentesNoHorario = funcionarios.filter(
    (f) => f.ativo && ativoNoHorario(f, horarioReferencia),
  );
  const alocadosNoHorario = escalas.filter((e) => {
    if (e.data !== dataSelecionada) return false;
    const f = funcionarios.find((func) => func.id === e.funcionarioId);
    return f ? f.ativo && ativoNoHorario(f, horarioReferencia) : false;
  });

  return (
    <header className="glass-panel border-b border-[rgba(229,169,60,0.15)] px-6 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 z-10 shrink-0">
      {/* Brand Identity */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-lg bg-[#0c2340] border border-[#e5a93c] flex items-center justify-center shrink-0 shadow-md">
          <span className="font-title font-bold text-lg text-[#e5a93c]">ES</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-title tracking-tight text-white flex items-center gap-2">
              Escala<span className="text-[#e5a93c]">Saúde</span>
            </h1>
            <span className="text-[10px] bg-[#e5a93c]/15 text-[#e5a93c] border border-[#e5a93c]/30 px-1.5 py-0.5 rounded font-mono font-medium">
              MVP FASE 2
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
            <MapPin size={12} className="text-[#e5a93c]" />
            <span>UBS Piloto • São José dos Campos</span>
          </div>
        </div>
      </div>

      {/* Date + Reference-time controls */}
      <div className="flex flex-wrap items-center gap-4 flex-1 lg:justify-center min-w-0">
        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-[var(--c-surface)] border border-slate-700/50 rounded-lg px-3 py-1.5 shadow-inner shrink-0">
          <Calendar size={15} className="text-[#e5a93c]" />
          <input
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
            className="bg-transparent border-none text-sm text-slate-200 focus:outline-none cursor-pointer font-medium"
          />
        </div>

        {/* Reference-time slider */}
        <div className="flex items-center gap-3 bg-[var(--c-surface)] border border-slate-700/50 rounded-lg px-3 py-1.5 shadow-inner min-w-[280px] flex-1 max-w-md">
          <Clock size={15} className="text-[#e5a93c] shrink-0" />
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center justify-between text-[10px] text-slate-400 leading-none mb-1">
              <span>Horário de referência</span>
              <span className="font-mono font-bold text-sm text-[#e5a93c] leading-none">
                {horarioReferencia}
              </span>
            </div>
            <input
              type="range"
              min={HORARIO_MIN}
              max={HORARIO_MAX}
              step={HORARIO_PASSO}
              value={horaParaMinutos(horarioReferencia)}
              onChange={(e) => setHorarioReferencia(minutosParaHora(Number(e.target.value)))}
              className="w-full h-1.5 accent-[#e5a93c] cursor-pointer"
              aria-label="Horário de referência"
            />
          </div>
          {/* Quick presets */}
          <div className="hidden xl:flex items-center gap-1 shrink-0">
            {PRESETS.map((p) => {
              const Icon = p.icon;
              const active = horarioReferencia === p.hora;
              return (
                <button
                  key={p.label}
                  onClick={() => setHorarioReferencia(p.hora)}
                  title={`${p.label} (${p.hora})`}
                  className={`p-1.5 rounded border transition-all ${
                    active
                      ? 'bg-[#e5a93c] text-[#061026] border-[#e5a93c]'
                      : 'bg-[var(--c-surface)]/50 text-slate-400 border-slate-800/80 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <Icon size={13} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick KPIs + Manage */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2 bg-[var(--c-surface)]/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <Users size={14} className="text-blue-400" />
          <div className="text-[11px] leading-tight">
            <div className="text-slate-400">Presentes agora</div>
            <div className="font-bold text-white text-xs">{presentesNoHorario.length} profissionais</div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[var(--c-surface)]/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <CheckCircle size={14} className="text-emerald-400" />
          <div className="text-[11px] leading-tight">
            <div className="text-slate-400">Alocados</div>
            <div className="font-bold text-white text-xs">
              <span className="text-[#e5a93c]">{alocadosNoHorario.length}</span> / {presentesNoHorario.length}
            </div>
          </div>
        </div>

        {/* View toggle: Mapa | Semana */}
        <div className="flex bg-[var(--c-surface)] border border-slate-700/50 rounded-lg p-0.5 shadow-inner">
          {([
            { modo: 'mapa', label: 'Mapa', Icon: MapIcon },
            { modo: 'semana', label: 'Semana', Icon: CalendarRange },
          ] as const).map(({ modo, label, Icon }) => (
            <button
              key={modo}
              onClick={() => setModoVisao(modo)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                modoVisao === modo
                  ? 'bg-[#e5a93c] text-[#061026] font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon size={14} />
              <span className="hidden md:inline">{label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={alternarTema}
          className="flex items-center justify-center bg-[var(--c-surface)] hover:bg-[#13315c] border border-slate-700/60 hover:border-[#e5a93c]/60 text-[#e5a93c] p-2 rounded-lg transition-all shadow-md"
          title={tema === 'claro' ? 'Mudar para tema escuro' : 'Mudar para tema claro'}
        >
          {tema === 'claro' ? <Moon size={15} /> : <Sun size={15} />}
        </button>

        <button
          onClick={onApresentar}
          className="flex items-center gap-2 bg-[var(--c-surface)] hover:bg-[#13315c] border border-slate-700/60 hover:border-[#e5a93c]/60 text-slate-200 px-3 py-2 rounded-lg transition-all shadow-md"
          title="Modo apresentação / impressão"
        >
          <Presentation size={15} className="text-[#e5a93c]" />
          <span className="text-xs font-bold hidden sm:inline">Apresentar</span>
        </button>

        <button
          onClick={onGerenciar}
          className="flex items-center gap-2 bg-[#0c2340] hover:bg-[#13315c] border border-[#e5a93c]/40 hover:border-[#e5a93c] text-[#e5a93c] px-3 py-2 rounded-lg transition-all shadow-md"
          title="Gerenciar profissionais e setores"
        >
          <Settings size={15} />
          <span className="text-xs font-bold hidden sm:inline">Gerenciar</span>
        </button>
      </div>
    </header>
  );
};
