import { Funcionario } from '../types';

// `funcoes`: funções que o profissional está habilitado a exercer (inclui o cargo).
// `setoresPermitidos`: salas onde pode atuar ([] = sem restrição de setor).
export const mockFuncionarios: Funcionario[] = [
  // Médicos — sem restrição de setor; adequação avaliada pela função.
  { id: 'f1', nome: 'Dra. Amanda Silva Santos', matricula: '109842', vinculo: 'efetivo', cargo: 'medico', funcoes: ['medico'], setoresPermitidos: [], horario: { inicio: '07:00', fim: '13:00' }, ativo: true },
  { id: 'f2', nome: 'Dr. Bruno Oliveira Souza', matricula: '115430', vinculo: 'urbam', cargo: 'medico', funcoes: ['medico'], setoresPermitidos: [], horario: { inicio: '07:00', fim: '13:00' }, ativo: true },
  { id: 'f3', nome: 'Dr. Carlos Eduardo Lima', matricula: '201948', vinculo: 'terceirizada', cargo: 'medico', funcoes: ['medico'], setoresPermitidos: [], horario: { inicio: '13:00', fim: '19:00' }, ativo: true },
  { id: 'f4', nome: 'Dra. Daniela Pires Rocha', matricula: '105822', vinculo: 'efetivo', cargo: 'medico', funcoes: ['medico'], setoresPermitidos: [], horario: { inicio: '13:00', fim: '19:00' }, ativo: true },
  { id: 'f5', nome: 'Dr. Felipe Guimarães Rosa', matricula: '202311', vinculo: 'terceirizada', cargo: 'medico', funcoes: ['medico'], setoresPermitidos: [], horario: { inicio: '07:00', fim: '13:00' }, ativo: true },

  // Enfermeiros — habilitados também a tarefas de técnico de enfermagem.
  { id: 'f6', nome: 'Enfª. Gisele Almeida Ramos', matricula: '112933', vinculo: 'efetivo', cargo: 'enfermeiro', funcoes: ['enfermeiro', 'tec_enfermagem'], setoresPermitidos: [], horario: { inicio: '07:00', fim: '13:00' }, ativo: true },
  { id: 'f7', nome: 'Enfº. Henrique Castilho Rezende', matricula: '113421', vinculo: 'urbam', cargo: 'enfermeiro', funcoes: ['enfermeiro', 'tec_enfermagem'], setoresPermitidos: [], horario: { inicio: '13:00', fim: '19:00' }, ativo: true },
  { id: 'f8', nome: 'Enfª. Juliana Martins Gomes', matricula: '109312', vinculo: 'efetivo', cargo: 'enfermeiro', funcoes: ['enfermeiro', 'tec_enfermagem'], setoresPermitidos: [], horario: { inicio: '07:00', fim: '13:00' }, ativo: true },

  // Técnicos de Enfermagem
  { id: 'f9', nome: 'Téc. Lucas Gabriel Duarte', matricula: '118329', vinculo: 'urbam', cargo: 'tec_enfermagem', funcoes: ['tec_enfermagem'], setoresPermitidos: [], horario: { inicio: '07:00', fim: '13:00' }, ativo: true },
  { id: 'f10', nome: 'Téc. Mariana Carvalho Dias', matricula: '204918', vinculo: 'terceirizada', cargo: 'tec_enfermagem', funcoes: ['tec_enfermagem'], setoresPermitidos: [], horario: { inicio: '07:00', fim: '13:00' }, ativo: true },
  { id: 'f11', nome: 'Téc. Nuno Ferreira Costa', matricula: '117392', vinculo: 'urbam', cargo: 'tec_enfermagem', funcoes: ['tec_enfermagem'], setoresPermitidos: [], horario: { inicio: '13:00', fim: '19:00' }, ativo: true },
  { id: 'f12', nome: 'Téc. Priscila Nogueira Melo', matricula: '205312', vinculo: 'terceirizada', cargo: 'tec_enfermagem', funcoes: ['tec_enfermagem'], setoresPermitidos: [], horario: { inicio: '13:00', fim: '19:00' }, ativo: true },

  // Farmacêuticos — restritos a Farmácia e Almoxarifado.
  { id: 'f13', nome: 'Farm. Roberto José Abreu', matricula: '110932', vinculo: 'efetivo', cargo: 'farmaceutico', funcoes: ['farmaceutico'], setoresPermitidos: ['farmacia', 'almoxarifado'], horario: { inicio: '07:00', fim: '13:00' }, ativo: true },
  { id: 'f14', nome: 'Farm. Sandra Helena Vieira', matricula: '112349', vinculo: 'urbam', cargo: 'farmaceutico', funcoes: ['farmaceutico'], setoresPermitidos: ['farmacia', 'almoxarifado'], horario: { inicio: '13:00', fim: '19:00' }, ativo: true },

  // Dentistas — restritos ao Consultório Odontológico.
  { id: 'f15', nome: 'Dr. Thiago Medeiros Sales', matricula: '111492', vinculo: 'efetivo', cargo: 'dentista', funcoes: ['dentista'], setoresPermitidos: ['cons_odontologico'], horario: { inicio: '07:00', fim: '13:00' }, ativo: true },
  { id: 'f16', nome: 'Dra. Vanessa Mendes Cruz', matricula: '201389', vinculo: 'terceirizada', cargo: 'dentista', funcoes: ['dentista'], setoresPermitidos: ['cons_odontologico'], horario: { inicio: '13:00', fim: '19:00' }, ativo: true },

  // Recepcionistas — restritos a Recepção e Acolhimento.
  { id: 'f17', nome: 'Rec. William Afonso Souza', matricula: '203491', vinculo: 'terceirizada', cargo: 'recepcionista', funcoes: ['recepcionista'], setoresPermitidos: ['recepcao', 'acolhimento'], horario: { inicio: '07:00', fim: '13:00' }, ativo: true },
  { id: 'f18', nome: 'Rec. Yasmin Albuquerque', matricula: '207823', vinculo: 'terceirizada', cargo: 'recepcionista', funcoes: ['recepcionista'], setoresPermitidos: ['recepcao', 'acolhimento'], horario: { inicio: '13:00', fim: '19:00' }, ativo: true },
  { id: 'f19', nome: 'Rec. Arthur Lira Peixoto', matricula: '119230', vinculo: 'urbam', cargo: 'recepcionista', funcoes: ['recepcionista'], setoresPermitidos: ['recepcao', 'acolhimento'], horario: { inicio: '07:00', fim: '13:00' }, ativo: true },

  // Administrativos — também habilitados na recepção; atuam em setores de apoio/gestão.
  { id: 'f20', nome: 'Adm. Cláudio Moreira Lima', matricula: '114839', vinculo: 'urbam', cargo: 'administrativo', funcoes: ['administrativo', 'recepcionista'], setoresPermitidos: ['gerencia', 'almoxarifado', 'recepcao', 'reunioes'], horario: { inicio: '07:00', fim: '13:00' }, ativo: true },
  { id: 'f21', nome: 'Adm. Elaine Regina Santos', matricula: '116938', vinculo: 'efetivo', cargo: 'administrativo', funcoes: ['administrativo', 'recepcionista'], setoresPermitidos: ['gerencia', 'almoxarifado', 'recepcao', 'reunioes'], horario: { inicio: '13:00', fim: '19:00' }, ativo: true },

  // Gerente — dia inteiro; habilitada também em tarefas administrativas; sem restrição de setor.
  { id: 'f22', nome: 'Ger. Patrícia Helena Gomes', matricula: '101029', vinculo: 'efetivo', cargo: 'gerente', funcoes: ['gerente', 'administrativo'], setoresPermitidos: [], horario: { inicio: '07:00', fim: '19:00' }, ativo: true }
];
