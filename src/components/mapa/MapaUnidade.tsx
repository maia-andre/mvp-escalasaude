import React from 'react';
import { useEscalaStore } from '../../store/useEscalaStore';
import { SalaSVG } from './SalaSVG';
import { ativoNoHorario } from '../../utils/horarioHelper';
import { ShieldAlert, InfoIcon } from 'lucide-react';

export const MapaUnidade: React.FC = () => {
  const { dataSelecionada, horarioReferencia, escalas, salas, funcionarios, setSalaSelecionada } =
    useEscalaStore();

  // Profissionais presentes em cada sala no horário de referência.
  const getStaffInRoom = (salaId: string) => {
    return escalas
      .filter((e) => e.data === dataSelecionada && e.salaId === salaId)
      .map((a) => funcionarios.find((f) => f.id === a.funcionarioId))
      .filter((f): f is NonNullable<typeof f> => !!f && ativoNoHorario(f, horarioReferencia));
  };

  // Setores que exigem profissional mas estão vazios neste horário (copa não conta).
  const salasSemCobertura = salas.filter((s) => {
    if (s.id === 'copa') return false;
    return getStaffInRoom(s.id).length === 0;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 select-none">
      {/* Upper Status Bar inside center panel */}
      <div className="px-6 py-3 border-b border-slate-800/80 bg-[var(--c-surface)]/30 flex flex-wrap items-center justify-between gap-4 shrink-0 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <InfoIcon size={14} className="text-[#e5a93c]" />
          <span>
            Planta da UBS às <strong className="text-slate-200">{horarioReferencia}</strong> • arraste
            e solte para movimentar profissionais
          </span>
        </div>

        {/* Coverage Alerts */}
        {salasSemCobertura.length > 0 ? (
          <div className="flex items-center gap-1.5 text-amber-400 bg-amber-950/20 px-2.5 py-1 rounded border border-amber-900/40">
            <ShieldAlert size={12} className="animate-pulse" />
            <span>
              Alerta: <strong>{salasSemCobertura.length} salas</strong> sem cobertura operacional neste
              horário!
            </span>
          </div>
        ) : (
          <div className="text-emerald-400 font-bold bg-emerald-950/20 px-2.5 py-1 rounded border border-emerald-900/40">
            ✓ Cobertura operacional ideal!
          </div>
        )}
      </div>

      {/* SVG Canvas Map */}
      <div
        className="flex-1 overflow-auto p-6 flex items-center justify-center min-h-0 bg-[var(--c-bg)] relative"
        onClick={() => setSalaSelecionada(null)}
      >
        <div className="w-full max-w-[1000px] aspect-[1000/680] max-h-full">
          <svg
            viewBox="0 0 1000 680"
            className="w-full h-full text-slate-500 font-sans filter drop-shadow-2xl select-none"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Grid background representing architectural blueprint scale */}
            <defs>
              <pattern id="blueprint-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(229,169,60,0.025)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="1000" height="680" fill="url(#blueprint-grid)" rx="16" />

            {/* Building Border / Outer Foundation Walls */}
            <rect x="15" y="15" width="970" height="630" fill="none" stroke="rgba(229,169,60,0.12)" strokeWidth="4" rx="12" />
            <rect x="17" y="17" width="966" height="626" fill="none" stroke="#0c1d3c" strokeWidth="1.5" rx="10" />

            {/* Horizontal Corridor */}
            <rect x="30" y="322" width="940" height="6" fill="#0c1d3c" opacity="0.5" />

            {/* Entrance Arrow Sign */}
            <g transform="translate(150, 10)">
              <path d="M 0 0 L 10 12 L -10 12 Z" fill="#e5a93c" opacity="0.7" />
              <text x="0" y="24" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#e5a93c" opacity="0.8" letterSpacing="1">
                ENTRADA PRINCIPAL
              </text>
            </g>

            {/* Render all rooms that have a position */}
            {salas.map((sala) => {
              if (!sala.pos) return null;
              return (
                <SalaSVG
                  key={sala.id}
                  sala={sala}
                  funcionariosAlocados={getStaffInRoom(sala.id)}
                  x={sala.pos.x}
                  y={sala.pos.y}
                  width={sala.pos.w}
                  height={sala.pos.h}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
