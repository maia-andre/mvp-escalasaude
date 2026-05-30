import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Funcionario } from '../../types';
import { getCargoIcon, getCargoColorClass } from '../../utils/cargoHelper';
import { GripHorizontal } from 'lucide-react';

interface BadgeFuncionarioProps {
  funcionario: Funcionario;
  salaId: string;
}

export const BadgeFuncionario: React.FC<BadgeFuncionarioProps> = ({ funcionario, salaId }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `draggable-${funcionario.id}`,
    data: {
      funcionarioId: funcionario.id,
      originalSalaId: salaId // Origin room
    }
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 50 : 10
  };

  const IconComponent = getCargoIcon(funcionario.cargo);
  const colorClass = getCargoColorClass(funcionario.cargo);

  // Shorten name to "First Name + Last Initial" to fit inside SVG rooms nicely
  const getShortName = (name: string) => {
    const parts = name.split(' ');
    if (parts.length <= 1) return name;
    // e.g. "Amanda S." or "Dr. Bruno O."
    if (parts[0] === 'Dr.' || parts[0] === 'Dra.' || parts[0] === 'Enfº.' || parts[0] === 'Enfª.' || parts[0] === 'Téc.' || parts[0] === 'Rec.' || parts[0] === 'Adm.' || parts[0] === 'Ger.') {
      return `${parts[0]} ${parts[1]} ${parts[2] ? parts[2][0] + '.' : ''}`;
    }
    return `${parts[0]} ${parts[1][0]}.`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-semibold select-none cursor-grab transition-all shadow-sm ${colorClass} ${
        isDragging ? 'border-[#e5a93c] bg-slate-900 ring-2 ring-[#e5a93c]/50' : 'hover:scale-[1.02]'
      }`}
    >
      <GripHorizontal size={10} className="text-slate-400/80 cursor-grab hover:text-white" />
      <IconComponent size={10} className="shrink-0" />
      <span className="truncate max-w-[85px] leading-tight font-medium" title={funcionario.nome}>
        {getShortName(funcionario.nome)}
      </span>
    </div>
  );
};
