import { describe, expect, it } from 'vitest';
import { seededRandom } from '../../../lib/random';
import { CARDS, cardNumeral, getTarotCard, TOPICS } from '../data/cards';
import { TAROT_SPREADS } from '../data/spreads';
import { drawTarot, readTarot, scoreOf, tarotToText } from './interpret';

describe('bộ bài', () => {
  it('đủ 78 lá, mã liên tục từ 0', () => {
    expect(CARDS).toHaveLength(78);
    CARDS.forEach((c, i) => expect(c.id).toBe(i));
  });

  it('22 lá Ẩn chính và 14 lá mỗi chất', () => {
    expect(CARDS.filter((c) => c.arcana === 'major')).toHaveLength(22);
    for (const suit of ['wands', 'cups', 'swords', 'pentacles']) {
      const cards = CARDS.filter((c) => c.suit === suit);
      expect(cards.map((c) => c.rank)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
    }
  });

  it('đặt tên lá Ẩn phụ đúng', () => {
    expect(getTarotCard(22).name).toBe('Át Gậy');
    expect(getTarotCard(22).en).toBe('Ace of Wands');
    expect(getTarotCard(49).name).toBe('Vua Cốc');
    expect(getTarotCard(77).en).toBe('King of Pentacles');
    expect(cardNumeral(getTarotCard(0))).toBe('0');
    expect(cardNumeral(getTarotCard(21))).toBe('XXI');
    expect(cardNumeral(getTarotCard(60))).toBe('Tiểu Đồng');
  });

  it('mỗi lá có đủ nghĩa xuôi và ngược cho mọi chủ đề', () => {
    for (const c of CARDS) {
      for (const t of TOPICS) {
        expect(c.up[t.id].length, c.name).toBeGreaterThan(5);
        expect(c.rev[t.id].length, c.name).toBeGreaterThan(5);
      }
    }
  });
});

describe('rút bài', () => {
  it('không trùng lá, tôn trọng tùy chọn lá ngược', () => {
    const rand = seededRandom(5);
    const cards = drawTarot(78, true, rand);
    expect(new Set(cards.map((c) => c.id)).size).toBe(78);
    expect(cards.some((c) => c.reversed)).toBe(true);
    expect(drawTarot(10, false, rand).every((c) => !c.reversed)).toBe(true);
  });

  it('lá ngược đảo chiều điểm thuận lợi', () => {
    expect(scoreOf({ id: 19, reversed: false })).toBe(1);
    expect(scoreOf({ id: 19, reversed: true })).toBeLessThan(0);
    expect(scoreOf({ id: 16, reversed: true })).toBeGreaterThan(0);
  });
});

describe('diễn giải', () => {
  it('chạy được với mọi cách trải và chủ đề', () => {
    for (let seed = 1; seed <= 30; seed++) {
      for (const spread of TAROT_SPREADS) {
        const cards = drawTarot(spread.positions.length, true, seededRandom(seed));
        for (const t of TOPICS) {
          const r = readTarot({ spread, cards, topic: t.id });
          expect(r.overview.length).toBeGreaterThan(0);
          expect(r.sections.length).toBeGreaterThan(0);
          expect(tarotToText('Hỏi?', spread, cards, r)).toContain(spread.name);
        }
      }
    }
  });

  it('trả lời Có khi các lá đều thuận và xuôi', () => {
    const spread = TAROT_SPREADS.find((s) => s.id === 'yesno')!;
    const yes = readTarot({
      spread,
      topic: 'general',
      cards: [19, 21, 17].map((id) => ({ id, reversed: false })),
    });
    expect(yes.verdict?.tone).toBe('yes');
    const no = readTarot({
      spread,
      topic: 'general',
      cards: [16, 13, 15].map((id) => ({ id, reversed: false })),
    });
    expect(no.verdict?.tone).toBe('no');
  });
});
