import React from 'react';

export interface ChipOption {
  value: string;
  label: string;
}

interface ChipMultiSelectProps {
  options: ChipOption[];
  selected: string[];
  onChange: (next: string[]) => void;
  emptyHint?: string;
}

/** Seleção múltipla em formato de chips (funções, setores, recomendações...). */
export const ChipMultiSelect: React.FC<ChipMultiSelectProps> = ({
  options,
  selected,
  onChange,
  emptyHint,
}) => {
  const toggle = (value: string) => {
    onChange(
      selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value],
    );
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.length === 0 && emptyHint && (
        <span className="text-[10px] text-slate-500 italic">{emptyHint}</span>
      )}
      {options.map((o) => {
        const active = selected.includes(o.value);
        return (
          <button
            type="button"
            key={o.value}
            onClick={() => toggle(o.value)}
            className={`px-2 py-1 rounded-md text-[10px] font-semibold border transition-all ${
              active
                ? 'bg-[#e5a93c] text-[#061026] border-[#e5a93c]'
                : 'bg-[var(--c-surface)] text-slate-400 border-slate-700/80 hover:text-white hover:border-slate-600'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
};
