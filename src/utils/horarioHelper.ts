/**
 * Utilitários de horário no formato 'HH:MM'. Como os horários são zero-padded,
 * a comparação numérica em minutos é suficiente (não há fuso/data envolvidos).
 */

export const horaParaMinutos = (hora: string): number => {
  const [hh, mm] = hora.split(':').map(Number);
  return hh * 60 + mm;
};

export const minutosParaHora = (min: number): string => {
  const hh = Math.floor(min / 60).toString().padStart(2, '0');
  const mm = (min % 60).toString().padStart(2, '0');
  return `${hh}:${mm}`;
};

/** Os intervalos [aIni, aFim) e [bIni, bFim) se sobrepõem? */
export const intervalosSobrepoem = (
  aIni: string,
  aFim: string,
  bIni: string,
  bFim: string,
): boolean =>
  horaParaMinutos(aIni) < horaParaMinutos(bFim) &&
  horaParaMinutos(bIni) < horaParaMinutos(aFim);

/** O profissional está trabalhando no horário de referência? (fim exclusivo) */
export const ativoNoHorario = (
  funcionario: { horario: { inicio: string; fim: string } },
  referencia: string,
): boolean => {
  const ref = horaParaMinutos(referencia);
  return (
    ref >= horaParaMinutos(funcionario.horario.inicio) &&
    ref < horaParaMinutos(funcionario.horario.fim)
  );
};

/** Limites do seletor de horário de referência (06:00–20:00, passo de 30 min). */
export const HORARIO_MIN = 6 * 60;
export const HORARIO_MAX = 20 * 60;
export const HORARIO_PASSO = 30;
