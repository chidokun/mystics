import { stripDiacritics } from '../../../lib/text';

/**
 * Thần số học Pythagoras theo cách tính phổ biến tại Việt Nam
 * (dựa trên hệ thống của David A. Phillips).
 */

export interface BirthDate {
  day: number;
  month: number;
  year: number;
}

export const MASTER_NUMBERS = [11, 22, 33];

const digitsOf = (n: number): number[] => String(n).split('').map(Number);
export const digitSum = (n: number): number => digitsOf(n).reduce((a, b) => a + b, 0);

/** Rút gọn về một chữ số, giữ nguyên các số trong `keep` (mặc định 11, 22, 33). */
export function reduce(n: number, keep: number[] = MASTER_NUMBERS): number {
  let x = n;
  while (x > 9 && !keep.includes(x)) x = digitSum(x);
  return x;
}

/** Rút gọn hoàn toàn về 1–9 */
export const reduceFully = (n: number): number => reduce(n, []);

export function isValidDate({ day, month, year }: BirthDate): boolean {
  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) return false;
  if (year < 1800 || year > 2200 || month < 1 || month > 12 || day < 1) return false;
  return day <= new Date(year, month, 0).getDate();
}

export const dateDigits = ({ day, month, year }: BirthDate): number[] => [
  ...digitsOf(day),
  ...digitsOf(month),
  ...digitsOf(year),
];

/**
 * Số chủ đạo: cộng mọi chữ số của ngày sinh, rút gọn tới khi ≤ 11 hoặc bằng 22.
 * Vì vậy kết quả nằm trong 2–11 hoặc 22 (số 10 được giữ nguyên).
 */
export function lifePath(date: BirthDate): number {
  let n = dateDigits(date).reduce((a, b) => a + b, 0);
  while (n > 11 && n !== 22) n = digitSum(n);
  return n;
}

export const formatNumber = (n: number): string => (n === 22 ? '22/4' : n === 33 ? '33/6' : String(n));

// ---------- Tên ----------

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U', 'Y']);

