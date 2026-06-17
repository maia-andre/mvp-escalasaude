import React, { useState, useEffect } from 'react';
import { useEscalaStore } from '../../store/useEscalaStore';
import {
  somarDias,
  diasDaSemana,
  intervaloDeDias,
  ehFimDeSemana,
  rotuloDataCurto,
} from '../../utils/dataHelper';
import { CopyPlus, Bookmark, X, CalendarRange, Save, Trash2, CheckCircle2, Layers } from 'lucide-react';

interface EscalaModalProps {
  open: boolean;
  onClose: () => void;
}

type Aba = 'replicar' | 'modelos';
type Modo = 'sobrescrever' | 'mesclar';

const ModoSelector: React.FC<{ value: Modo; onChange: (m: Modo) => void }> = ({ value, onChange }) => (
  <div className="flex gap-1 bg-[var(--c-surface)] border border-slate-700/50 rounded-lg p-0.5">
    {(['sobrescrever', 'mesclar'] as const).map((m) => (
      <button
        key={m}
        onClick={() => onChange(m)}
        className={`flex-1 px-2 py-1.5 rounded-md text-[11px] font-semibold transition ${
          value === m ? 'bg-[#e5a93c] text-[#061026]' : 'text-slate-400 hover:text-white'
        }`}
      >
        {m === 'sobrescrever' ? 'Sobrescrever' : 'Mesclar'}
      </button>
    ))}
  </div>
);

