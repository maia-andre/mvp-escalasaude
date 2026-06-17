import React from 'react';
import { useEscalaStore } from '../../store/useEscalaStore';
import { getCargoLabel, getCargoIcon, getCargoColorClass, getVinculoLabel, getVinculoBadgeClass } from '../../utils/cargoHelper';
import { ativoNoHorario } from '../../utils/horarioHelper';
import { getAvisosAlocacao } from '../../utils/regrasHelper';
import { 
  Building2, 
  Users, 
  AlertTriangle, 
  Trash2, 
  History, 
  Calendar,
  Layers,
  ArrowRight,
  ClipboardList,
  CopyPlus
} from 'lucide-react';

interface DetalheSalaProps {
  onReplicar: () => void;
}

export const DetalheSala: React.FC<DetalheSalaProps> = ({ onReplicar }) => {
  const {
    salas,
    funcionarios,
    salaSelecionada,
    dataSelecionada,
    horarioReferencia,
    escalas,
    historico,
    removerFuncionario,
    limparDia,
    carregarBase,
  } = useEscalaStore();

  const sala = salas.find((s) => s.id === salaSelecionada);

  // Profissionais presentes nesta sala no horário de referência.
  const staffNaSala = escalas
    .filter((e) => e.data === dataSelecionada && e.salaId === salaSelecionada)
    .map((a) => funcionarios.find((f) => f.id === a.funcionarioId))
    .filter((f): f is NonNullable<typeof f> => !!f && ativoNoHorario(f, horarioReferencia));

  // Avisos de adequação (função + setor) dos profissionais alocados nesta sala.
  const warnings = sala
    ? staffNaSala.flatMap((staff) => getAvisosAlocacao(staff, sala).map((a) => a.mensagem))
    : [];

  return (
    <section className="w-80 flex flex-col glass-panel border-l border-[rgba(229,169,60,0.15)] h-full shrink-0 select-none overflow-hidden">
      {sala ? (
        // Mode 1: Room Details Selected
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-[var(--c-surface-2)]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-[#e5a93c]" />
              <h2 className="text-sm font-bold font-title text-white uppercase tracking-wider">
                Detalhes do Setor
              </h2>
            </div>
            <span className="text-[9px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded font-mono uppercase">
              {sala.tipo}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-0">
            {/* Room Info Card */}
            <div className="bg-[var(--c-surface)] border border-slate-800/80 p-3 rounded-lg flex flex-col gap-2">
              <h3 className="text-base font-bold text-white font-title">{sala.nome}</h3>
              
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Users size={12} className="text-[#e5a93c]" />
                  Capacidade Máxima:
                </span>
                <span className="font-bold text-white">{sala.capacidade} profissional(ais)</span>
              </div>

              {sala.cargosRecomendados && sala.cargosRecomendados.length > 0 && (
                <div className="mt-1 pt-2 border-t border-slate-800/50">
                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Funções Recomendadas:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {sala.cargosRecomendados.map(c => (
                      <span key={c} className="text-[8px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700/50">
                        {getCargoLabel(c)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Warnings Alerts */}
            {warnings.length > 0 && (
              <div className="bg-amber-950/20 border border-amber-900/40 p-3 rounded-lg flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>Alerta de Restrição Operacional</span>
                </div>
                {warnings.map((w, idx) => (
                  <p key={idx} className="text-[10px] text-amber-300/95 leading-relaxed">
                    • {w}
                  </p>
                ))}
              </div>
            )}

            {/* Allocated Staff List */}
            <div className="flex-1 flex flex-col min-h-0">
              <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                <span>Alocados ({staffNaSala.length})</span>
              </h4>

              <div className="flex-1 overflow-y-auto flex flex-col gap-2 min-h-0 pr-0.5">
                {staffNaSala.length > 0 ? (
                  staffNaSala.map((staff) => {
                    const IconComp = getCargoIcon(staff.cargo);
                    return (
                      <div 
                        key={staff.id} 
                        className="bg-[var(--c-surface)]/50 border border-slate-800 p-3 rounded-lg flex flex-col gap-2 relative group hover:border-[#e5a93c]/20"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs font-bold text-white leading-snug">{staff.nome}</div>
                            <div className="text-[9px] text-slate-500 font-mono mt-0.5">Matrícula: {staff.matricula}</div>
                          </div>
                          
                          {/* Trash desalocate action */}
                          <button
                            onClick={() => removerFuncionario(staff.id, sala.id)}
                            className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-500/10 shrink-0"
                            title="Desalocar profissional"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-1 text-[9px]">
                          <span className={`px-1.5 py-0.5 rounded border cargo-badge ${getCargoColorClass(staff.cargo)} flex items-center gap-1`}>
                            <IconComp size={9} />
                            {getCargoLabel(staff.cargo)}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded border uppercase ${getVinculoBadgeClass(staff.vinculo)}`}>
                            {getVinculoLabel(staff.vinculo)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex-1 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-6 text-center opacity-40">
                    <Users size={20} className="text-slate-600" />
                    <span className="text-[10px] text-slate-500 mt-2">Sem profissionais alocados neste turno</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Mode 2: General Info / Audit History Log
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-[var(--c-surface-2)]/20 flex items-center gap-2">
            <ClipboardList size={16} className="text-[#e5a93c]" />
            <h2 className="text-sm font-bold font-title text-white uppercase tracking-wider">
              Painel Operacional
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-0">
            {/* Quick Actions Card */}
            <div className="bg-[var(--c-surface)] border border-slate-800/80 p-3 rounded-lg flex flex-col gap-2 shrink-0">
              <h3 className="text-xs font-bold text-slate-300 font-title uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={13} className="text-[#e5a93c]" />
                Controles de Escala
              </h3>
              
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={carregarBase}
                  className="flex flex-col items-center justify-center p-2 rounded bg-slate-800 hover:bg-[#e5a93c]/10 border border-slate-700/80 hover:border-[#e5a93c]/40 text-center gap-1 group transition-all"
                  title="Importar a escala-base pré-alocada para o dia selecionado (se estiver vazio)"
                >
                  <Calendar size={14} className="text-[#e5a93c] group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-bold text-white">Carregar Base</span>
                </button>

                <button
                  onClick={limparDia}
                  className="flex flex-col items-center justify-center p-2 rounded bg-slate-800 hover:bg-red-950/20 border border-slate-700/80 hover:border-red-900/40 text-center gap-1 group transition-all"
                  title="Limpar todas as alocações do dia selecionado"
                >
                  <Trash2 size={14} className="text-red-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-bold text-white">Limpar Dia</span>
                </button>
              </div>

              <button
                onClick={onReplicar}
                className="flex items-center justify-center gap-2 mt-1 p-2 rounded bg-[var(--c-surface-2)] hover:bg-[#e5a93c]/10 border border-slate-700/80 hover:border-[#e5a93c]/40 text-[11px] font-bold text-slate-200 transition-all"
                title="Replicar este dia para outros dias, ou salvar/aplicar modelos de escala"
              >
                <CopyPlus size={14} className="text-[#e5a93c]" /> Replicar / Modelos
              </button>
            </div>

            {/* Audit History Logs */}
            <div className="flex-1 flex flex-col min-h-0">
              <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                <History size={13} className="text-[#e5a93c]" />
                <span>Histórico de Auditoria</span>
              </h4>

              <div className="flex-1 overflow-y-auto flex flex-col gap-2 min-h-0 pr-0.5">
                {historico.length > 0 ? (
                  historico.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-[var(--c-surface)]/70 border border-slate-800 p-2.5 rounded text-[10px] leading-relaxed"
                    >
                      <div className="flex items-center justify-between text-slate-500 font-mono text-[8px] mb-1">
                        <span>{new Date(item.timestamp).toLocaleTimeString('pt-BR')}</span>
                        <span className="text-[#e5a93c]/70">{item.usuario.split(' ')[0]}</span>
                      </div>
                      
                      <div className="text-slate-200">
                        <strong className="text-[#e5a93c] font-medium mr-1 uppercase text-[9px] bg-[#e5a93c]/5 px-1 py-0.2 rounded border border-[#e5a93c]/10">
                          {item.acao}
                        </strong>
                        {item.detalhes}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex-1 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-6 text-center opacity-40">
                    <History size={20} className="text-slate-600" />
                    <span className="text-[10px] text-slate-500 mt-2">Nenhum evento registrado ainda</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
