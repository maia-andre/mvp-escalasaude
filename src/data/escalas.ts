import { Escala } from '../types';

export const mockEscalas: Escala[] = [
  // Manhã alocações (07h-13h)
  { id: 'e1', data: '2026-05-30', turno: 'manha', salaId: 'recepcao', funcionarioId: 'f17' }, // Rec. William
  { id: 'e2', data: '2026-05-30', turno: 'manha', salaId: 'recepcao', funcionarioId: 'f19' }, // Rec. Arthur
  { id: 'e3', data: '2026-05-30', turno: 'manha', salaId: 'acolhimento', funcionarioId: 'f6' }, // Enf. Gisele
  { id: 'e4', data: '2026-05-30', turno: 'manha', salaId: 'triagem', funcionarioId: 'f9' }, // Téc. Lucas
  { id: 'e5', data: '2026-05-30', turno: 'manha', salaId: 'vacina', funcionarioId: 'f10' }, // Téc. Mariana
  { id: 'e6', data: '2026-05-30', turno: 'manha', salaId: 'farmacia', funcionarioId: 'f13' }, // Farm. Roberto
  { id: 'e7', data: '2026-05-30', turno: 'manha', salaId: 'consultorio_1', funcionarioId: 'f1' }, // Dra. Amanda
  { id: 'e8', data: '2026-05-30', turno: 'manha', salaId: 'consultorio_2', funcionarioId: 'f2' }, // Dr. Bruno
  { id: 'e9', data: '2026-05-30', turno: 'manha', salaId: 'cons_odontologico', funcionarioId: 'f15' }, // Dr. Thiago
  { id: 'e10', data: '2026-05-30', turno: 'manha', salaId: 'gerencia', funcionarioId: 'f22' }, // Ger. Patrícia
  { id: 'e11', data: '2026-05-30', turno: 'manha', salaId: 'almoxarifado', funcionarioId: 'f20' }, // Adm. Cláudio

  // Tarde alocações (13h-19h)
  { id: 'e21', data: '2026-05-30', turno: 'tarde', salaId: 'recepcao', funcionarioId: 'f18' }, // Rec. Yasmin
  { id: 'e22', data: '2026-05-30', turno: 'tarde', salaId: 'acolhimento', funcionarioId: 'f7' }, // Enf. Henrique
  { id: 'e23', data: '2026-05-30', turno: 'tarde', salaId: 'triagem', funcionarioId: 'f11' }, // Téc. Nuno
  { id: 'e24', data: '2026-05-30', turno: 'tarde', salaId: 'vacina', funcionarioId: 'f12' }, // Téc. Priscila
  { id: 'e25', data: '2026-05-30', turno: 'tarde', salaId: 'farmacia', funcionarioId: 'f14' }, // Farm. Sandra
  { id: 'e26', data: '2026-05-30', turno: 'tarde', salaId: 'consultorio_3', funcionarioId: 'f3' }, // Dr. Carlos
  { id: 'e27', data: '2026-05-30', turno: 'tarde', salaId: 'consultorio_4', funcionarioId: 'f4' }, // Dra. Daniela
  { id: 'e28', data: '2026-05-30', turno: 'tarde', salaId: 'cons_odontologico', funcionarioId: 'f16' }, // Dra. Vanessa
  { id: 'e29', data: '2026-05-30', turno: 'tarde', salaId: 'gerencia', funcionarioId: 'f22' }, // Ger. Patrícia
  { id: 'e30', data: '2026-05-30', turno: 'tarde', salaId: 'almoxarifado', funcionarioId: 'f21' } // Adm. Elaine
];
