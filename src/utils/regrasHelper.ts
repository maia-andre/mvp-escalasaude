/**
 * Regras de adequação de alocação (avisos brandos — não bloqueiam a ação).
 * O único bloqueio rígido (capacidade) vive no store. Aqui ficam as validações
 * de parametrização do profissional: funções habilitadas e setores permitidos.
 */
import { Funcionario, Sala } from '../types';
import { getCargoLabel } from './cargoHelper';

export type TipoAviso = 'funcao' | 'setor';

export interface AvisoAlocacao {
  tipo: TipoAviso;
  mensagem: string;
}

const primeiroNome = (nome: string): string => {
  const partes = nome.split(' ');
  // Mantém prefixos profissionais (Dr., Enfª., Téc., ...) + o nome seguinte.
  return /\.$/.test(partes[0]) && partes[1] ? `${partes[0]} ${partes[1]}` : partes[0];
};

/** O profissional está habilitado (por função) a atuar nesta sala? */
export const funcaoAdequada = (funcionario: Funcionario, sala: Sala): boolean => {
  if (!sala.cargosRecomendados || sala.cargosRecomendados.length === 0) return true;
  return funcionario.funcoes.some((f) => sala.cargosRecomendados!.includes(f));
};

/** O profissional pode atuar neste setor? (vazio = sem restrição) */
export const setorPermitido = (funcionario: Funcionario, sala: Sala): boolean =>
  funcionario.setoresPermitidos.length === 0 ||
  funcionario.setoresPermitidos.includes(sala.id);

/** Lista de avisos ao alocar `funcionario` em `sala`. Vazia = alocação ideal. */
export const getAvisosAlocacao = (funcionario: Funcionario, sala: Sala): AvisoAlocacao[] => {
  const avisos: AvisoAlocacao[] = [];

  if (!funcaoAdequada(funcionario, sala)) {
    const habilitadas = funcionario.funcoes.map(getCargoLabel).join(', ');
    const recomendadas = (sala.cargosRecomendados ?? []).map(getCargoLabel).join(', ');
    avisos.push({
      tipo: 'funcao',
      mensagem: `Função inadequada: ${primeiroNome(funcionario.nome)} (${habilitadas}) não cobre o recomendado para "${sala.nome}" (${recomendadas}).`,
    });
  }

  if (!setorPermitido(funcionario, sala)) {
    avisos.push({
      tipo: 'setor',
      mensagem: `Setor não permitido: ${primeiroNome(funcionario.nome)} não está parametrizado(a) para atuar em "${sala.nome}".`,
    });
  }

  return avisos;
};
