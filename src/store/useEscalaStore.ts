import { create } from 'zustand';
import { Escala, HistoricoItem, Funcionario, Sala } from '../types';
import { mockEscalas } from '../data/escalas';
import { mockFuncionarios } from '../data/funcionarios';
import { mockSalas } from '../data/salas';

interface EscalaState {
  dataSelecionada: string;
  turnoSelecionado: 'manha' | 'tarde';
  escalas: Escala[];
  salaSelecionada: string | null;
  historico: HistoricoItem[];
  
  // Actions
  setDataSelecionada: (data: string) => void;
  setTurnoSelecionado: (turno: 'manha' | 'tarde') => void;
  setSalaSelecionada: (salaId: string | null) => void;
  
  moverFuncionario: (funcionarioId: string, salaDeId: string | null, salaParaId: string) => { success: boolean; error?: string };
  removerFuncionario: (funcionarioId: string, salaId: string) => void;
  limparEscalaDia: () => void;
  copiarDiaAnterior: () => void;
}

export const useEscalaStore = create<EscalaState>((set, get) => ({
  dataSelecionada: '2026-05-30',
  turnoSelecionado: 'manha',
  escalas: mockEscalas,
  salaSelecionada: null,
  historico: [
    {
      id: 'h0',
      acao: 'Inicialização',
      timestamp: new Date(2026, 4, 30, 8, 0, 0).toISOString(),
      usuario: 'Gerente Geral (SJC)',
      detalhes: 'Sistema inicializado com escala padrão do dia.'
    }
  ],

  setDataSelecionada: (data) => set({ dataSelecionada: data }),
  
  setTurnoSelecionado: (turno) => set({ turnoSelecionado: turno, salaSelecionada: null }),
  
  setSalaSelecionada: (salaId) => set({ salaSelecionada: salaId }),

  moverFuncionario: (funcionarioId, salaDeId, salaParaId) => {
    const { escalas, dataSelecionada, turnoSelecionado, historico } = get();
    
    const funcionario = mockFuncionarios.find(f => f.id === funcionarioId);
    const salaPara = mockSalas.find(s => s.id === salaParaId);
    
    if (!funcionario || !salaPara) {
      return { success: false, error: 'Funcionário ou sala não encontrados.' };
    }

    // 1. Verificar capacidade da sala de destino
    const alocadosNaSala = escalas.filter(
      e => e.data === dataSelecionada && e.turno === turnoSelecionado && e.salaId === salaParaId
    );

    if (alocadosNaSala.length >= salaPara.capacidade) {
      return { 
        success: false, 
        error: `Capacidade máxima atingida! A sala "${salaPara.nome}" suporta no máximo ${salaPara.capacidade} profissional(ais).` 
      };
    }

    // 2. Remover alocações anteriores deste funcionário para o mesmo dia e turno
    let novasEscalas = escalas.filter(
      e => !(e.data === dataSelecionada && e.turno === turnoSelecionado && e.funcionarioId === funcionarioId)
    );

    // 3. Adicionar nova alocação
    const novaAlocacao: Escala = {
      id: `e-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      data: dataSelecionada,
      turno: turnoSelecionado,
      salaId: salaParaId,
      funcionarioId
    };

    novasEscalas.push(novaAlocacao);

    // 4. Criar registro de histórico
    const salaDe = mockSalas.find(s => s.id === salaDeId);
    const detalhesAcao = salaDe 
      ? `Movimentou ${funcionario.nome} de "${salaDe.nome}" para "${salaPara.nome}"`
      : `Alocou ${funcionario.nome} na sala "${salaPara.nome}"`;

    const novoHistorico: HistoricoItem = {
      id: `h-${Date.now()}`,
      acao: 'Movimentação',
      timestamp: new Date().toISOString(),
      usuario: 'Gerente Geral (SJC)',
      detalhes: detalhesAcao
    };

    set({
      escalas: novasEscalas,
      historico: [novoHistorico, ...historico]
    });

    return { success: true };
  },

  removerFuncionario: (funcionarioId, salaId) => {
    const { escalas, dataSelecionada, turnoSelecionado, historico } = get();
    
    const funcionario = mockFuncionarios.find(f => f.id === funcionarioId);
    const sala = mockSalas.find(s => s.id === salaId);

    if (!funcionario || !sala) return;

    // Remover alocação
    const novasEscalas = escalas.filter(
      e => !(e.data === dataSelecionada && e.turno === turnoSelecionado && e.funcionarioId === funcionarioId && e.salaId === salaId)
    );

    // Adicionar histórico
    const novoHistorico: HistoricoItem = {
      id: `h-${Date.now()}`,
      acao: 'Desalocação',
      timestamp: new Date().toISOString(),
      usuario: 'Gerente Geral (SJC)',
      detalhes: `Desalocou ${funcionario.nome} da sala "${sala.nome}"`
    };

    set({
      escalas: novasEscalas,
      historico: [novoHistorico, ...historico]
    });
  },

  limparEscalaDia: () => {
    const { escalas, dataSelecionada, turnoSelecionado, historico } = get();
    
    const novasEscalas = escalas.filter(
      e => !(e.data === dataSelecionada && e.turno === turnoSelecionado)
    );

    const novoHistorico: HistoricoItem = {
      id: `h-${Date.now()}`,
      acao: 'Limpeza de Turno',
      timestamp: new Date().toISOString(),
      usuario: 'Gerente Geral (SJC)',
      detalhes: `Limpou todas as alocações do turno da ${turnoSelecionado === 'manha' ? 'Manhã' : 'Tarde'}.`
    };

    set({
      escalas: novasEscalas,
      historico: [novoHistorico, ...historico],
      salaSelecionada: null
    });
  },

  copiarDiaAnterior: () => {
    const { escalas, dataSelecionada, turnoSelecionado, historico } = get();
    
    // Vamos simular copiando as alocações de um dia fixado, ou duplicando as alocações existentes se estiver vazio
    // Para fins de mock, vamos carregar alocações padrão se o dia estiver vazio
    const alocacoesDesteTurno = escalas.filter(e => e.data === dataSelecionada && e.turno === turnoSelecionado);
    
    if (alocacoesDesteTurno.length > 0) return; // Só copia se o turno estiver vazio

    // Filtrar alocações do mesmo turno de QUALQUER dia (por exemplo, as mockadas padrão de "2026-05-30")
    const alocacoesPadrao = mockEscalas.filter(e => e.turno === turnoSelecionado);
    
    const novasAlocacoes: Escala[] = alocacoesPadrao.map(e => ({
      ...e,
      id: `e-copy-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      data: dataSelecionada
    }));

    const novoHistorico: HistoricoItem = {
      id: `h-${Date.now()}`,
      acao: 'Importação',
      timestamp: new Date().toISOString(),
      usuario: 'Gerente Geral (SJC)',
      detalhes: `Copiou escala-base para o dia ${dataSelecionada} (${turnoSelecionado === 'manha' ? 'Manhã' : 'Tarde'}).`
    };

    set({
      escalas: [...escalas, ...novasAlocacoes],
      historico: [novoHistorico, ...historico]
    });
  }
}));
