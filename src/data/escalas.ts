import { Escala } from '../types';

// Escala-base do dia 30/05/2026. Uma alocação por profissional/dia — a alocação
// cobre o horário próprio do profissional (ver `horario` em funcionarios.ts).
// Quem é da manhã (07–13) e quem é da tarde (13–19) divide naturalmente os mesmos
// setores sem estourar a capacidade, pois os horários não se sobrepõem.
export const mockEscalas: Escala[] = [
  // Recepção (cap. 3)
  { id: 'e1', data: '2026-05-30', salaId: 'recepcao', funcionarioId: 'f17' }, // Rec. William (manhã)
  { id: 'e2', data: '2026-05-30', salaId: 'recepcao', funcionarioId: 'f19' }, // Rec. Arthur (manhã)
  { id: 'e3', data: '2026-05-30', salaId: 'recepcao', funcionarioId: 'f18' }, // Rec. Yasmin (tarde)

  // Acolhimento / Triagem / Vacina (manhã + tarde)
  { id: 'e4', data: '2026-05-30', salaId: 'acolhimento', funcionarioId: 'f6' },  // Enfª. Gisele (manhã)
  { id: 'e5', data: '2026-05-30', salaId: 'acolhimento', funcionarioId: 'f7' },  // Enfº. Henrique (tarde)
  { id: 'e6', data: '2026-05-30', salaId: 'triagem', funcionarioId: 'f9' },      // Téc. Lucas (manhã)
  { id: 'e7', data: '2026-05-30', salaId: 'triagem', funcionarioId: 'f11' },     // Téc. Nuno (tarde)
  { id: 'e8', data: '2026-05-30', salaId: 'vacina', funcionarioId: 'f10' },      // Téc. Mariana (manhã)
  { id: 'e9', data: '2026-05-30', salaId: 'vacina', funcionarioId: 'f12' },      // Téc. Priscila (tarde)

  // Farmácia (manhã + tarde)
  { id: 'e10', data: '2026-05-30', salaId: 'farmacia', funcionarioId: 'f13' },   // Farm. Roberto (manhã)
  { id: 'e11', data: '2026-05-30', salaId: 'farmacia', funcionarioId: 'f14' },   // Farm. Sandra (tarde)

  // Consultórios médicos
  { id: 'e12', data: '2026-05-30', salaId: 'consultorio_1', funcionarioId: 'f1' }, // Dra. Amanda (manhã)
  { id: 'e13', data: '2026-05-30', salaId: 'consultorio_2', funcionarioId: 'f2' }, // Dr. Bruno (manhã)
  { id: 'e14', data: '2026-05-30', salaId: 'consultorio_3', funcionarioId: 'f3' }, // Dr. Carlos (tarde)
  { id: 'e15', data: '2026-05-30', salaId: 'consultorio_4', funcionarioId: 'f4' }, // Dra. Daniela (tarde)

  // Odontologia (manhã + tarde)
  { id: 'e16', data: '2026-05-30', salaId: 'cons_odontologico', funcionarioId: 'f15' }, // Dr. Thiago (manhã)
  { id: 'e17', data: '2026-05-30', salaId: 'cons_odontologico', funcionarioId: 'f16' }, // Dra. Vanessa (tarde)

  // Apoio / Gestão
  { id: 'e18', data: '2026-05-30', salaId: 'almoxarifado', funcionarioId: 'f20' }, // Adm. Cláudio (manhã)
  { id: 'e19', data: '2026-05-30', salaId: 'gerencia', funcionarioId: 'f22' },     // Ger. Patrícia (dia inteiro)
];
