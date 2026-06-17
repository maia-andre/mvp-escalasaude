import { create } from 'zustand';
import { Escala, HistoricoItem, Funcionario, Sala } from '../types';
import { mockEscalas } from '../data/escalas';
import { mockFuncionarios } from '../data/funcionarios';
import { mockSalas } from '../data/salas';
import { intervalosSobrepoem, horaParaMinutos, minutosParaHora } from '../utils/horarioHelper';

interface EscalaState {
  // Cadastros (mutáveis via tela de gestão)
  funcionarios: Funcionario[];
  salas: Sala[];

  // Operação
  dataSelecionada: string;
  /** Instante do dia observado no mapa (HH:MM). Filtra quem está presente. */
  horarioReferencia: string;
  escalas: Escala[];
  salaSelecionada: string | null;
  historico: HistoricoItem[];

  /** Visão ativa no centro: planta interativa ou grade semanal. */
  modoVisao: 'mapa' | 'semana';
  /** Tema da interface (a planta e a apresentação são sempre escuras). */
  tema: 'escuro' | 'claro';

  // Seleção / filtros
  setDataSelecionada: (data: string) => void;
  setHorarioReferencia: (hora: string) => void;
  setSalaSelecionada: (salaId: string | null) => void;
  setModoVisao: (modo: 'mapa' | 'semana') => void;
  alternarTema: () => void;

  // Alocação (drag & drop)
  moverFuncionario: (
    funcionarioId: string,
    salaDeId: string | null,
    salaParaId: string,
  ) => { success: boolean; error?: string };
  removerFuncionario: (funcionarioId: string, salaId: string) => void;
  limparDia: () => void;
  carregarBase: () => void;

  // CRUD de cadastros
  salvarFuncionario: (funcionario: Funcionario) => void;
  excluirFuncionario: (id: string) => void;
  salvarSala: (sala: Sala) => void;
  excluirSala: (id: string) => void;

  // Turno partido (dividir/juntar carga horária)
  dividirCargaFuncionario: (id: string) => { success: boolean; error?: string };
  juntarCargaFuncionario: (id: string) => void;

  // Hidratação a partir do banco local (Electron). No-op no modo web.
  hydrate: (partial: Partial<Pick<EscalaState, 'escalas' | 'historico'>>) => void;
}

const USUARIO = 'Gerente Geral (SJC)';

const temaInicial = (): 'escuro' | 'claro' => {
  try {
    return localStorage.getItem('escalasaude:tema') === 'claro' ? 'claro' : 'escuro';
  } catch {
    return 'escuro';
  }
};

const novoHistorico = (acao: string, detalhes: string): HistoricoItem => ({
  id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  acao,
  timestamp: new Date().toISOString(),
  usuario: USUARIO,
  detalhes,
});

