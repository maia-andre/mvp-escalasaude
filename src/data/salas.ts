import { Sala } from '../types';

export const mockSalas: Sala[] = [
  { id: 'recepcao', nome: 'Recepção Principal', tipo: 'recepcao', svgId: 'room_recepcao', capacidade: 3, cargosRecomendados: ['recepcionista', 'administrativo'] },
  { id: 'acolhimento', nome: 'Acolhimento', tipo: 'procedimento', svgId: 'room_acolhimento', capacidade: 2, cargosRecomendados: ['enfermeiro', 'tec_enfermagem'] },
  { id: 'triagem', nome: 'Triagem', tipo: 'procedimento', svgId: 'room_triagem', capacidade: 2, cargosRecomendados: ['enfermeiro', 'tec_enfermagem'] },
  { id: 'vacina', nome: 'Sala de Vacina', tipo: 'procedimento', svgId: 'room_vacina', capacidade: 2, cargosRecomendados: ['tec_enfermagem', 'enfermeiro'] },
  { id: 'curativo', nome: 'Sala de Curativos', tipo: 'procedimento', svgId: 'room_curativo', capacidade: 2, cargosRecomendados: ['tec_enfermagem', 'enfermeiro'] },
  { id: 'farmacia', nome: 'Farmácia', tipo: 'apoio', svgId: 'room_farmacia', capacidade: 2, cargosRecomendados: ['farmaceutico', 'administrativo'] },
  { id: 'almoxarifado', nome: 'Almoxarifado', tipo: 'apoio', svgId: 'room_almoxarifado', capacidade: 1, cargosRecomendados: ['administrativo'] },
  
  // 8 Consultórios Médicos
  { id: 'consultorio_1', nome: 'Consultório 1 (Med)', tipo: 'consultorio', svgId: 'room_cons_1', capacidade: 1, cargosRecomendados: ['medico'] },
  { id: 'consultorio_2', nome: 'Consultório 2 (Med)', tipo: 'consultorio', svgId: 'room_cons_2', capacidade: 1, cargosRecomendados: ['medico'] },
  { id: 'consultorio_3', nome: 'Consultório 3 (Med)', tipo: 'consultorio', svgId: 'room_cons_3', capacidade: 1, cargosRecomendados: ['medico'] },
  { id: 'consultorio_4', nome: 'Consultório 4 (Med)', tipo: 'consultorio', svgId: 'room_cons_4', capacidade: 1, cargosRecomendados: ['medico'] },
  { id: 'consultorio_5', nome: 'Consultório 5 (Med)', tipo: 'consultorio', svgId: 'room_cons_5', capacidade: 1, cargosRecomendados: ['medico'] },
  { id: 'consultorio_6', nome: 'Consultório 6 (Med)', tipo: 'consultorio', svgId: 'room_cons_6', capacidade: 1, cargosRecomendados: ['medico'] },
  { id: 'consultorio_7', nome: 'Consultório 7 (Med)', tipo: 'consultorio', svgId: 'room_cons_7', capacidade: 1, cargosRecomendados: ['medico'] },
  { id: 'consultorio_8', nome: 'Consultório 8 (Med)', tipo: 'consultorio', svgId: 'room_cons_8', capacidade: 1, cargosRecomendados: ['medico'] },
  
  // Outros consultórios / espaços
  { id: 'cons_odontologico', nome: 'Consultório Odontológico', tipo: 'consultorio', svgId: 'room_cons_odonto', capacidade: 2, cargosRecomendados: ['dentista'] },
  { id: 'reunioes', nome: 'Sala de Reuniões', tipo: 'administrativo', svgId: 'room_reunioes', capacidade: 4, cargosRecomendados: ['gerente', 'enfermeiro', 'medico', 'farmaceutico', 'administrativo'] },
  { id: 'gerencia', nome: 'Administração / Gerência', tipo: 'administrativo', svgId: 'room_gerencia', capacidade: 2, cargosRecomendados: ['gerente', 'administrativo'] },
  { id: 'copa', nome: 'Copa / Área de Descanso', tipo: 'apoio', svgId: 'room_copa', capacidade: 5, cargosRecomendados: [] }
];
