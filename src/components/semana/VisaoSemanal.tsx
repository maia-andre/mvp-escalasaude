import React from 'react';
import { useEscalaStore } from '../../store/useEscalaStore';
import { diasDaSemana, somarDias, rotuloDia, rotuloSemana } from '../../utils/dataHelper';
import { CalendarRange, ChevronLeft, ChevronRight, Map as MapIcon, ShieldAlert } from 'lucide-react';

export const VisaoSemanal: React.FC = () => {
  const { salas, escalas, dataSelecionada, setDataSelecionada, setModoVisao } = useEscalaStore();

  const dias = diasDaSemana(dataSelecionada);

  // Setores que precisam de cobertura (copa não conta).
  const salasOperacionais = salas.filter((s) => s.capacidade > 0 && s.id !== 'copa');

  const ocupacao = (salaId: string, dia: string) =>
    escalas.filter((e) => e.data === dia && e.salaId === salaId).length;

  const alocadosNoDia = (dia: string) =>
    new Set(escalas.filter((e) => e.data === dia).map((e) => e.funcionarioId)).size;

  const semCoberturaNoDia = (dia: string) =>
    salasOperacionais.filter((s) => ocupacao(s.id, dia) === 0).length;

  const abrirDia = (dia: string) => {
    setDataSelecionada(dia);
    setModoVisao('mapa');
  };

  const colTemplate = { gridTemplateColumns: '200px repeat(7, minmax(72px, 1fr))' };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--c-bg)] select-none">
      {/* Toolbar */}
      <div className="px-6 py-3 border-b border-slate-800/80 bg-[var(--c-surface)]/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 text-slate-200">
          <CalendarRange size={16} className="text-[#e5a93c]" />
          <span className="text-sm font-bold font-title">Visão Semanal</span>
          <span className="text-xs text-slate-400">• {rotuloSemana(dataSelecionada)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDataSelecionada(somarDias(dataSelecionada, -7))}
            className="flex items-center gap-1 text-xs text-slate-300 bg-[var(--c-surface)] border border-slate-700/60 rounded-lg px-2.5 py-1.5 hover:border-[#e5a93c]/40 transition"
          >
            <ChevronLeft size={14} /> Semana anterior
          </button>
          <button
            onClick={() => setDataSelecionada(somarDias(dataSelecionada, 7))}
            className="flex items-center gap-1 text-xs text-slate-300 bg-[var(--c-surface)] border border-slate-700/60 rounded-lg px-2.5 py-1.5 hover:border-[#e5a93c]/40 transition"
          >
            Próxima semana <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Tabela: rolagem horizontal envolve tudo; o cabeçalho de dias + resumos
          fica fixo e apenas a lista de setores rola verticalmente. */}
      <div className="flex-1 overflow-x-auto min-h-0 flex flex-col">
        <div className="min-w-[760px] flex flex-col flex-1 min-h-0 px-4">
          {/* Cabeçalho fixo */}
          <div className="shrink-0 pt-4 bg-[var(--c-bg)]">
            {/* Linha de dias */}
            <div className="grid gap-1" style={colTemplate}>
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Setor
              </div>
              {dias.map((dia) => {
                const r = rotuloDia(dia);
                const selecionado = dia === dataSelecionada;
                return (
                  <button
                    key={dia}
                    onClick={() => abrirDia(dia)}
                    title="Abrir este dia no mapa"
                    className={`px-2 py-2 rounded-t-lg text-center transition group ${
                      selecionado
                        ? 'bg-[#e5a93c]/15 border-x border-t border-[#e5a93c]/40'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className={`text-[10px] font-bold uppercase ${r.fimDeSemana ? 'text-slate-500' : 'text-slate-300'} ${selecionado ? 'text-[#e5a93c]' : ''}`}>
                      {r.sigla}
                    </div>
                    <div className={`text-sm font-mono font-bold ${selecionado ? 'text-[#e5a93c]' : 'text-white'}`}>
                      {String(r.dia).padStart(2, '0')}
                    </div>
                    <div className="text-[9px] text-slate-500">{r.mes}</div>
                  </button>
                );
              })}
            </div>

            {/* Linhas-resumo */}
            <div className="grid gap-1 mt-1" style={colTemplate}>
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 flex items-center">Alocados</div>
              {dias.map((dia) => (
                <div key={dia} className={`py-1.5 text-center text-xs font-bold rounded ${dia === dataSelecionada ? 'bg-[#e5a93c]/10' : ''}`}>
                  <span className="text-emerald-400">{alocadosNoDia(dia)}</span>
                </div>
              ))}
            </div>
            <div className="grid gap-1 mt-0.5 mb-2" style={colTemplate}>
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 flex items-center gap-1">
                <ShieldAlert size={11} className="text-amber-400" /> Sem cobertura
              </div>
              {dias.map((dia) => {
                const gaps = semCoberturaNoDia(dia);
                return (
                  <div key={dia} className={`py-1.5 text-center text-xs font-bold rounded ${dia === dataSelecionada ? 'bg-[#e5a93c]/10' : ''}`}>
                    <span className={gaps > 0 ? 'text-amber-400' : 'text-slate-600'}>{gaps}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Corpo rolável: linhas de setores */}
          <div className="flex-1 overflow-y-auto min-h-0 pb-4 flex flex-col gap-1">
            {salasOperacionais.map((sala) => (
              <div key={sala.id} className="grid gap-1 items-stretch" style={colTemplate}>
                <div className="px-3 py-2 text-[11px] font-medium text-slate-300 bg-[var(--c-surface)]/40 rounded-l-lg border-l-2 border-slate-800 truncate flex items-center">
                  {sala.nome}
                </div>
                {dias.map((dia) => {
                  const n = ocupacao(sala.id, dia);
                  const cheio = n >= sala.capacidade;
                  const vazio = n === 0;
                  const selecionado = dia === dataSelecionada;
                  return (
                    <button
                      key={dia}
                      onClick={() => abrirDia(dia)}
                      title={`${sala.nome} • ${dia}: ${n}/${sala.capacidade}`}
                      className={`flex items-center justify-center text-xs font-bold font-mono border rounded transition ${
                        selecionado ? 'ring-1 ring-[#e5a93c]/40' : ''
                      } ${
                        vazio
                          ? 'bg-amber-950/15 border-amber-900/30 text-amber-500/70'
                          : cheio
                            ? 'bg-emerald-950/25 border-emerald-800/40 text-emerald-300'
                            : 'bg-[var(--c-surface)]/60 border-slate-800 text-slate-200'
                      } hover:brightness-125`}
                    >
                      {vazio ? '—' : `${n}/${sala.capacidade}`}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="px-6 py-2 border-t border-slate-800/60 text-[10px] text-slate-500 flex items-center gap-2 shrink-0">
        <MapIcon size={11} className="text-[#e5a93c]" />
        Clique em qualquer dia ou célula para abrir aquele dia na planta interativa.
      </div>
    </div>
  );
};
