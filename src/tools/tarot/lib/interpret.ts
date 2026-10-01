import { randomInt, shuffle } from '../../../lib/random';
import { CARDS, getTarotCard, NUMBER_THEMES, SUITS, type TarotCard, type TarotSuit, type TarotTopic } from '../data/cards';
import type { TarotSpread } from '../data/spreads';

export interface Drawn {
  id: number;
  reversed: boolean;
}

export interface TarotItem {
  label?: string;
  cards: Drawn[];
  text: string;
}

export interface TarotSection {
  title: string;
  intro?: string;
  items: TarotItem[];
}

export type VerdictTone = 'yes' | 'lean-yes' | 'unclear' | 'lean-no' | 'no';

export interface TarotReading {
  overview: string[];
  verdict?: { tone: VerdictTone; label: string; detail: string };
  sections: TarotSection[];
  advice: { card: Drawn; text: string };
}

const DECK = CARDS.map((c) => c.id);

/** Xào cả bộ 78 lá; mỗi lá có `reversedChance` khả năng bị ngược. */
export function drawTarot(count: number, withReversed: boolean, rand: (max: number) => number = randomInt): Drawn[] {
  return shuffle(DECK, rand)
    .slice(0, count)
    .map((id) => ({ id, reversed: withReversed && rand(2) === 1 }));
}

export const meaningOf = (d: Drawn, topic: TarotTopic) => {
  const c = getTarotCard(d.id);
  return d.reversed ? c.rev[topic] : c.up[topic];
};

export const keywordOf = (d: Drawn) => {
  const c = getTarotCard(d.id);
  return (d.reversed ? c.reversedKeywords : c.keywords)[0];
};

/** Điểm thuận lợi của một lá: chiều xuôi giữ nguyên, chiều ngược đảo dấu và yếu đi một nửa. */
export function scoreOf(d: Drawn): number {
  const { yes } = getTarotCard(d.id);
  if (!d.reversed) return yes;
  return yes === 0 ? -0.5 : -yes * 0.5;
}

const nameOf = (d: Drawn) => `${getTarotCard(d.id).name}${d.reversed ? ' (ngược)' : ''}`;

// ---------- Tổng quan ----------

function overview(drawn: Drawn[]): string[] {
  const cards = drawn.map((d) => getTarotCard(d.id));
  const n = cards.length;
  const out: string[] = [];

  const avg = drawn.reduce((s, d) => s + scoreOf(d), 0) / n;
  if (avg >= 0.6) out.push('Năng lượng chung rất thuận lợi; các lá phần lớn mang tín hiệu tích cực.');
  else if (avg >= 0.2) out.push('Năng lượng chung khá tích cực, dù vẫn có điểm cần lưu ý.');
  else if (avg > -0.2) out.push('Năng lượng chung cân bằng — kết quả phụ thuộc nhiều vào lựa chọn của bạn.');
  else if (avg > -0.6) out.push('Trải bài cho thấy có trở ngại; mọi việc cần thêm kiên nhẫn.');
  else out.push('Đây là giai đoạn nhiều thử thách. Phần lời khuyên sẽ cho biết nên tập trung vào đâu.');

  if (n >= 3) {
    const majors = cards.filter((c) => c.arcana === 'major').length;
    if (majors / n >= 0.5)
      out.push(`Có ${majors}/${n} lá Ẩn chính: đây là giai đoạn mang tính bước ngoặt, gắn với những bài học lớn trong đời.`);
    else if (majors === 0) out.push('Không có lá Ẩn chính nào: chuyện này thuộc về đời sống hằng ngày và nằm trong tầm tay bạn.');

    const counts = new Map<TarotSuit, number>();
    for (const c of cards) if (c.suit) counts.set(c.suit, (counts.get(c.suit) ?? 0) + 1);
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    if (top && top[1] >= 2 && top[1] / n >= 0.4) {
      const s = SUITS[top[0]];
      out.push(`Nhiều lá ${s.name} (nguyên tố ${s.element}): câu chuyện xoay quanh ${s.theme}.`);
    }

    const reversed = drawn.filter((d) => d.reversed).length;
    if (reversed / n >= 0.5)
      out.push(`Có ${reversed}/${n} lá ngược: năng lượng đang bị chặn hoặc hướng vào bên trong; hãy xem điều gì đang cản bạn.`);

    const courts = cards.filter((c) => c.arcana === 'minor' && c.rank >= 11).length;
    if (courts >= 2) out.push(`Có ${courts} lá hoàng gia: nhiều người đang tham gia vào chuyện này, hoặc bạn đang phải đóng nhiều vai.`);

    const ranks = new Map<number, number>();
    for (const c of cards) if (c.arcana === 'minor' && c.rank <= 10) ranks.set(c.rank, (ranks.get(c.rank) ?? 0) + 1);
    for (const [rank, count] of ranks) {
      if (count >= 2) out.push(`Số ${rank} xuất hiện ${count} lần: chủ đề ${NUMBER_THEMES[rank]} được nhấn mạnh.`);
    }
  }
  return out;
}

// ---------- Theo vị trí ----------

