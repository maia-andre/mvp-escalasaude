import React, { useState } from 'react';
import { ProfissionaisAdmin } from './ProfissionaisAdmin';
import { SalasAdmin } from './SalasAdmin';
import { Users, DoorOpen, X, Settings } from 'lucide-react';

interface GerenciarModalProps {
  open: boolean;
  onClose: () => void;
}

type Aba = 'profissionais' | 'salas';

export const GerenciarModal: React.FC<GerenciarModalProps> = ({ open, onClose }) => {
  const [aba, setAba] = useState<Aba>('profissionais');

  if (!open) return null;

  const abas: { id: Aba; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { id: 'profissionais', label: 'Profissionais', icon: Users },
    { id: 'salas', label: 'Setores / Salas', icon: DoorOpen },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl h-[82vh] flex flex-col glass-panel rounded-2xl border border-[rgba(229,169,60,0.25)] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-[#0c2340]/30 shrink-0">
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-[#e5a93c]" />
            <h2 className="text-sm font-bold font-title text-white uppercase tracking-wider">
              Gerência de Cadastros
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded hover:bg-slate-800 transition"
            title="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 pt-3 border-b border-slate-800 shrink-0">
          {abas.map((a) => {
            const Icon = a.icon;
            const active = aba === a.id;
            return (
              <button
                key={a.id}
                onClick={() => setAba(a.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-all ${
                  active
                    ? 'text-[#e5a93c] border-[#e5a93c] bg-[#e5a93c]/5'
                    : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                <Icon size={14} /> {a.label}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0">
          {aba === 'profissionais' ? <ProfissionaisAdmin /> : <SalasAdmin />}
        </div>
      </div>
    </div>
  );
};
