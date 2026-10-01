import { randomInt } from '../../../lib/random';
import { getHexagram, HEXAGRAMS, type Hexagram } from '../data/hexagrams';
import { getTrigram, trigramFromLines, trigramFromNumber } from '../data/trigrams';

/**
 * Giá trị một hào khi gieo ba đồng xu (mặt dương = 3, mặt âm = 2):
 * 6 lão âm (động), 7 thiếu dương, 8 thiếu âm, 9 lão dương (động).
 */
export type LineValue = 6 | 7 | 8 | 9;

export const isYang = (v: LineValue) => v === 7 || v === 9;
export const isMoving = (v: LineValue) => v === 6 || v === 9;

/** Sáu hào từ dưới lên, true là dương */
export type Lines = boolean[];

export function hexagramFromLines(lines: Lines): Hexagram {
  const lower = trigramFromLines(lines.slice(0, 3));
  const upper = trigramFromLines(lines.slice(3, 6));
  const found = HEXAGRAMS.find((h) => h.lower === lower.id && h.upper === upper.id);
  if (!found) throw new Error('Không tìm thấy quẻ');
  return found;
}

export const linesOf = (hx: Hexagram): Lines => [...getTrigram(hx.lower).lines, ...getTrigram(hx.upper).lines];

/** Quẻ hỗ: hào 2-3-4 làm quái dưới, hào 3-4-5 làm quái trên */
export const nuclearOf = (lines: Lines) => hexagramFromLines([...lines.slice(1, 4), ...lines.slice(2, 5)]);

/** Quẻ tổng (đảo ngược): lật quẻ từ trên xuống */
export const inverseOf = (lines: Lines) => hexagramFromLines([...lines].reverse());

/** Quẻ thác (đối): đổi âm thành dương và ngược lại */
export const oppositeOf = (lines: Lines) => hexagramFromLines(lines.map((l) => !l));

// ---------- Gieo quẻ ----------

/** Ba đồng xu: true là mặt dương (3 điểm), false là mặt âm (2 điểm) */
export type CoinToss = [boolean, boolean, boolean];

export function tossCoins(rand: (max: number) => number = randomInt): CoinToss {
  return [rand(2) === 1, rand(2) === 1, rand(2) === 1];
}

export const tossValue = (coins: CoinToss): LineValue =>
  coins.reduce<number>((sum, yang) => sum + (yang ? 3 : 2), 0) as LineValue;

/** Mai Hoa Dịch Số: số thứ nhất ra quái trên, số thứ hai ra quái dưới, tổng chia 6 ra hào động */
export function valuesFromNumbers(a: number, b: number): LineValue[] {
  const upper = trigramFromNumber(a);
  const lower = trigramFromNumber(b);
  const moving = ((a + b) % 6 || 6) - 1;
  return [...lower.lines, ...upper.lines].map((yang, i) => {
    if (i === moving) return yang ? 9 : 6;
    return yang ? 7 : 8;
  });
}

// ---------- Đọc quẻ ----------

export type Focus =
  | { kind: 'judgment' }
  | { kind: 'line'; line: number }
  | { kind: 'both-judgments' }
  | { kind: 'changed-line'; line: number }
  | { kind: 'all-moving' }
  | { kind: 'changed-judgment' };

export interface CastResult {
  values: LineValue[];
  primary: Hexagram;
  /** Quẻ biến, khi có hào động */
  changed?: Hexagram;
  nuclear: Hexagram;
  /** Vị trí các hào động, 0 là hào dưới cùng */
  moving: number[];
  focus: Focus;
}

/**
 * Chọn phần lời cần đọc theo số hào động (quy tắc của Chu Hy):
 * 0 hào: lời quẻ chủ · 1 hào: hào đó · 2 hào: hào trên · 3 hào: lời cả hai quẻ, quẻ chủ làm chính ·
 * 4 hào: hào tĩnh dưới của quẻ biến · 5 hào: hào tĩnh duy nhất của quẻ biến ·
 * 6 hào: Càn, Khôn đọc lời "dụng"; quẻ khác đọc lời quẻ biến.
 */
export function focusFor(primary: Hexagram, moving: number[]): Focus {
  const still = [0, 1, 2, 3, 4, 5].filter((i) => !moving.includes(i));
  switch (moving.length) {
    case 0:
      return { kind: 'judgment' };
    case 1:
      return { kind: 'line', line: moving[0] };
    case 2:
      return { kind: 'line', line: Math.max(...moving) };
    case 3:
      return { kind: 'both-judgments' };
    case 4:
      return { kind: 'changed-line', line: Math.min(...still) };
    case 5:
      return { kind: 'changed-line', line: still[0] };
    default:
      return primary.allMoving ? { kind: 'all-moving' } : { kind: 'changed-judgment' };
  }
}

export function readCast(values: LineValue[]): CastResult {
  if (values.length !== 6) throw new Error('Cần đủ sáu hào');
  const lines = values.map(isYang);
  const moving = values.flatMap((v, i) => (isMoving(v) ? [i] : []));
  const primary = hexagramFromLines(lines);
  const changed = moving.length ? hexagramFromLines(lines.map((l, i) => (moving.includes(i) ? !l : l))) : undefined;
  return {
    values,
    primary,
    changed,
    nuclear: nuclearOf(lines),
    moving,
    focus: focusFor(primary, moving),
  };
}

export const LINE_NAMES = ['Hào sơ', 'Hào nhị', 'Hào tam', 'Hào tứ', 'Hào ngũ', 'Hào thượng'];

/** Tên hào truyền thống: Sơ cửu, Lục nhị, Thượng lục… */
export function lineTitle(index: number, yang: boolean): string {
  const num = yang ? 'cửu' : 'lục';
  if (index === 0) return `Sơ ${num}`;
  if (index === 5) return `Thượng ${num}`;
  const pos = ['', 'nhị', 'tam', 'tứ', 'ngũ'][index];
  return `${yang ? 'Cửu' : 'Lục'} ${pos}`;
}

export { getHexagram };
