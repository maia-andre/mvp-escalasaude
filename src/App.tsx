import React, { useState } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { useEscalaStore } from './store/useEscalaStore';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MapaUnidade } from './components/mapa/MapaUnidade';
import { DetalheSala } from './components/painel/DetalheSala';
import { VisaoSemanal } from './components/semana/VisaoSemanal';
import { GerenciarModal } from './components/cadastro/GerenciarModal';
import { ModoApresentacao } from './components/apresentacao/ModoApresentacao';
import { AlertCircle, X, Award } from 'lucide-react';

export const App: React.FC = () => {
  const { moverFuncionario, removerFuncionario, modoVisao } = useEscalaStore();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [gerenciarAberto, setGerenciarAberto] = useState(false);
  const [apresentacaoAberta, setApresentacaoAberta] = useState(false);

  // Set up sensors to allow clicking buttons and inputs within draggable elements
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require dragging at least 8px to start drag operation
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    // Retrieve employee ID from the active element
    const activeData = active.data.current;
    if (!activeData) return;

    const funcionarioId = activeData.funcionarioId;
    const originalSalaId = activeData.originalSalaId;

    // Case 1: Dragged back to sidebar (desalocate)
    if (over.id === 'sidebar-droppable') {
      if (originalSalaId) {
        removerFuncionario(funcionarioId, originalSalaId);
      }
      return;
    }

    // Case 2: Dragged to a room
    const targetSalaId = (over.id as string).replace('droppable-', '');

    // If dropped in the same room, do nothing
    if (originalSalaId === targetSalaId) return;

    // Execute move
    const result = moverFuncionario(funcionarioId, originalSalaId, targetSalaId);

    if (!result.success && result.error) {
      setToastMessage(result.error);
      // Auto-hide toast after 4s
      setTimeout(() => {
        setToastMessage((prev) => (prev === result.error ? null : prev));
      }, 4000);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#070b13] select-none font-sans text-slate-100 relative">
        
        {/* Top Header Row */}
        <Header
          onGerenciar={() => setGerenciarAberto(true)}
          onApresentar={() => setApresentacaoAberta(true)}
        />

        {/* Work Area — planta interativa (3 colunas) ou grade semanal (cheia) */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          {modoVisao === 'semana' ? (
            <VisaoSemanal />
          ) : (
            <>
              {/* Left Column: Available Employees */}
              <Sidebar />

              {/* Center Column: Interactive SVG Map blueprint */}
              <main className="flex-1 flex flex-col min-h-0 bg-[#070b13] overflow-hidden">
                <MapaUnidade />
              </main>

              {/* Right Column: Active Room / Admin controls */}
              <DetalheSala />
            </>
          )}
        </div>

        {/* Bottom Status / Footer Bar */}
        <footer className="h-8 bg-[#0c1527] border-t border-[rgba(229,169,60,0.15)] flex items-center justify-between px-6 text-[10px] text-slate-500 shrink-0 z-10 select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Sistema Conectado (Offline Demo)</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Award size={10} className="text-[#e5a93c]" />
              Visual Escala SJC v0.1
            </span>
            <span>•</span>
            <span>Prefeitura Municipal de São José dos Campos</span>
          </div>
        </footer>

        {/* Floating Custom Toast Error Warning Alert (SJC Gold styled) */}
        {toastMessage && (
          <div className="absolute bottom-12 right-6 z-50 animate-bounce shake-element max-w-sm bg-[#0c1c3f] border border-red-500/50 rounded-xl p-4 shadow-2xl flex gap-3 items-start backdrop-blur-md">
            <div className="p-1 rounded bg-red-950/60 border border-red-900/50 shrink-0 text-red-400">
              <AlertCircle size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-red-300">Movimentação Bloqueada</h4>
              <p className="text-[10px] text-slate-300 mt-1 leading-normal">
                {toastMessage}
              </p>
            </div>
            <button 
              onClick={() => setToastMessage(null)}
              className="text-slate-500 hover:text-slate-200 transition-colors p-0.5 shrink-0 rounded hover:bg-slate-800"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Gestão de cadastros (profissionais e setores) */}
        <GerenciarModal open={gerenciarAberto} onClose={() => setGerenciarAberto(false)} />

        {/* Modo apresentação / impressão */}
        <ModoApresentacao open={apresentacaoAberta} onClose={() => setApresentacaoAberta(false)} />
      </div>
    </DndContext>
  );
};

export default App;
