import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Sala, Funcionario } from '../../types';
import { BadgeFuncionario } from './BadgeFuncionario';
import { useEscalaStore } from '../../store/useEscalaStore';
import { AlertCircle, PlusCircle } from 'lucide-react';

interface SalaSVGProps {
  sala: Sala;
  funcionariosAlocados: Funcionario[];
  x: number;
  y: number;
  width: number;
  height: number;
}

export const SalaSVG: React.FC<SalaSVGProps> = ({
  sala,
  funcionariosAlocados,
  x,
  y,
  width,
  height
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${sala.id}`,
    data: {
      salaId: sala.id
    }
  });

  const { salaSelecionada, setSalaSelecionada } = useEscalaStore();

  const isSelected = salaSelecionada === sala.id;
  const isFull = funcionariosAlocados.length >= sala.capacidade;
  const isEmpty = funcionariosAlocados.length === 0;

  // SJC Blue/Gold theme colors
  const baseFill = "rgba(12, 21, 39, 0.4)";
  const strokeColor = isSelected 
    ? "#e5a93c" 
    : isOver 
      ? "#3b82f6" 
      : "rgba(229, 169, 60, 0.15)";
  const strokeWidth = isSelected ? 2.5 : isOver ? 2 : 1;

  // Custom visual indicator colors
  const capacityIndicatorClass = isFull 
    ? 'text-red-400 bg-red-950/40 border-red-900/50' 
    : isEmpty 
      ? 'text-amber-400 bg-amber-950/40 border-amber-900/50' 
      : 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSalaSelecionada(isSelected ? null : sala.id);
  };

  return (
    <g 
      onClick={handleClick}
      className="group select-none cursor-pointer"
    >
      {/* Background Blueprint Rect */}
      <rect
        ref={(node) => setNodeRef(node as any)}
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        fill={isOver ? "rgba(59, 130, 246, 0.08)" : baseFill}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={isEmpty ? "4,4" : undefined}
        className={`transition-all duration-300 ${isEmpty ? 'svg-room-empty' : ''}`}
      />

      {/* Grid Pattern Effect in Room for premium blueprint feel */}
      <defs>
        <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect
        x={x + 2}
        y={y + 2}
        width={width - 4}
        height={height - 4}
        rx={6}
        fill="url(#grid-pattern)"
        pointerEvents="none"
      />

      {/* HTML overlay via foreignObject */}
      <foreignObject
        x={x + 5}
        y={y + 5}
        width={width - 10}
        height={height - 10}
        pointerEvents="none"
      >
        <div className="w-full h-full flex flex-col justify-between p-1.5 select-none font-sans overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between gap-1 w-full shrink-0">
            <h3 className={`text-[10px] font-bold tracking-wide truncate max-w-[80%] uppercase ${
              isSelected ? 'text-[#e5a93c]' : 'text-slate-300 group-hover:text-white'
            }`}>
              {sala.nome}
            </h3>
            
            {/* Capacity Pill */}
            {sala.capacidade > 0 && (
              <span className={`text-[8px] font-bold font-mono px-1 py-0.2 rounded border shrink-0 ${capacityIndicatorClass}`}>
                {funcionariosAlocados.length}/{sala.capacidade}
              </span>
            )}
          </div>

          {/* Draggable employee cards space */}
          <div className="flex-1 flex flex-col justify-center gap-1.5 overflow-y-auto pointer-events-auto my-1 pr-0.5">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center gap-1 py-2 text-center opacity-40 group-hover:opacity-75 transition-opacity">
                {sala.capacidade > 0 ? (
                  <>
                    <AlertCircle size={12} className="text-amber-400" />
                    <span className="text-[8px] text-amber-300 font-medium">Sem profissional</span>
                  </>
                ) : (
                  <span className="text-[8px] text-slate-500">Espaço de Apoio</span>
                )}
              </div>
            ) : (
              funcionariosAlocados.map((func) => (
                <BadgeFuncionario 
                  key={func.id} 
                  funcionario={func} 
                  salaId={sala.id} 
                />
              ))
            )}
          </div>

          {/* Footer inside room */}
          <div className="flex items-center justify-between text-[8px] text-slate-500 shrink-0 select-none">
            <span className="truncate">
              {sala.tipo === 'consultorio' ? 'Atendimento' : sala.tipo === 'procedimento' ? 'Procedimento' : 'Setor Apoio'}
            </span>
            
            {/* Quick action button indicator inside room */}
            {funcionariosAlocados.length < sala.capacidade && (
              <PlusCircle size={8} className="text-[#e5a93c]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </div>
      </foreignObject>
    </g>
  );
};
