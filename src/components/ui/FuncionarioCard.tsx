import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Funcionario } from '../../types';
import { getCargoLabel, getCargoIcon, getCargoColorClass, getVinculoLabel, getVinculoBadgeClass } from '../../utils/cargoHelper';
import { GripVertical, Clock } from 'lucide-react';

interface FuncionarioCardProps {
  funcionario: Funcionario;
  isAlocado?: boolean;
}

export const FuncionarioCard: React.FC<FuncionarioCardProps> = ({ funcionario, isAlocado = false }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `draggable-${funcionario.id}`,
    data: {
      funcionarioId: funcionario.id,
      originalSalaId: null // Sidebar origin
    }
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : isAlocado ? 0.5 : 1,
    cursor: isAlocado ? 'not-allowed' : 'grab',
  };

  const IconComponent = getCargoIcon(funcionario.cargo);
  const colorClass = getCargoColorClass(funcionario.cargo);
  const vinculoClass = getVinculoBadgeClass(funcionario.vinculo);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!isAlocado ? listeners : {})}
      {...(!isAlocado ? attributes : {})}
      className={`glass-card p-3 rounded-lg flex flex-col gap-2 transition-all ${
        isDragging ? 'border-[#e5a93c] glow-gold ring-1 ring-[#e5a93c]/30 z-50' : 'border-slate-800'
      } ${isAlocado ? 'pointer-events-none filter saturate-50' : ''}`}
    >
      {/* Name and Drag handle */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {!isAlocado && <GripVertical size={14} className="text-slate-500 shrink-0 cursor-grab" />}
          <span className="text-xs font-semibold text-slate-100 truncate" title={funcionario.nome}>
            {funcionario.nome.split(' ').slice(0, 3).join(' ')}
          </span>
        </div>
        <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium border uppercase tracking-wider shrink-0 ${vinculoClass}`}>
          {getVinculoLabel(funcionario.vinculo)}
        </span>
      </div>

      {/* Cargo and Shift Details */}
      <div className="flex items-center justify-between mt-1 text-[10px]">
        {/* Role Badge */}
        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border ${colorClass}`}>
          <IconComponent size={10} />
          <span className="font-medium">{getCargoLabel(funcionario.cargo)}</span>
        </div>

        {/* Time / Matricula */}
        <div className="flex items-center gap-1 text-slate-400">
          <Clock size={10} />
          <span className="font-mono text-[9px]">{funcionario.horario.inicio}-{funcionario.horario.fim}</span>
        </div>
      </div>
    </div>
  );
};