export const useEscalaStore = create<EscalaState>((set, get) => ({
  funcionarios: mockFuncionarios,
  salas: mockSalas,

  dataSelecionada: '2026-05-30',
  horarioReferencia: '09:00',
  escalas: mockEscalas,
  salaSelecionada: null,
  modoVisao: 'mapa',
  tema: temaInicial(),
  historico: [
    {
      id: 'h0',
      acao: 'Inicialização',
      timestamp: new Date(2026, 4, 30, 8, 0, 0).toISOString(),
      usuario: USUARIO,
      detalhes: 'Sistema inicializado com escala-base do dia.',
    },
  ],

  setDataSelecionada: (data) => set({ dataSelecionada: data }),

  setHorarioReferencia: (hora) => set({ horarioReferencia: hora }),

  setSalaSelecionada: (salaId) => set({ salaSelecionada: salaId }),

  setModoVisao: (modo) => set({ modoVisao: modo }),

  alternarTema: () => set((s) => ({ tema: s.tema === 'claro' ? 'escuro' : 'claro' })),

  hydrate: (partial) => set(partial),

  moverFuncionario: (funcionarioId, salaDeId, salaParaId) => {
    const { escalas, dataSelecionada, historico, funcionarios, salas } = get();

    const funcionario = funcionarios.find((f) => f.id === funcionarioId);
    const salaPara = salas.find((s) => s.id === salaParaId);

    if (!funcionario || !salaPara) {
      return { success: false, error: 'Funcionário ou sala não encontrados.' };
    }

    // 1. Capacidade: conta apenas quem já está na sala (no mesmo dia) com horário
    //    que SOBREPÕE o do funcionário — manhã e tarde podem dividir o setor.
    const concorrentes = escalas.filter((e) => {
      if (e.data !== dataSelecionada || e.salaId !== salaParaId) return false;
      if (e.funcionarioId === funcionarioId) return false;
      const outro = funcionarios.find((f) => f.id === e.funcionarioId);
      if (!outro) return false;
      return intervalosSobrepoem(
        funcionario.horario.inicio,
        funcionario.horario.fim,
        outro.horario.inicio,
        outro.horario.fim,
      );
    });

    if (concorrentes.length >= salaPara.capacidade) {
      return {
        success: false,
        error: `Capacidade máxima atingida! A sala "${salaPara.nome}" comporta no máximo ${salaPara.capacidade} profissional(ais) no mesmo horário.`,
      };
    }

    // 2. Remove a alocação anterior deste funcionário no dia (1 por pessoa/dia).
    const novasEscalas = escalas.filter(
      (e) => !(e.data === dataSelecionada && e.funcionarioId === funcionarioId),
    );

    // 3. Adiciona a nova alocação.
    novasEscalas.push({
      id: `e-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      data: dataSelecionada,
      salaId: salaParaId,
      funcionarioId,
    });

    // 4. Registra no histórico de auditoria.
    const salaDe = salas.find((s) => s.id === salaDeId);
    const detalhes = salaDe
      ? `Movimentou ${funcionario.nome} de "${salaDe.nome}" para "${salaPara.nome}"`
      : `Alocou ${funcionario.nome} na sala "${salaPara.nome}"`;

    set({
      escalas: novasEscalas,
      historico: [novoHistorico('Movimentação', detalhes), ...historico],
    });

    return { success: true };
  },

  removerFuncionario: (funcionarioId, salaId) => {
    const { escalas, dataSelecionada, historico, funcionarios, salas } = get();

    const funcionario = funcionarios.find((f) => f.id === funcionarioId);
    const sala = salas.find((s) => s.id === salaId);
    if (!funcionario || !sala) return;

    set({
      escalas: escalas.filter(
        (e) => !(e.data === dataSelecionada && e.funcionarioId === funcionarioId && e.salaId === salaId),
      ),
      historico: [
        novoHistorico('Desalocação', `Desalocou ${funcionario.nome} da sala "${sala.nome}"`),
        ...historico,
      ],
    });
  },

  limparDia: () => {
    const { escalas, dataSelecionada, historico } = get();

    set({
      escalas: escalas.filter((e) => e.data !== dataSelecionada),
      historico: [
        novoHistorico('Limpeza do Dia', `Limpou todas as alocações do dia ${dataSelecionada}.`),
        ...historico,
      ],
      salaSelecionada: null,
    });
  },

  carregarBase: () => {
    const { escalas, dataSelecionada, historico } = get();

    // Só carrega a escala-base se o dia estiver vazio.
    if (escalas.some((e) => e.data === dataSelecionada)) return;

    const novasAlocacoes: Escala[] = mockEscalas.map((e) => ({
      ...e,
      id: `e-base-${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${e.id}`,
      data: dataSelecionada,
    }));

    set({
      escalas: [...escalas, ...novasAlocacoes],
      historico: [
        novoHistorico('Importação', `Carregou a escala-base para o dia ${dataSelecionada}.`),
        ...historico,
      ],
    });
  },

  salvarFuncionario: (funcionario) => {
    const { funcionarios, historico } = get();
    const existe = funcionarios.some((f) => f.id === funcionario.id);
    const lista = existe
      ? funcionarios.map((f) => (f.id === funcionario.id ? funcionario : f))
      : [...funcionarios, funcionario];

    set({
      funcionarios: lista,
      historico: [
        novoHistorico(
          existe ? 'Cadastro Atualizado' : 'Cadastro Criado',
          `${existe ? 'Atualizou' : 'Cadastrou'} o profissional ${funcionario.nome}.`,
        ),
        ...historico,
      ],
    });
  },

  excluirFuncionario: (id) => {
    const { funcionarios, escalas, historico } = get();
    const funcionario = funcionarios.find((f) => f.id === id);
    if (!funcionario) return;

    set({
      funcionarios: funcionarios.filter((f) => f.id !== id),
      // Remove também suas alocações em qualquer dia.
      escalas: escalas.filter((e) => e.funcionarioId !== id),
      historico: [
        novoHistorico('Cadastro Removido', `Removeu o profissional ${funcionario.nome}.`),
        ...historico,
      ],
    });
  },

  salvarSala: (sala) => {
    const { salas, historico } = get();
    const existe = salas.some((s) => s.id === sala.id);
    const lista = existe ? salas.map((s) => (s.id === sala.id ? sala : s)) : [...salas, sala];

    set({
      salas: lista,
      historico: [
        novoHistorico(
          existe ? 'Setor Atualizado' : 'Setor Criado',
          `${existe ? 'Atualizou' : 'Cadastrou'} o setor "${sala.nome}".`,
        ),
        ...historico,
      ],
    });
  },

  excluirSala: (id) => {
    const { salas, escalas, salaSelecionada, historico } = get();
    const sala = salas.find((s) => s.id === id);
    if (!sala) return;

    set({
      salas: salas.filter((s) => s.id !== id),
      escalas: escalas.filter((e) => e.salaId !== id),
      salaSelecionada: salaSelecionada === id ? null : salaSelecionada,
      historico: [
        novoHistorico('Setor Removido', `Removeu o setor "${sala.nome}".`),
        ...historico,
      ],
    });
  },

  dividirCargaFuncionario: (id) => {
    const { funcionarios, historico } = get();
    const f = funcionarios.find((x) => x.id === id);
    if (!f) return { success: false, error: 'Profissional não encontrado.' };

    const jaDividido = !!f.metade || funcionarios.some((x) => x.divididoDe === f.id);
    if (jaDividido) {
      return { success: false, error: 'A carga deste profissional já está dividida.' };
    }

    const ini = horaParaMinutos(f.horario.inicio);
    const fim = horaParaMinutos(f.horario.fim);
    if (fim - ini < 120) {
      return { success: false, error: 'A carga horária é curta demais para dividir (mínimo de 2h).' };
    }

    // Ponto de corte: meio da jornada, arredondado para 30 minutos.
    let corte = Math.round((ini + (fim - ini) / 2) / 30) * 30;
    if (corte <= ini || corte >= fim) corte = ini + Math.floor((fim - ini) / 2);
    const corteH = minutosParaHora(corte);

    const manha: Funcionario = {
      ...f,
      horario: { inicio: f.horario.inicio, fim: corteH },
      metade: 'manha',
    };
    const tarde: Funcionario = {
      ...f,
      id: `${f.id}-t-${Date.now()}`,
      horario: { inicio: corteH, fim: f.horario.fim },
      metade: 'tarde',
      divididoDe: f.id,
    };

    set({
      funcionarios: funcionarios.flatMap((x) => (x.id === f.id ? [manha, tarde] : [x])),
      historico: [
        novoHistorico(
          'Carga Dividida',
          `Dividiu a carga de ${f.nome}: manhã (${manha.horario.inicio}–${manha.horario.fim}) e tarde (${tarde.horario.inicio}–${tarde.horario.fim}).`,
        ),
        ...historico,
      ],
    });
    return { success: true };
  },

  juntarCargaFuncionario: (id) => {
    const { funcionarios, escalas, historico } = get();
    const alvo = funcionarios.find((x) => x.id === id);
    if (!alvo) return;

    const original = alvo.divididoDe ? funcionarios.find((x) => x.id === alvo.divididoDe) : alvo;
    const tarde = funcionarios.find((x) => x.divididoDe === (original ? original.id : ''));

    if (original && tarde) {
      const reunido: Funcionario = {
        ...original,
        horario: { inicio: original.horario.inicio, fim: tarde.horario.fim },
        metade: undefined,
        divididoDe: undefined,
      };
      set({
        funcionarios: funcionarios
          .filter((x) => x.id !== tarde.id)
          .map((x) => (x.id === original.id ? reunido : x)),
        escalas: escalas.filter((e) => e.funcionarioId !== tarde.id),
        historico: [
          novoHistorico(
            'Carga Reunida',
            `Reuniu a carga de ${reunido.nome} (${reunido.horario.inicio}–${reunido.horario.fim}).`,
          ),
          ...historico,
        ],
      });
    } else {
      // Par incompleto: apenas normaliza o registro restante.
      const restante = original ?? alvo;
      set({
        funcionarios: funcionarios.map((x) =>
          x.id === restante.id ? { ...x, metade: undefined, divididoDe: undefined } : x,
        ),
        historico: [novoHistorico('Carga Reunida', `Normalizou a carga de ${restante.nome}.`), ...historico],
      });
    }
  },
}));
