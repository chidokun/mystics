import { describe, expect, it } from 'vitest';
import { seededRandom } from '../../../lib/random';
import { HEXAGRAMS } from '../data/hexagrams';
import { getTrigram, trigramFromNumber, TRIGRAMS } from '../data/trigrams';
import {
  focusFor,
  hexagramFromLines,
  inverseOf,
  lineTitle,
  linesOf,
  nuclearOf,
  oppositeOf,
  readCast,
  tossCoins,
  tossValue,
  valuesFromNumbers,
  type LineValue,
} from './iching';

const byNumber = (n: number) => HEXAGRAMS[n - 1];

describe('dữ liệu 64 quẻ', () => {
  it('đủ 64 quẻ đúng thứ tự Văn Vương', () => {
    expect(HEXAGRAMS).toHaveLength(64);
    HEXAGRAMS.forEach((h, i) => expect(h.n).toBe(i + 1));
  });

  it('mỗi cặp quái trên/dưới chỉ xuất hiện một lần', () => {
    const keys = new Set(HEXAGRAMS.map((h) => `${h.upper}/${h.lower}`));
    expect(keys.size).toBe(64);
  });

  it('tên quẻ khớp với quái trên và quái dưới', () => {
    for (const h of HEXAGRAMS) {
      const [first, second] = h.name.split(' ');
      if (first === 'Thuần') {
        expect(h.upper, h.name).toBe(h.lower);
        expect(second, h.name).toBe(getTrigram(h.upper).name);
      } else {
        expect(first, h.name).toBe(getTrigram(h.upper).nature);
        expect(second, h.name).toBe(getTrigram(h.lower).nature);
      }
    }
  });

  it('mỗi quẻ có đủ sáu hào', () => {
    for (const h of HEXAGRAMS) expect(h.lines.every((l) => l.length > 5)).toBe(true);
  });
});

describe('quan hệ giữa các quẻ', () => {
  it('đọc quẻ từ sáu hào', () => {
    // Truân: Chấn dưới (dương ở đáy), Khảm trên
    expect(hexagramFromLines([true, false, false, false, true, false]).n).toBe(3);
    expect(hexagramFromLines(Array(6).fill(true)).n).toBe(1);
    expect(hexagramFromLines(Array(6).fill(false)).n).toBe(2);
  });

  it('quẻ hỗ, quẻ tổng, quẻ thác', () => {
    expect(nuclearOf(linesOf(byNumber(63))).n).toBe(64);
    expect(nuclearOf(linesOf(byNumber(1))).n).toBe(1);
    expect(inverseOf(linesOf(byNumber(3))).n).toBe(4);
    expect(inverseOf(linesOf(byNumber(11))).n).toBe(12);
    expect(oppositeOf(linesOf(byNumber(1))).n).toBe(2);
    expect(oppositeOf(linesOf(byNumber(63))).n).toBe(64);
  });
});

describe('gieo quẻ', () => {
  it('ba đồng xu cho giá trị 6–9', () => {
    const rand = seededRandom(3);
    for (let i = 0; i < 200; i++) expect([6, 7, 8, 9]).toContain(tossValue(tossCoins(rand)));
    expect(tossValue([true, true, true])).toBe(9);
    expect(tossValue([false, false, false])).toBe(6);
  });

  it('hào động đổi âm dương ở quẻ biến', () => {
    // Càn với hào sơ động biến thành Thiên Phong Cấu
    const r = readCast([9, 7, 7, 7, 7, 7]);
    expect(r.primary.n).toBe(1);
    expect(r.changed?.n).toBe(44);
    expect(r.moving).toEqual([0]);
    expect(r.focus).toEqual({ kind: 'line', line: 0 });
  });

  it('không có hào động thì không có quẻ biến', () => {
    const r = readCast([8, 8, 8, 8, 8, 8]);
    expect(r.primary.n).toBe(2);
    expect(r.changed).toBeUndefined();
    expect(r.focus).toEqual({ kind: 'judgment' });
  });

  it('chọn lời trọng tâm theo số hào động', () => {
    const qian = byNumber(1);
    const tun = byNumber(3);
    expect(focusFor(tun, [1, 4])).toEqual({ kind: 'line', line: 4 });
    expect(focusFor(tun, [0, 2, 5])).toEqual({ kind: 'both-judgments' });
    expect(focusFor(tun, [0, 1, 2, 5])).toEqual({ kind: 'changed-line', line: 3 });
    expect(focusFor(tun, [0, 1, 2, 3, 5])).toEqual({ kind: 'changed-line', line: 4 });
    expect(focusFor(qian, [0, 1, 2, 3, 4, 5])).toEqual({ kind: 'all-moving' });
    expect(focusFor(tun, [0, 1, 2, 3, 4, 5])).toEqual({ kind: 'changed-judgment' });
  });

  it('lập quẻ Mai Hoa từ hai con số', () => {
    // 1 → Càn trên, 8 → Khôn dưới: Thiên Địa Bĩ; (1 + 8) % 6 = 3 → hào tam động
    const values = valuesFromNumbers(1, 8);
    const r = readCast(values);
    expect(r.primary.n).toBe(12);
    expect(r.moving).toEqual([2]);
    // số chia hết thì lấy quái số 8 và hào 6
    expect(trigramFromNumber(16).id).toBe('khon');
    expect(readCast(valuesFromNumbers(3, 3)).moving).toEqual([5]);
  });

  it('đặt tên hào đúng cách gọi truyền thống', () => {
    expect(lineTitle(0, true)).toBe('Sơ cửu');
    expect(lineTitle(1, false)).toBe('Lục nhị');
    expect(lineTitle(5, false)).toBe('Thượng lục');
    expect(lineTitle(4, true)).toBe('Cửu ngũ');
  });

  it('mỗi quái có đúng ba hào khác nhau', () => {
    const keys = new Set(TRIGRAMS.map((t) => t.lines.join()));
    expect(keys.size).toBe(8);
  });

  it('chạy được với mọi tổ hợp giá trị ngẫu nhiên', () => {
    const rand = seededRandom(11);
    for (let i = 0; i < 500; i++) {
      const values = Array.from({ length: 6 }, () => tossValue(tossCoins(rand))) as LineValue[];
      const r = readCast(values);
      expect(r.primary.n).toBeGreaterThan(0);
      expect(Boolean(r.changed)).toBe(r.moving.length > 0);
    }
  });
});
