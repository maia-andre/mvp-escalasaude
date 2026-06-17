import { CargoType, VinculoType } from '../types';
import { 
  Stethoscope, 
  UserSquare2, 
  Pill, 
  UserCog, 
  ShieldCheck, 
  Contact, 
  Activity, 
  GraduationCap 
} from 'lucide-react';

export const getCargoLabel = (cargo: CargoType): string => {
  const labels: Record<CargoType, string> = {
    medico: 'Médico(a)',
    enfermeiro: 'Enfermeiro(a)',
    farmaceutico: 'Farmacêutico(a)',
    recepcionista: 'Recepcionista',
    dentista: 'Dentista / Odonto',
    tec_enfermagem: 'Téc. de Enfermagem',
    administrativo: 'Aux. Administrativo',
    gerente: 'Gerente da Unidade'
  };
  return labels[cargo];
};

export const getCargoIcon = (cargo: CargoType, size = 14) => {
  switch (cargo) {
    case 'medico':
      return Stethoscope;
    case 'enfermeiro':
      return GraduationCap;
    case 'farmaceutico':
      return Pill;
    case 'recepcionista':
      return Contact;
    case 'dentista':
      return ShieldCheck;
    case 'tec_enfermagem':
      return Activity;
    case 'administrativo':
      return UserCog;
    case 'gerente':
      return UserSquare2;
  }
};

export const getCargoColorClass = (cargo: CargoType): string => {
  const classes: Record<CargoType, string> = {
    medico: 'bg-red-500/10 text-red-400 border-red-500/30',
    enfermeiro: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    farmaceutico: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    recepcionista: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dentista: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    tec_enfermagem: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    administrativo: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    gerente: 'bg-pink-500/10 text-pink-400 border-pink-500/30'
  };
  return classes[cargo];
};

export const getVinculoLabel = (vinculo: VinculoType): string => {
  const labels: Record<VinculoType, string> = {
    efetivo: 'Efetivo',
    urbam: 'URBAM',
    terceirizada: 'Terceirizada'
  };
  return labels[vinculo];
};

export const getVinculoBadgeClass = (vinculo: VinculoType): string => {
  const classes: Record<VinculoType, string> = {
    efetivo: 'bg-slate-800 text-slate-300 border-slate-700',
    urbam: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50',
    terceirizada: 'bg-amber-950/80 text-amber-300 border-amber-800/50'
  };
  return classes[vinculo];
};

// Listas para selects/multiselects de cadastro.
export const CARGOS_DISPONIVEIS: CargoType[] = [
  'medico',
  'enfermeiro',
  'tec_enfermagem',
  'farmaceutico',
  'dentista',
  'recepcionista',
  'administrativo',
  'gerente',
];

export const VINCULOS_DISPONIVEIS: VinculoType[] = ['efetivo', 'urbam', 'terceirizada'];
