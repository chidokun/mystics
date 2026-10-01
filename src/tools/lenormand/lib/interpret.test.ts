import { describe, expect, it } from 'vitest';
import { CARDS, TOPICS } from '../data/cards';
import { SPREADS } from '../data/spreads';
import { grandCoord, interpret, pairText, readingToText } from './interpret';
import { drawCards, shuffle } from './shuffle';

/** Bộ sinh số giả ngẫu nhiên có seed để test lặp lại được */
function seeded(seed: number) {
  let s = seed;
  return (max: number) => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s % max;
  };
}

describe('dữ liệu', () => {
  it('có đủ 36 lá theo đúng thứ tự', () => {
    expect(CARDS).toHaveLength(36);
    CARDS.forEach((c, i) => expect(c.id).toBe(i + 1));
  });
  it('mỗi kiểu trải có vị trí không trùng nhau', () => {
    for (const s of SPREADS) {
      const keys = s.positions.map((p) => `${p.col}-${p.row}`);
      expect(new Set(keys).size).toBe(keys.length);
    }
  });
});

describe('xào bài', () => {
  it('rút đủ số lá, không trùng', () => {
    const cards = drawCards(36);
    expect(new Set(cards).size).toBe(36);
    expect(drawCards(5)).toHaveLength(5);
  });
  it('giữ nguyên mảng gốc', () => {
    const src = [1, 2, 3];
    shuffle(src, seeded(1));
    expect(src).toEqual([1, 2, 3]);
  });
});

describe('diễn giải', () => {
  it('chạy được với mọi kiểu trải và chủ đề', () => {
    for (let seed = 1; seed <= 40; seed++) {
      for (const spread of SPREADS) {
        const cards = drawCards(spread.positions.length, seeded(seed));
        for (const t of TOPICS) {
          const reading = interpret({ spread, cards, topic: t.id, significator: seed % 2 ? 28 : 29 });
          expect(reading.overview.length).toBeGreaterThan(0);
          expect(reading.sections.length).toBeGreaterThan(0);
          expect(readingToText('Câu hỏi?', spread, cards, reading)).toContain(spread.name);
        }
      }
    }
  });

  it('dùng nghĩa riêng cho cặp đặc biệt', () => {
    expect(pairText(24, 25)).toMatch(/Cam kết tình cảm/);
    expect(pairText(25, 24)).toMatch(/Cam kết tình cảm/);
    expect(pairText(1, 6)).toBe('Tin tức, một sự xuất hiện mới — còn mờ mịt, chưa rõ ràng.');
  });

  it('trả lời Có khi các lá đều thuận', () => {
    const spread = SPREADS.find((s) => s.id === 'yesno')!;
    const r = interpret({ spread, cards: [31, 33, 24], topic: 'general' });
    expect(r.verdict?.tone).toBe('yes');
    const r2 = interpret({ spread, cards: [8, 21, 36], topic: 'general' });
    expect(r2.verdict?.tone).toBe('no');
  });

  it('đặt hàng định mệnh của Đại Trải Bài ở giữa', () => {
    expect(grandCoord(0)).toEqual({ row: 0, col: 0 });
    expect(grandCoord(31)).toEqual({ row: 3, col: 7 });
    expect(grandCoord(32)).toEqual({ row: 4, col: 2 });
    expect(grandCoord(35)).toEqual({ row: 4, col: 5 });
  });
});
