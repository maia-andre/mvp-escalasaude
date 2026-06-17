import { Sala } from '../types';

// `pos`: coordenadas na planta SVG (viewBox 1000×680). Antes ficavam hardcoded
// em MapaUnidade.tsx; agora moram no próprio dado da sala, permitindo cadastro.
export const mockSalas: Sala[] = [
  { id: 'recepcao', nome: 'Recepção Principal', tipo: 'recepcao', svgId: 'room_recepcao', capacidade: 3, cargosRecomendados: ['recepcionista', 'administrativo'], pos: { x: 30, y: 30, w: 250, h: 140 } },
  { id: 'acolhimento', nome: 'Acolhimento', tipo: 'procedimento', svgId: 'room_acolhimento', capacidade: 2, cargosRecomendados: ['enfermeiro', 'tec_enfermagem'], pos: { x: 290, y: 30, w: 140, h: 140 } },
  { id: 'triagem', nome: 'Triagem', tipo: 'procedimento', svgId: 'room_triagem', capacidade: 2, cargosRecomendados: ['enfermeiro', 'tec_enfermagem'], pos: { x: 440, y: 30, w: 140, h: 140 } },
  { id: 'vacina', nome: 'Sala de Vacina', tipo: 'procedimento', svgId: 'room_vacina', capacidade: 2, cargosRecomendados: ['tec_enfermagem', 'enfermeiro'], pos: { x: 590, y: 30, w: 180, h: 140 } },
  { id: 'curativo', nome: 'Sala de Curativos', tipo: 'procedimento', svgId: 'room_curativo', capacidade: 2, cargosRecomendados: ['tec_enfermagem', 'enfermeiro'], pos: { x: 780, y: 30, w: 190, h: 140 } },
  { id: 'farmacia', nome: 'Farmácia', tipo: 'apoio', svgId: 'room_farmacia', capacidade: 2, cargosRecomendados: ['farmaceutico', 'administrativo'], pos: { x: 30, y: 180, w: 190, h: 140 } },
  { id: 'almoxarifado', nome: 'Almoxarifado', tipo: 'apoio', svgId: 'room_almoxarifado', capacidade: 1, cargosRecomendados: ['administrativo'], pos: { x: 230, y: 180, w: 140, h: 140 } },

  // 8 Consultórios Médicos
  { id: 'consultorio_1', nome: 'Consultório 1 (Med)', tipo: 'consultorio', svgId: 'room_cons_1', capacidade: 1, cargosRecomendados: ['medico'], pos: { x: 30, y: 330, w: 110, h: 150 } },
  { id: 'consultorio_2', nome: 'Consultório 2 (Med)', tipo: 'consultorio', svgId: 'room_cons_2', capacidade: 1, cargosRecomendados: ['medico'], pos: { x: 150, y: 330, w: 110, h: 150 } },
  { id: 'consultorio_3', nome: 'Consultório 3 (Med)', tipo: 'consultorio', svgId: 'room_cons_3', capacidade: 1, cargosRecomendados: ['medico'], pos: { x: 270, y: 330, w: 110, h: 150 } },
  { id: 'consultorio_4', nome: 'Consultório 4 (Med)', tipo: 'consultorio', svgId: 'room_cons_4', capacidade: 1, cargosRecomendados: ['medico'], pos: { x: 390, y: 330, w: 110, h: 150 } },
  { id: 'consultorio_5', nome: 'Consultório 5 (Med)', tipo: 'consultorio', svgId: 'room_cons_5', capacidade: 1, cargosRecomendados: ['medico'], pos: { x: 510, y: 330, w: 110, h: 150 } },
  { id: 'consultorio_6', nome: 'Consultório 6 (Med)', tipo: 'consultorio', svgId: 'room_cons_6', capacidade: 1, cargosRecomendados: ['medico'], pos: { x: 630, y: 330, w: 110, h: 150 } },
  { id: 'consultorio_7', nome: 'Consultório 7 (Med)', tipo: 'consultorio', svgId: 'room_cons_7', capacidade: 1, cargosRecomendados: ['medico'], pos: { x: 750, y: 330, w: 110, h: 150 } },
  { id: 'consultorio_8', nome: 'Consultório 8 (Med)', tipo: 'consultorio', svgId: 'room_cons_8', capacidade: 1, cargosRecomendados: ['medico'], pos: { x: 870, y: 330, w: 100, h: 150 } },

  // Outros consultórios / espaços
  { id: 'cons_odontologico', nome: 'Consultório Odontológico', tipo: 'consultorio', svgId: 'room_cons_odonto', capacidade: 2, cargosRecomendados: ['dentista'], pos: { x: 380, y: 180, w: 200, h: 140 } },
  { id: 'reunioes', nome: 'Sala de Reuniões', tipo: 'administrativo', svgId: 'room_reunioes', capacidade: 4, cargosRecomendados: ['gerente', 'enfermeiro', 'medico', 'farmaceutico', 'administrativo'], pos: { x: 780, y: 180, w: 190, h: 140 } },
  { id: 'gerencia', nome: 'Administração / Gerência', tipo: 'administrativo', svgId: 'room_gerencia', capacidade: 2, cargosRecomendados: ['gerente', 'administrativo'], pos: { x: 30, y: 490, w: 940, h: 140 } },
  { id: 'copa', nome: 'Copa / Área de Descanso', tipo: 'apoio', svgId: 'room_copa', capacidade: 5, cargosRecomendados: [], pos: { x: 590, y: 180, w: 180, h: 140 } }
];
