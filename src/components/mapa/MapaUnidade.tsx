import React from 'react';
import { useEscalaStore } from '../../store/useEscalaStore';
import { mockSalas } from '../../data/salas';
import { mockFuncionarios } from '../../data/funcionarios';
import { SalaSVG } from './SalaSVG';
import { ShieldAlert, Info, InfoIcon } from 'lucide-react';

interface CoordMap {
  x: number;
  y: number;
  w: number;
  h: number;
}

const coordMap: Record<string, CoordMap> = {
  recepcao: { x: 30, y: 30, w: 250, h: 140 },
  acolhimento: { x: 290, y: 30, w: 140, h: 140 },
  triagem: { x: 440, y: 30, w: 140, h: 140 },
  vacina: { x: 590, y: 30, w: 180, h: 140 },
  curativo: { x: 780, y: 30, w: 190, h: 140 },
  
  farmacia: { x: 30, y: 180, w: 190, h: 140 },
  almoxarifado: { x: 230, y: 180, w: 140, h: 140 },
  cons_odontologico: { x: 380, y: 180, w: 200, h: 140 },
  copa: { x: 590, y: 180, w: 180, h: 140 },
  reunioes: { x: 780, y: 180, w: 190, h: 140 },
  
  consultorio_1: { x: 30, y: 330, w: 110, h: 150 },
  consultorio_2: { x: 150, y: 330, w: 110, h: 150 },
  consultorio_3: { x: 270, y: 330, w: 110, h: 150 },
  consultorio_4: { x: 390, y: 330, w: 110, h: 150 },
  consultorio_5: { x: 510, y: 330, w: 110, h: 150 },
  consultorio_6: { x: 630, y: 330, w: 110, h: 150 },
  consultorio_7: { x: 750, y: 330, w: 110, h: 150 },
  consultorio_8: { x: 870, y: 330, w: 100, h: 150 },
  
  gerencia: { x: 30, y: 490, w: 940, h: 140 }
};

export const MapaUnidade: React.FC = () => {
  const { dataSelecionada, turnoSelecionado, escalas, setSalaSelecionada } = useEscalaStore();

  // Find allocated staff for each room
  const getStaffInRoom = (salaId: string) => {
    const allocations = escalas.filter(
      e => e.data === dataSelecionada && e.turno === turnoSelecionado && e.salaId === salaId
    );
    return allocations.map(a => mockFuncionarios.find(f => f.id === a.funcionarioId)).filter(Boolean) as any[];
  };

  // Check if there are any gaps (rooms that require staff but have none)
  const salasSemCobertura = mockSalas.filter(s => {
    if (s.id === 'copa') return false; // Copa doesn't need staff
    const staff = getStaffInRoom(s.id);
    return staff.length === 0;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 select-none">
      {/* Upper Status Bar inside center panel */}
      <div className="px-6 py-3 border-b border-slate-800/80 bg-[#0c1527]/30 flex flex-wrap items-center justify-between gap-4 shrink-0 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <InfoIcon size={14} className="text-[#e5a93c]" />
          <span>UBS Planta Baixa Piloto • Arraste e solte para movimentar profissionais</span>
        </div>
        
        {/* Coverage Alerts */}
        {salasSemCobertura.length > 0 ? (
          <div className="flex items-center gap-1.5 text-amber-400 bg-amber-950/20 px-2.5 py-1 rounded border border-amber-900/40">
            <ShieldAlert size={12} className="animate-pulse" />
            <span>Alerta: <strong>{salasSemCobertura.length} salas</strong> sem cobertura operacional neste turno!</span>
          </div>
        ) : (
          <div className="text-emerald-400 font-bold bg-emerald-950/20 px-2.5 py-1 rounded border border-emerald-900/40">
            ✓ Cobertura operacional ideal!
          </div>
        )}
      </div>

      {/* SVG Canvas Map */}
      <div 
        className="flex-1 overflow-auto p-6 flex items-center justify-center min-h-0 bg-[#070b13] relative"
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
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(229,169,60,0.025)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="1000" height="680" fill="url(#blueprint-grid)" rx="16" />

            {/* Building Border / Outer Foundation Walls */}
            <rect 
              x="15" 
              y="15" 
              width="970" 
              height="630" 
              fill="none" 
              stroke="rgba(229,169,60,0.12)" 
              strokeWidth="4" 
              rx="12" 
            />
            <rect 
              x="17" 
              y="17" 
              width="966" 
              height="626" 
              fill="none" 
              stroke="#0c1d3c" 
              strokeWidth="1.5" 
              rx="10" 
            />

            {/* Hallway / Corridors Graphics */}
            {/* Horizontal Corridor */}
            <rect x="30" y="322" width="940" height="6" fill="#0c1d3c" opacity="0.5" />
            
            {/* Entrance Arrow Sign */}
            <g transform="translate(150, 10)">
              <path d="M 0 0 L 10 12 L -10 12 Z" fill="#e5a93c" opacity="0.7" />
              <text x="0" y="24" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#e5a93c" opacity="0.8" letterSpacing="1">ENTRADA PRINCIPAL</text>
            </g>

            {/* Render all rooms */}
            {mockSalas.map(sala => {
              const coord = coordMap[sala.id];
              if (!coord) return null;
              
              const staff = getStaffInRoom(sala.id);
              
              return (
                <SalaSVG
                  key={sala.id}
                  sala={sala}
                  funcionariosAlocados={staff}
                  x={coord.x}
                  y={coord.y}
                  width={coord.w}
                  height={coord.h}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