function positionItems(spread: TarotSpread, drawn: Drawn[], topic: TarotTopic, idx?: number[]): TarotItem[] {
  return (idx ?? drawn.map((_, i) => i)).map((i) => ({
    label: spread.positions[i].label,
    cards: [drawn[i]],
    text: meaningOf(drawn[i], topic),
  }));
}

const adviceOf = (d: Drawn) => {
  const c = getTarotCard(d.id);
  return {
    card: d,
    text: d.reversed ? `${c.advice} Lá ngược nhắc bạn gỡ bỏ điều đang cản trở trước đã: ${c.reversedKeywords.join(', ')}.` : c.advice,
  };
};

// ---------- Tương hợp nguyên tố (dùng cho trải bài tình yêu) ----------

const ELEMENT_OF: Record<TarotSuit, 'fire' | 'water' | 'air' | 'earth'> = {
  wands: 'fire',
  cups: 'water',
  swords: 'air',
  pentacles: 'earth',
};

function elementRelation(a: TarotCard, b: TarotCard): string {
  if (a.arcana === 'major' || b.arcana === 'major')
    return 'Có lá Ẩn chính: mối liên hệ này mang tính định mệnh, vượt lên trên tính cách thường ngày.';
  const ea = ELEMENT_OF[a.suit!];
  const eb = ELEMENT_OF[b.suit!];
  if (ea === eb) return `Cùng nguyên tố ${SUITS[a.suit!].element}: hai người đồng điệu, hiểu nhau nhanh.`;
  const pair = [ea, eb].sort().join('-');
  if (pair === 'air-fire' || pair === 'earth-water') return 'Hai nguyên tố bổ sung cho nhau: mỗi người mang đến điều người kia thiếu.';
  if (pair === 'fire-water' || pair === 'air-earth') return 'Hai nguyên tố dễ xung khắc: cần nhiều thấu hiểu để không dập tắt nhau.';
  return 'Hai nguyên tố trung tính với nhau: hòa hợp được nếu cùng nỗ lực.';
}

// ---------- Đọc từng kiểu trải ----------

export interface TarotInput {
  spread: TarotSpread;
  cards: Drawn[];
  topic: TarotTopic;
}

