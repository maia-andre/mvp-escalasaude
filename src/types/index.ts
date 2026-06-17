export type VinculoType = 'efetivo' | 'urbam' | 'terceirizada';

export type CargoType = 
  | 'medico' 
  | 'enfermeiro' 
  | 'farmaceutico' 
  | 'recepcionista' 
  | 'dentista' 
  | 'tec_enfermagem' 
  | 'administrativo' 
  | 'gerente';

export interface Funcionario {
  id: string;
  nome: string;
  matricula: string;
  vinculo: VinculoType;
  /** Função principal — define cor, ícone e rótulo padrão do profissional. */
  cargo: CargoType;
  /** Funções que o profissional está habilitado a exercer (inclui o `cargo`). */
  funcoes: CargoType[];
  /** Ids de salas onde pode atuar. Vazio = sem restrição de setor. */
  setoresPermitidos: string[];
  /** Faixa horária livre do profissional no dia (HH:MM). */
  horario: {
    inicio: string;
    fim: string;
  };
  ativo: boolean;
  /** Quando a carga foi dividida (turno partido), indica a metade desta instância. */
  metade?: 'manha' | 'tarde';
  /** Id do profissional original do qual esta instância é a metade da tarde. */
  divididoDe?: string;
}

export type SalaTipo = 
  | 'consultorio' 
  | 'procedimento' 
  | 'apoio' 
  | 'administrativo' 
  | 'recepcao';

export interface PosicaoSala {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Sala {
  id: string;
  nome: string;
  tipo: SalaTipo;
  svgId: string;
  capacidade: number;
  cargosRecomendados?: CargoType[];
  /** Posição na planta SVG (viewBox 1000×680). Sem isso, a sala não é desenhada. */
  pos?: PosicaoSala;
}

export interface Escala {
  id: string;
  data: string;
  salaId: string;
  funcionarioId: string;
}

export interface HistoricoItem {
  id: string;
  acao: string;
  timestamp: string;
  usuario: string;
  detalhes: string;
}
