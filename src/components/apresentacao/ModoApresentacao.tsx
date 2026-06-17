import React from 'react';
import { useEscalaStore } from '../../store/useEscalaStore';
import { ativoNoHorario } from '../../utils/horarioHelper';
import { rotuloDia } from '../../utils/dataHelper';
import {
  getCargoLabel,
  getCargoIcon,
  getCargoColorClass,
  CARGOS_DISPONIVEIS,
} from '../../utils/cargoHelper';
import { Printer, X, MapPin, Clock, Users, ShieldCheck, AlertTriangle } from 'lucide-react';

interface ModoApresentacaoProps {
  open: boolean;
  onClose: () => void;
}

export const ModoApresentacao: React.FC<ModoApresentacaoProps> = ({ open, onClose }) => {
  const { salas, funcionarios, escalas, dataSelecionada, horarioReferencia } = useEscalaStore();

  if (!open) return null;

  const staffNaSala = (salaId: string) =>
    escalas
      .filter((e) => e.data === dataSelecionada && e.salaId === salaId)
      .map((a) => funcionarios.find((f) => f.id === a.funcionarioId))
      .filter((f): f is NonNullable<typeof f> => !!f && f.ativo && ativoNoHorario(f, horarioReferencia));

  const setores = salas.filter((s) => s.id !== 'copa');
  const operacionais = setores.filter((s) => s.capacidade > 0);
  const cobertos = operacionais.filter((s) => staffNaSala(s.id).length > 0).length;
  const presentes = funcionarios.filter((f) => f.ativo && ativoNoHorario(f, horarioReferencia)).length;
  const alocados = new Set(
    escalas
      .filter((e) => e.data === dataSelecionada)
      .map((e) => e.funcionarioId)
      .filter((id) => {
        const f = funcionarios.find((x) => x.id === id);
        return f && f.ativo && ativoNoHorario(f, horarioReferencia);
      }),
  ).size;

  const r = rotuloDia(dataSelecionada);
  const ano = Number(dataSelecionada.split('-')[0]);
  const dataExtenso = `${r.sigla}, ${String(r.dia).padStart(2, '0')} ${r.mes} ${ano}`;

  return (
    <div className="fixed inset-0 z-[100] overflow-auto print-area apres-board bg-[#070b13] text-slate-100">
      {/* Floating controls (não imprimem) */}
      <div className="no-print fixed top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-[#e5a93c] text-[#061026] text-sm font-bold px-4 py-2 rounded-lg shadow-lg hover:brightness-110 transition"
        >
          <Printer size={16} /> Imprimir
        </button>
        <button
          onClick={onClose}
          className="flex items-center gap-2 bg-slate-800 text-slate-200 text-sm font-bold px-4 py-2 rounded-lg shadow-lg hover:bg-slate-700 transition"
        >
          <X size={16} /> Fechar
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Banner */}
        <div className="flex items-center justify-between border-b-2 border-[#e5a93c]/40 pb-5 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#0c2340] border-2 border-[#e5a93c] flex items-center justify-center shrink-0">
              <span className="font-title font-bold text-2xl text-[#e5a93c]">ES</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-title text-white">
                Escala<span className="text-[#e5a93c]">Saúde</span> — Quadro Operacional
              </h1>
              <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-[#e5a93c]" /> UBS Piloto • São José dos Campos
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-white capitalize">{dataExtenso}</div>
            <div className="flex items-center justify-end gap-1 text-sm text-[#e5a93c] font-mono mt-1">
              <Clock size={14} /> Referência: {horarioReferencia}
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Kpi icon={Users} cor="text-blue-400" valor={presentes} rotulo="Profissionais presentes" />
          <Kpi icon={ShieldCheck} cor="text-emerald-400" valor={alocados} rotulo="Alocados em setores" />
          <Kpi
            icon={AlertTriangle}
            cor={cobertos === operacionais.length ? 'text-emerald-400' : 'text-amber-400'}
            valor={`${cobertos}/${operacionais.length}`}
            rotulo="Setores cobertos"
          />
        </div>

        {/* Grade de setores */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {setores.map((sala) => {
            const staff = staffNaSala(sala.id);
            const vazio = staff.length === 0 && sala.capacidade > 0;
            return (
              <div
                key={sala.id}
                className={`apres-card rounded-xl border p-3 ${
                  vazio ? 'border-amber-900/40 bg-amber-950/10' : 'border-[rgba(229,169,60,0.18)] bg-[#0c1527]/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-white truncate">{sala.nome}</h3>
                  {sala.capacidade > 0 && (
                    <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0">
                      {staff.length}/{sala.capacidade}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  {staff.length > 0 ? (
                    staff.map((f) => {
                      const Icon = getCargoIcon(f.cargo);
                      return (
                        <div
                          key={f.id}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[11px] font-medium ${getCargoColorClass(f.cargo)}`}
                        >
                          <Icon size={11} className="shrink-0" />
                          <span className="truncate">{f.nome}</span>
                        </div>
                      );
                    })
                  ) : sala.capacidade > 0 ? (
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-400/80 py-1">
                      <AlertTriangle size={12} /> Sem profissional
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500 py-1">Setor de apoio</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legenda */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1">Legenda:</span>
          {CARGOS_DISPONIVEIS.map((c) => {
            const Icon = getCargoIcon(c);
            return (
              <span key={c} className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] ${getCargoColorClass(c)}`}>
                <Icon size={9} /> {getCargoLabel(c)}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Kpi: React.FC<{ icon: React.ComponentType<{ size?: number; className?: string }>; cor: string; valor: React.ReactNode; rotulo: string }> = ({
  icon: Icon,
  cor,
  valor,
  rotulo,
}) => (
  <div className="apres-card rounded-xl border border-[rgba(229,169,60,0.18)] bg-[#0c1527]/60 p-4 flex items-center gap-3">
    <Icon size={26} className={cor} />
    <div>
      <div className="text-2xl font-bold text-white leading-none">{valor}</div>
      <div className="text-[11px] text-slate-400 mt-1">{rotulo}</div>
    </div>
  </div>
);