export function readTarot({ spread, cards: d, topic }: TarotInput): TarotReading {
  const base = overview(d);
  const positions: TarotSection = { title: 'Theo từng vị trí', items: positionItems(spread, d, topic) };

  switch (spread.id) {
    case 'one': {
      const c = getTarotCard(d[0].id);
      const items: TarotItem[] = [{ label: 'Theo chủ đề bạn hỏi', cards: [d[0]], text: meaningOf(d[0], topic) }];
      if (topic !== 'general') items.push({ label: 'Ý nghĩa chung', cards: [d[0]], text: meaningOf({ ...d[0] }, 'general') });
      return {
        overview: [`${nameOf(d[0])}: ${(d[0].reversed ? c.reversedKeywords : c.keywords).join(', ')}.`],
        sections: [{ title: 'Thông điệp', items }],
        advice: adviceOf(d[0]),
      };
    }

    case 'ppf':
      return {
        overview: base,
        sections: [
          {
            title: 'Dòng chảy',
            items: [
              {
                cards: d,
                text: `Từ ${keywordOf(d[0])} trong quá khứ, hiện tại bạn đang ở trong năng lượng ${keywordOf(d[1])}, và mọi việc hướng tới ${keywordOf(d[2])}.`,
              },
            ],
          },
          positions,
        ],
        advice: adviceOf(d[2]),
      };

    case 'sao':
      return {
        overview: base,
        sections: [
          {
            title: 'Nên làm gì',
            intro: 'Lá ở giữa là lời khuyên hành động cho tình huống của bạn.',
            items: [{ label: 'Hành động', cards: [d[1]], text: `${meaningOf(d[1], topic)} ${getTarotCard(d[1].id).advice}` }],
          },
          positions,
        ],
        advice: adviceOf(d[1]),
      };

    case 'yesno': {
      const score = scoreOf(d[0]) + scoreOf(d[1]) * 2 + scoreOf(d[2]);
      let verdict: TarotReading['verdict'];
      if (score >= 2.5) verdict = { tone: 'yes', label: 'Có', detail: 'Các lá đồng thuận theo hướng tích cực.' };
      else if (score >= 1) verdict = { tone: 'lean-yes', label: 'Nghiêng về có', detail: 'Khả năng thuận lợi, nhưng cần thêm nỗ lực hoặc điều kiện.' };
      else if (score > -1)
        verdict = { tone: 'unclear', label: 'Chưa rõ', detail: 'Tín hiệu tốt và xấu cân nhau. Hãy hỏi lại sau, hoặc hỏi cụ thể hơn.' };
      else if (score > -2.5) verdict = { tone: 'lean-no', label: 'Nghiêng về không', detail: 'Có trở ngại đáng kể; chưa phải thời điểm thuận lợi.' };
      else verdict = { tone: 'no', label: 'Không', detail: 'Các lá cho thấy điều này khó xảy ra theo cách bạn mong.' };
      return {
        verdict,
        overview: [`Lá trọng tâm ${nameOf(d[1])} có sức nặng gấp đôi; hai lá bên là ${nameOf(d[0])} và ${nameOf(d[2])}.`, ...base.slice(1)],
        sections: [positions],
        advice: adviceOf(d[1]),
      };
    }

    case 'love': {
      const you = getTarotCard(d[0].id);
      const them = getTarotCard(d[1].id);
      const mood = (x: Drawn) => (scoreOf(x) > 0 ? 'cởi mở, tích cực' : scoreOf(x) < 0 ? 'đang có vướng mắc' : 'trung tính');
      return {
        overview: base,
        sections: [
          {
            title: 'Hai người',
            items: [
              {
                cards: [d[0], d[1]],
                text: `Bạn đang ${mood(d[0])}, người ấy đang ${mood(d[1])}. ${elementRelation(you, them)}`,
              },
            ],
          },
          { title: 'Điều đang có giữa hai người', items: positionItems(spread, d, topic, [2]) },
          positions,
        ],
        advice: adviceOf(d[4]),
      };
    }

    case 'choice': {
      const a = scoreOf(d[1]) + scoreOf(d[2]) * 1.5;
      const b = scoreOf(d[3]) + scoreOf(d[4]) * 1.5;
      const diff = a - b;
      const compare =
        Math.abs(diff) < 0.75
          ? 'Hai con đường khá cân bằng. Hãy chọn theo điều bạn thật sự coi trọng, thay vì chờ một dấu hiệu.'
          : diff > 0
            ? 'Con đường A có vẻ thuận lợi hơn.'
            : 'Con đường B có vẻ thuận lợi hơn.';
      return {
        overview: base,
        sections: [
          {
            title: 'So sánh hai con đường',
            items: [
              { label: 'Con đường A', cards: [d[1], d[2]], text: `${meaningOf(d[1], topic)} Kết quả: ${meaningOf(d[2], topic)}` },
              { label: 'Con đường B', cards: [d[3], d[4]], text: `${meaningOf(d[3], topic)} Kết quả: ${meaningOf(d[4], topic)}` },
              { label: 'Nhận định', cards: [], text: compare },
            ],
          },
          { title: 'Bạn lúc này', items: positionItems(spread, d, topic, [0]) },
        ],
        advice: adviceOf(diff >= 0 ? d[2] : d[4]),
      };
    }

    case 'celtic': {
      const outcomeGood = scoreOf(d[9]) > 0;
      const goalGood = scoreOf(d[2]) > 0;
      const alignment =
        outcomeGood && goalGood
          ? 'Kết quả đi cùng hướng với mục tiêu của bạn.'
          : outcomeGood
            ? 'Kết quả tốt hơn điều bạn đang lo nghĩ.'
            : goalGood
              ? 'Kết quả chưa khớp với điều bạn mong; cần xem lại cách đi.'
              : 'Cả mục tiêu lẫn kết quả đều nặng nề; có lẽ cần đặt lại câu hỏi từ gốc.';
      return {
        overview: base,
        sections: [
          {
            title: 'Đọc theo trục',
            items: [
              { label: 'Cốt lõi', cards: [d[0], d[1]], text: `Hiện tại là ${keywordOf(d[0])}, bị đan xen bởi ${keywordOf(d[1])}.` },
              { label: 'Trục dọc', cards: [d[3], d[2]], text: `Từ gốc rễ ${keywordOf(d[3])}, bạn hướng tới ${keywordOf(d[2])}.` },
              { label: 'Trục thời gian', cards: [d[4], d[5]], text: `Vừa đi qua ${keywordOf(d[4])}; sắp tới là ${keywordOf(d[5])}.` },
              { label: 'Bạn và xung quanh', cards: [d[6], d[7]], text: `Bạn mang năng lượng ${keywordOf(d[6])}, còn môi trường quanh bạn là ${keywordOf(d[7])}.` },
              { label: 'Kết quả và mục tiêu', cards: [d[2], d[9]], text: alignment },
            ],
          },
          positions,
        ],
        advice: adviceOf(d[9]),
      };
    }
  }
}

export function tarotToText(question: string, spread: TarotSpread, cards: Drawn[], r: TarotReading): string {
  const out: string[] = [];
  if (question.trim()) out.push(`Câu hỏi: ${question.trim()}`);
  out.push(`Trải bài: ${spread.name}`);
  out.push(`Các lá: ${cards.map(nameOf).join(', ')}`, '');
  if (r.verdict) out.push(`Trả lời: ${r.verdict.label}. ${r.verdict.detail}`);
  out.push(...r.overview);
  for (const s of r.sections) {
    out.push('', s.title);
    for (const it of s.items) {
      const names = it.cards.map(nameOf).join(' + ');
      out.push(`- ${[it.label, names].filter(Boolean).join(': ')}${names || it.label ? ' — ' : ''}${it.text}`);
    }
  }
  out.push('', `Lời khuyên (${nameOf(r.advice.card)}): ${r.advice.text}`);
  return out.join('\n');
}
