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
  cargo: CargoType;
  horario: {
    inicio: string;
    fim: string;
  };
  ativo: boolean;
}

export type SalaTipo = 
  | 'consultorio' 
  | 'procedimento' 
  | 'apoio' 
  | 'administrativo' 
  | 'recepcao';

export interface Sala {
  id: string;
  nome: string;
  tipo: SalaTipo;
  svgId: string;
  capacidade: number;
  cargosRecomendados?: CargoType[];
}

export interface Escala {
  id: string;
  data: string;
  turno: 'manha' | 'tarde';
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