/** Chuẩn hóa họ tên: bỏ dấu, viết hoa, chỉ giữ chữ cái Latin. */
export function nameWords(fullName: string): string[] {
  return stripDiacritics(fullName)
    .toUpperCase()
    .replace(/[^A-Z\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/** A–I = 1–9, J–R = 1–9, S–Z = 1–8 */
export const letterValue = (ch: string): number => ((ch.charCodeAt(0) - 65) % 9) + 1;

export const isVowel = (ch: string): boolean => VOWELS.has(ch);

const sumLetters = (letters: string[]) => letters.reduce((s, ch) => s + letterValue(ch), 0);

export function nameNumbers(fullName: string) {
  const words = nameWords(fullName);
  const letters = words.join('').split('');
  const vowels = letters.filter(isVowel);
  const consonants = letters.filter((ch) => !isVowel(ch));
  return {
    words,
    letters,
    /** Số sứ mệnh (Expression / Destiny) */
    expression: reduce(sumLetters(letters)),
    /** Số linh hồn (Soul Urge) — các nguyên âm */
    soul: reduce(sumLetters(vowels)),
    /** Số nhân cách (Personality) — các phụ âm */
    personality: reduce(sumLetters(consonants)),
    /** Số cân bằng — chữ cái đầu mỗi từ */
    balance: reduceFully(sumLetters(words.map((w) => w[0]))),
  };
}

// ---------- Biểu đồ ----------

export type DigitCounts = Record<number, number>;

const emptyCounts = (): DigitCounts => ({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 });

export function birthChart(date: BirthDate): DigitCounts {
  const counts = emptyCounts();
  for (const d of dateDigits(date)) if (d > 0) counts[d]++;
  return counts;
}

export function nameChart(fullName: string): DigitCounts {
  const counts = emptyCounts();
  for (const ch of nameWords(fullName).join('')) counts[letterValue(ch)]++;
  return counts;
}

export function combineCharts(a: DigitCounts, b: DigitCounts): DigitCounts {
  const counts = emptyCounts();
  for (let d = 1; d <= 9; d++) counts[d] = a[d] + b[d];
  return counts;
}

/** Vị trí ô trong lưới 3×3: hàng trên 3-6-9, giữa 2-5-8, dưới 1-4-7 */
export const gridPosition = (digit: number) => ({
  col: Math.floor((digit - 1) / 3),
  row: 2 - ((digit - 1) % 3),
});

export const ARROW_LINES = ['123', '456', '789', '147', '258', '369', '159', '357'] as const;
export type ArrowLine = (typeof ARROW_LINES)[number];

export function findArrows(counts: DigitCounts): { full: ArrowLine[]; empty: ArrowLine[] } {
  const full: ArrowLine[] = [];
  const empty: ArrowLine[] = [];
  for (const line of ARROW_LINES) {
    const digits = line.split('').map(Number);
    if (digits.every((d) => counts[d] > 0)) full.push(line);
    else if (digits.every((d) => counts[d] === 0)) empty.push(line);
  }
  return { full, empty };
}

// ---------- Chu kỳ ----------

export function personalYear(date: BirthDate, year: number): number {
  return reduceFully(digitSum(date.day) + digitSum(date.month) + digitSum(year));
}

/** Năm thế giới: cộng các chữ số của năm dương lịch, rút gọn về 1–9 */
export const worldYear = (year: number): number => reduceFully(digitSum(year));

export function personalMonth(date: BirthDate, year: number, month: number): number {
  return reduceFully(personalYear(date, year) + month);
}

export function ageOn(date: BirthDate, today: Date): number {
  let age = today.getFullYear() - date.year;
  const m = today.getMonth() + 1;
  if (m < date.month || (m === date.month && today.getDate() < date.day)) age--;
  return age;
}

export interface Peak {
  /** Tuổi bắt đầu đỉnh */
  age: number;
  year: number;
  pinnacle: number;
  challenge: number;
}

/**
 * Bốn đỉnh cao và thử thách. Đỉnh 1 đến ở tuổi 36 trừ số chủ đạo (rút về 1 chữ số),
 * các đỉnh sau cách nhau 9 năm.
 */
/** Ba số gốc của bốn đỉnh cao và thử thách: ngày, tháng, năm sinh đã rút gọn */
export function peakBase(date: BirthDate) {
  return { day: reduceFully(date.day), month: reduceFully(date.month), year: reduceFully(digitSum(date.year)) };
}

export function peaks(date: BirthDate): Peak[] {
  const lp = reduceFully(lifePath(date));
  const firstAge = 36 - lp;
  const { day: d, month: m, year: y } = peakBase(date);
  const keep = [11, 22];

  const p1 = reduce(d + m, keep);
  const p2 = reduce(d + y, keep);
  const p3 = reduce(reduceFully(p1) + reduceFully(p2), keep);
  const p4 = reduce(m + y, keep);

  const c1 = Math.abs(d - m);
  const c2 = Math.abs(d - y);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(m - y);

  return [
    [p1, c1],
    [p2, c2],
    [p3, c3],
    [p4, c4],
  ].map(([pinnacle, challenge], i) => {
    const age = firstAge + i * 9;
    return { age, year: date.year + age, pinnacle, challenge };
  });
}

// ---------- Tổng hợp ----------

export interface NumerologyProfile {
  name: string;
  date: BirthDate;
  lifePath: number;
  expression: number;
  soul: number;
  personality: number;
  balance: number;
  birthday: number;
  attitude: number;
  maturity: number;
  personalYear: number;
  personalMonth: number;
  /** Số xuất hiện nhiều nhất trong tên */
  passion: number[];
  /** Các số không có trong tên */
  missingInName: number[];
  charts: { birth: DigitCounts; name: DigitCounts; combined: DigitCounts };
  peaks: Peak[];
  age: number;
}

export function buildProfile(fullName: string, date: BirthDate, today = new Date()): NumerologyProfile {
  const lp = lifePath(date);
  const names = nameNumbers(fullName);
  const birth = birthChart(date);
  const name = nameChart(fullName);
  const year = today.getFullYear();
  const max = Math.max(...Object.values(name));

  return {
    name: fullName.trim(),
    date,
    lifePath: lp,
    expression: names.expression,
    soul: names.soul,
    personality: names.personality,
    balance: names.balance,
    birthday: reduce(date.day, [11, 22]),
    attitude: reduce(digitSum(date.day) + digitSum(date.month), [11, 22]),
    maturity: reduce(reduceFully(lp) + reduceFully(names.expression)),
    personalYear: personalYear(date, year),
    personalMonth: personalMonth(date, year, today.getMonth() + 1),
    passion: max > 0 ? [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => name[d] === max) : [],
    missingInName: [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => name[d] === 0),
    charts: { birth, name, combined: combineCharts(birth, name) },
    peaks: peaks(date),
    age: ageOn(date, today),
  };
}