export const EscalaModal: React.FC<EscalaModalProps> = ({ open, onClose }) => {
  const { escalas, dataSelecionada, modelos, salvarModelo, aplicarModelo, excluirModelo, replicarDia } =
    useEscalaStore();

  const [aba, setAba] = useState<Aba>('replicar');
  const [de, setDe] = useState(dataSelecionada);
  const [ate, setAte] = useState(dataSelecionada);
  const [pularFds, setPularFds] = useState(true);
  const [modo, setModo] = useState<Modo>('sobrescrever');
  const [modoModelo, setModoModelo] = useState<Modo>('sobrescrever');
  const [nomeModelo, setNomeModelo] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Ao abrir, define o intervalo padrão (amanhã → +7 dias) e limpa feedback.
  useEffect(() => {
    if (open) {
      setDe(somarDias(dataSelecionada, 1));
      setAte(somarDias(dataSelecionada, 7));
      setFeedback(null);
    }
  }, [open, dataSelecionada]);

  if (!open) return null;

  const origemCount = escalas.filter((e) => e.data === dataSelecionada).length;
  const destinos = intervaloDeDias(de, ate).filter(
    (d) => d !== dataSelecionada && (!pularFds || !ehFimDeSemana(d)),
  );

  const handleReplicar = () => {
    if (origemCount === 0) {
      setFeedback('O dia de origem não tem alocações para replicar.');
      return;
    }
    if (destinos.length === 0) {
      setFeedback('Nenhum dia de destino no intervalo selecionado.');
      return;
    }
    const n = replicarDia(destinos, modo);
    setFeedback(`Escala de ${rotuloDataCurto(dataSelecionada)} replicada para ${n} dia(s).`);
  };

  const handleFixar = () => {
    if (origemCount === 0) {
      setFeedback('O dia atual não tem alocações para fixar como modelo.');
      return;
    }
    salvarModelo(nomeModelo);
    setNomeModelo('');
    setFeedback('Modelo salvo a partir do dia atual.');
  };

  const setRange = (deISO: string, ateISO: string) => {
    setDe(deISO);
    setAte(ateISO);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[85vh] flex flex-col glass-panel rounded-2xl border border-[rgba(229,169,60,0.25)] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-[var(--c-surface-2)]/30 shrink-0">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-[#e5a93c]" />
            <h2 className="text-sm font-bold font-title text-white uppercase tracking-wider">
              Escala — Replicar e Modelos
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded hover:bg-slate-800 transition">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 pt-3 border-b border-slate-800 shrink-0">
          {([
            { id: 'replicar', label: 'Replicar dia', Icon: CopyPlus },
            { id: 'modelos', label: 'Modelos', Icon: Bookmark },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setAba(t.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition ${
                aba === t.id ? 'text-[#e5a93c] border-[#e5a93c] bg-[#e5a93c]/5' : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              <t.Icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 min-h-0">
          {aba === 'replicar' ? (
            <>
              <div className="text-xs text-slate-400">
                Origem:{' '}
                <strong className="text-slate-200">{rotuloDataCurto(dataSelecionada)}</strong>{' '}
                <span className="text-[#e5a93c] font-bold">({origemCount} alocações)</span>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap gap-2">
                <Preset onClick={() => setRange(somarDias(dataSelecionada, 1), diasDaSemana(dataSelecionada)[6])}>
                  Resto da semana
                </Preset>
                <Preset onClick={() => setRange(somarDias(dataSelecionada, 1), somarDias(dataSelecionada, 7))}>
                  Próximos 7 dias
                </Preset>
                <Preset onClick={() => setRange(somarDias(dataSelecionada, 1), somarDias(dataSelecionada, 30))}>
                  Próximos 30 dias
                </Preset>
              </div>

              {/* Intervalo */}
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">De</span>
                  <input type="date" value={de} onChange={(e) => setDe(e.target.value)} className="input-cad" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Até</span>
                  <input type="date" value={ate} onChange={(e) => setAte(e.target.value)} className="input-cad" />
                </label>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input type="checkbox" checked={pularFds} onChange={(e) => setPularFds(e.target.checked)} className="accent-[#e5a93c]" />
                Pular fins de semana
              </label>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ao aplicar no destino</span>
                <ModoSelector value={modo} onChange={setModo} />
                <span className="text-[9px] text-slate-500 mt-0.5">
                  {modo === 'sobrescrever'
                    ? 'Substitui as alocações já existentes nos dias de destino.'
                    : 'Mantém o que já existe e adiciona só profissionais ainda não alocados.'}
                </span>
              </div>

              <div className="bg-[var(--c-surface)]/60 border border-slate-800 rounded-lg p-3 flex items-center gap-2 text-xs">
                <CalendarRange size={15} className="text-[#e5a93c] shrink-0" />
                <span className="text-slate-300">
                  <strong className="text-white">{destinos.length}</strong> dia(s) receberão a escala
                  {destinos.length > 0 && (
                    <span className="text-slate-500">
                      {' '}
                      ({rotuloDataCurto(destinos[0])}
                      {destinos.length > 1 ? ` … ${rotuloDataCurto(destinos[destinos.length - 1])}` : ''})
                    </span>
                  )}
                </span>
              </div>

              <button
                onClick={handleReplicar}
                className="flex items-center justify-center gap-2 bg-[#e5a93c] text-[#061026] text-sm font-bold py-2.5 rounded-lg hover:brightness-110 transition"
              >
                <CopyPlus size={16} /> Replicar para {destinos.length} dia(s)
              </button>
            </>
          ) : (
            <>
              {/* Fixar modelo */}
              <div className="bg-[var(--c-surface)]/60 border border-slate-800 rounded-lg p-3 flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-300">Fixar a escala do dia atual como modelo</span>
                <div className="flex gap-2">
                  <input
                    value={nomeModelo}
                    onChange={(e) => setNomeModelo(e.target.value)}
                    placeholder={`Ex.: Padrão semana (${rotuloDataCurto(dataSelecionada)})`}
                    className="input-cad flex-1"
                  />
                  <button
                    onClick={handleFixar}
                    className="flex items-center gap-1.5 bg-[#e5a93c] text-[#061026] text-xs font-bold px-3 rounded-lg hover:brightness-110 transition shrink-0"
                  >
                    <Save size={14} /> Fixar
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ao aplicar um modelo</span>
                <ModoSelector value={modoModelo} onChange={setModoModelo} />
              </div>

              {/* Lista de modelos */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Modelos salvos ({modelos.length})
                </span>
                {modelos.length === 0 ? (
                  <div className="border border-dashed border-slate-800 rounded-lg p-6 text-center text-[11px] text-slate-500">
                    Nenhum modelo ainda. Monte uma escala num dia e clique em “Fixar”.
                  </div>
                ) : (
                  modelos.map((m) => (
                    <div key={m.id} className="bg-[var(--c-surface)]/60 border border-slate-800 rounded-lg p-3 flex items-center gap-2">
                      <Bookmark size={14} className="text-[#e5a93c] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-100 truncate">{m.nome}</div>
                        <div className="text-[10px] text-slate-500">{m.itens.length} alocações</div>
                      </div>
                      <button
                        onClick={() => {
                          aplicarModelo(m.id, modoModelo);
                          setFeedback(`Modelo "${m.nome}" aplicado a ${rotuloDataCurto(dataSelecionada)}.`);
                        }}
                        className="flex items-center gap-1 text-[11px] font-bold text-[#e5a93c] border border-[#e5a93c]/40 hover:bg-[#e5a93c]/10 px-2.5 py-1.5 rounded-lg transition shrink-0"
                        title="Aplicar ao dia selecionado"
                      >
                        <CheckCircle2 size={13} /> Aplicar
                      </button>
                      <button
                        onClick={() => excluirModelo(m.id)}
                        className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10 shrink-0 transition"
                        title="Remover modelo"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {feedback && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2 text-[11px] text-slate-200 flex items-center gap-2">
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Preset: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="text-[11px] font-semibold text-slate-300 bg-[var(--c-surface)] border border-slate-700/60 rounded-lg px-2.5 py-1.5 hover:border-[#e5a93c]/50 transition"
  >
    {children}
  </button>
);
