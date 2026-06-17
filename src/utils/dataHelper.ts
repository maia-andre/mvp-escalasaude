/**
 * Utilitários de data no formato ISO 'YYYY-MM-DD' (sem fuso). As datas são
 * tratadas como locais ao meio-dia para evitar deslocamentos de timezone.
 */

const parse = (iso: string): Date => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const fmt = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/** Segunda-feira da semana que contém a data informada. */
export const inicioDaSemana = (iso: string): string => {
  const date = parse(iso);
  const offset = (date.getDay() + 6) % 7; // dias desde a segunda
  date.setDate(date.getDate() - offset);
  return fmt(date);
};

/** As 7 datas (segunda → domingo) da semana que contém a data informada. */
export const diasDaSemana = (iso: string): string[] => {
  const inicio = parse(inicioDaSemana(iso));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(inicio);
    d.setDate(inicio.getDate() + i);
    return fmt(d);
  });
};

/** Desloca uma data em `n` dias (pode ser negativo). */
export const somarDias = (iso: string, n: number): string => {
  const d = parse(iso);
  d.setDate(d.getDate() + n);
  return fmt(d);
};

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export const rotuloDia = (iso: string): { sigla: string; dia: number; mes: string; fimDeSemana: boolean } => {
  const d = parse(iso);
  const dow = d.getDay();
  return { sigla: DIAS[dow], dia: d.getDate(), mes: MESES[d.getMonth()], fimDeSemana: dow === 0 || dow === 6 };
};

export const ehFimDeSemana = (iso: string): boolean => {
  const dow = parse(iso).getDay();
  return dow === 0 || dow === 6;
};

/** Lista inclusiva de datas entre `ini` e `fim` (vazia se fim < ini). */
export const intervaloDeDias = (ini: string, fim: string): string[] => {
  const dias: string[] = [];
  let atual = ini;
  let guarda = 0;
  while (atual <= fim && guarda < 400) {
    dias.push(atual);
    atual = somarDias(atual, 1);
    guarda++;
  }
  return dias;
};

/** Rótulo curto de uma data, ex.: "Seg, 25 mai". */
export const rotuloDataCurto = (iso: string): string => {
  const r = rotuloDia(iso);
  return `${r.sigla}, ${String(r.dia).padStart(2, '0')} ${r.mes}`;
};

/** Rótulo do intervalo da semana, ex.: "25 mai – 31 mai 2026". */
export const rotuloSemana = (iso: string): string => {
  const dias = diasDaSemana(iso);
  const ini = rotuloDia(dias[0]);
  const fim = rotuloDia(dias[6]);
  const ano = parse(dias[6]).getFullYear();
  return `${ini.dia} ${ini.mes} – ${fim.dia} ${fim.mes} ${ano}`;
};
