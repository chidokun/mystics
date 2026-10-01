import { getCard, SUITS, TOPIC_CARDS, type LenormandCard, type Suit, type Topic } from '../data/cards';
import { findCombo } from '../data/combos';
import type { Spread } from '../data/spreads';

export interface ReadingItem {
  label?: string;
  cards: number[];
  text: string;
}

export interface ReadingSection {
  title: string;
  intro?: string;
  items: ReadingItem[];
}

export type VerdictTone = 'yes' | 'lean-yes' | 'unclear' | 'lean-no' | 'no';

export interface Reading {
  overview: string[];
  verdict?: { tone: VerdictTone; label: string; detail: string };
  sections: ReadingSection[];
  advice: { card: number; text: string };
  timing?: { card: number; text: string };
}

export interface ReadingInput {
  spread: Spread;
  /** Mã lá theo thứ tự vị trí trong trải bài */
  cards: number[];
  topic: Topic;
  /** Lá đại diện người hỏi (28 hoặc 29), chỉ dùng cho Đại Trải Bài */
  significator?: number;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function pairText(a: number, b: number): string {
  const combo = findCombo(a, b);
  if (combo) return combo;
  return `${cap(getCard(a).noun)} — ${getCard(b).mod}.`;
}

function toneOverview(cards: LenormandCard[]): string {
  const avg = cards.reduce((sum, c) => sum + c.tone, 0) / cards.length;
  if (avg >= 1) return 'Năng lượng chung rất thuận lợi: phần lớn các lá đều mang tín hiệu tốt.';
  if (avg >= 0.35) return 'Năng lượng chung khá tích cực, dù vẫn có vài điểm cần lưu ý.';
  if (avg > -0.35) return 'Năng lượng chung cân bằng — kết quả phụ thuộc nhiều vào cách bạn hành động.';
  if (avg > -1) return 'Trải bài cho thấy có trở ngại; mọi việc cần thêm thời gian và sự kiên nhẫn.';
  return 'Đây là giai đoạn nhiều thử thách. Hãy xem phần lời khuyên để biết nên tập trung vào đâu.';
}

function suitOverview(cards: LenormandCard[]): string | undefined {
  if (cards.length < 3) return undefined;
  const counts = new Map<Suit, number>();
  for (const c of cards) counts.set(c.suit, (counts.get(c.suit) ?? 0) + 1);
  const [suit, n] = [...counts.entries()].sort((x, y) => y[1] - x[1])[0];
  if (n < 2 || n / cards.length < 0.4) return undefined;
  const s = SUITS[suit];
  return `Có ${n}/${cards.length} lá thuộc chất ${s.name} ${s.symbol}: câu chuyện nghiêng về ${s.theme}.`;
}

const TOPIC_NOTES: Record<number, string> = {
  24: 'Trái Tim xuất hiện — cảm xúc là trung tâm của câu chuyện.',
  25: 'Chiếc Nhẫn xuất hiện — có một cam kết hoặc thỏa thuận đang được đặt ra.',
  14: 'Con Cáo xuất hiện — chuyện công việc hằng ngày đang được nhắc tới.',
  35: 'Mỏ Neo xuất hiện — sự ổn định, lâu dài là chủ đề quan trọng.',
  34: 'Con Cá xuất hiện — tiền bạc đóng vai trò rõ rệt.',
  5: 'Cái Cây xuất hiện — sức khỏe là chủ đề cần quan tâm.',
};

function keyCardNotes(ids: number[], topic: Topic): string[] {
  const notes: string[] = [];
  const has = (id: number) => ids.includes(id);
  for (const id of TOPIC_CARDS[topic]) {
    if (has(id) && TOPIC_NOTES[id]) notes.push(TOPIC_NOTES[id]);
  }
  if (has(31) && has(33)) notes.push('Mặt Trời và Chìa Khóa cùng xuất hiện — một tín hiệu thành công rất rõ.');
  else if (has(31)) notes.push('Mặt Trời soi sáng trải bài — năng lượng thành công đang ở bên bạn.');
  else if (has(33)) notes.push('Chìa Khóa xuất hiện — giải pháp đã có, chỉ cần bạn mở cửa.');
  const heavy = [8, 21, 36].filter(has).map((id) => getCard(id).name);
  if (heavy.length) notes.push(`${heavy.join(', ')} cho thấy có điều nặng nề cần đối diện thay vì né tránh.`);
  if (ids.length <= 9 && (has(28) || has(29))) {
    notes.push('Lá đại diện người xuất hiện — câu chuyện liên quan trực tiếp đến bạn hoặc một người cụ thể.');
  }
  return notes;
}

function positionItems(input: ReadingInput, indices?: number[]): ReadingItem[] {
  const idx = indices ?? input.cards.map((_, i) => i);
  return idx.map((i) => {
    const card = getCard(input.cards[i]);
    return { label: input.spread.positions[i].label, cards: [card.id], text: card.meanings[input.topic] };
  });
}

function pairItems(ids: number[], pairs: [number, number][]): ReadingItem[] {
  return pairs.map(([a, b]) => ({ cards: [ids[a], ids[b]], text: pairText(ids[a], ids[b]) }));
}

/** Ghép một dãy lá thành câu: lá đầu là chủ thể, các lá giữa bổ nghĩa, lá cuối là nơi câu chuyện hướng tới. */
function sentence(ids: number[]): string {
  const cards = ids.map(getCard);
  if (cards.length === 1) return `${cap(cards[0].noun)}.`;
  const [first, ...rest] = cards;
  const last = rest.pop()!;
  // Mỗi vế đã có dấu phẩy bên trong nên ngăn các vế bằng dấu chấm phẩy
  return [cap(first.noun), ...rest.map((c) => c.mod), `dẫn tới ${last.noun}`].join('; ') + '.';
}

const consecutive = (n: number): [number, number][] =>
  Array.from({ length: n - 1 }, (_, i) => [i, i + 1] as [number, number]);

function adviceOf(id: number) {
  return { card: id, text: getCard(id).advice };
}

function timingOf(id: number) {
  return { card: id, text: getCard(id).timing };
}

// ---------- Từng kiểu trải bài ----------

function readOne(input: ReadingInput): Reading {
  const card = getCard(input.cards[0]);
  const items: ReadingItem[] = [{ label: 'Theo chủ đề bạn hỏi', cards: [card.id], text: card.meanings[input.topic] }];
  if (input.topic !== 'general') items.push({ label: 'Ý nghĩa chung', cards: [card.id], text: card.meanings.general });
  items.push({ label: 'Nếu lá bài là một người', cards: [card.id], text: card.person });
  return {
    overview: [`${card.name}: ${card.keywords.join(', ')}.`],
    sections: [{ title: 'Thông điệp', items }],
    advice: adviceOf(card.id),
    timing: timingOf(card.id),
  };
}

function readThree(input: ReadingInput): Reading {
  const ids = input.cards;
  const cards = ids.map(getCard);
  return {
    overview: [toneOverview(cards), ...keyCardNotes(ids, input.topic)],
    sections: [
      { title: 'Đọc thành câu', items: [{ cards: ids, text: sentence(ids) }] },
      { title: 'Theo từng vị trí', items: positionItems(input) },
      {
        title: 'Ghép cặp',
        intro: 'Trong Lenormand, lá đứng sau bổ nghĩa cho lá đứng trước.',
        items: pairItems(ids, consecutive(3)),
      },
    ],
    advice: adviceOf(ids[2]),
    timing: timingOf(ids[2]),
  };
}

function readYesNo(input: ReadingInput): Reading {
  const ids = input.cards;
  const cards = ids.map(getCard);
  const weights = [1, 2, 1];
  const score = cards.reduce((sum, c, i) => sum + c.tone * weights[i], 0);
  let verdict: Reading['verdict'];
  if (score >= 3) verdict = { tone: 'yes', label: 'Có', detail: 'Các lá bài đồng thuận theo hướng tích cực.' };
  else if (score >= 1)
    verdict = { tone: 'lean-yes', label: 'Nghiêng về có', detail: 'Khả năng thuận lợi, nhưng cần thêm nỗ lực hoặc điều kiện.' };
  else if (score === 0)
    verdict = { tone: 'unclear', label: 'Chưa rõ', detail: 'Tín hiệu tốt và xấu cân nhau. Hãy hỏi lại sau, hoặc đặt câu hỏi cụ thể hơn.' };
  else if (score >= -2)
    verdict = { tone: 'lean-no', label: 'Nghiêng về không', detail: 'Có trở ngại đáng kể; chưa phải thời điểm thuận lợi.' };
  else verdict = { tone: 'no', label: 'Không', detail: 'Các lá bài cho thấy điều này khó xảy ra theo cách bạn mong.' };

  const signs = cards.map((c) => (c.tone > 0 ? 'thuận' : c.tone < 0 ? 'nghịch' : 'trung tính'));
  return {
    verdict,
    overview: [
      `Lá trọng tâm ${cards[1].name} (${signs[1]}) có sức nặng gấp đôi; hai lá bên là ${cards[0].name} (${signs[0]}) và ${cards[2].name} (${signs[2]}).`,
      ...keyCardNotes(ids, input.topic),
    ],
    sections: [
      { title: 'Theo từng vị trí', items: positionItems(input) },
      { title: 'Ghép cặp', items: pairItems(ids, consecutive(3)) },
    ],
    advice: adviceOf(ids[1]),
    timing: timingOf(ids[2]),
  };
}

function readFive(input: ReadingInput): Reading {
  const ids = input.cards;
  const cards = ids.map(getCard);
  return {
    overview: [toneOverview(cards), suitOverview(cards), ...keyCardNotes(ids, input.topic)].filter(Boolean) as string[],
    sections: [
      {
        title: 'Trọng tâm',
        intro: 'Lá ở giữa là tâm điểm; các lá hai bên kể câu chuyện quanh nó.',
        items: positionItems(input, [2]),
      },
      {
        title: 'Dòng thời gian',
        items: [
          { label: 'Đã qua', cards: [ids[0], ids[1]], text: pairText(ids[0], ids[1]) },
          { label: 'Đang tới', cards: [ids[3], ids[4]], text: pairText(ids[3], ids[4]) },
        ],
      },
      { title: 'Theo từng vị trí', items: positionItems(input, [0, 1, 3, 4]) },
      {
        title: 'Đọc phản chiếu',
        intro: 'Các lá đối xứng qua trọng tâm soi sáng cho nhau.',
        items: pairItems(ids, [
          [0, 4],
          [1, 3],
        ]),
      },
    ],
    advice: adviceOf(ids[2]),
    timing: timingOf(ids[4]),
  };
}

function readNine(input: ReadingInput): Reading {
  const ids = input.cards;
  const cards = ids.map(getCard);
  const line3 = (label: string, idx: [number, number, number]): ReadingItem => ({
    label,
    cards: idx.map((i) => ids[i]),
    text: sentence(idx.map((i) => ids[i])),
  });
  return {
    overview: [toneOverview(cards), suitOverview(cards), ...keyCardNotes(ids, input.topic)].filter(Boolean) as string[],
    sections: [
      { title: 'Trọng tâm', items: positionItems(input, [4]) },
      {
        title: 'Theo hàng',
        items: [
          line3('Hàng trên: suy nghĩ, mong muốn', [0, 1, 2]),
          line3('Hàng giữa: hiện tại', [3, 4, 5]),
          line3('Hàng dưới: nền tảng, điều trong tầm tay', [6, 7, 8]),
        ],
      },
      {
        title: 'Theo cột',
        items: [
          line3('Cột trái: quá khứ', [0, 3, 6]),
          line3('Cột giữa: hiện tại', [1, 4, 7]),
          line3('Cột phải: tương lai', [2, 5, 8]),
        ],
      },
      {
        title: 'Hai đường chéo',
        items: [line3('Từ trên xuống', [0, 4, 8]), line3('Từ dưới lên', [6, 4, 2])],
      },
      {
        title: 'Bốn góc',
        intro: 'Bốn lá ở góc vẽ nên khung cảnh chung bao quanh vấn đề.',
        items: [
          {
            cards: [ids[0], ids[2], ids[6], ids[8]],
            text: `${cap([0, 2, 6, 8].map((i) => getCard(ids[i]).noun).join('; '))}.`,
          },
        ],
      },
      { title: 'Theo từng vị trí', items: positionItems(input, [0, 1, 2, 3, 5, 6, 7, 8]) },
    ],
    advice: adviceOf(ids[4]),
    timing: timingOf(ids[8]),
  };
}

function readRelationship(input: ReadingInput): Reading {
  const ids = input.cards;
  const cards = ids.map(getCard);
  const avg = (idx: number[]) => idx.reduce((s, i) => s + cards[i].tone, 0) / idx.length;
  const you = avg([0, 1, 2]);
  const them = avg([4, 5, 6]);
  const mood = (v: number) => (v > 0.3 ? 'tích cực' : v < -0.3 ? 'nặng nề' : 'trung tính');

  const compare = (label: string, a: number, b: number): ReadingItem => {
    const ta = cards[a].tone;
    const tb = cards[b].tone;
    let verdict: string;
    if (ta > 0 && tb > 0) verdict = 'Hai bạn khá đồng điệu ở điểm này.';
    else if (ta < 0 && tb < 0) verdict = 'Cả hai đều đang gặp khó ở điểm này.';
    else if (Math.sign(ta) !== Math.sign(tb)) verdict = 'Hai bạn đang lệch nhịp ở điểm này — cần nói chuyện nhiều hơn.';
    else verdict = 'Chưa có tín hiệu rõ ràng ở điểm này.';
    return {
      label,
      cards: [ids[a], ids[b]],
      text: `Bạn: ${cards[a].noun}. Người ấy: ${cards[b].noun}. ${verdict}`,
    };
  };

  return {
    overview: [
      `Phía bạn mang năng lượng ${mood(you)}, phía người ấy mang năng lượng ${mood(them)}.`,
      ...keyCardNotes(ids, input.topic),
    ],
    sections: [
      { title: 'Điều đang có giữa hai người', items: positionItems(input, [3]) },
      {
        title: 'Đối chiếu',
        items: [compare('Suy nghĩ', 0, 4), compare('Cảm xúc', 1, 5), compare('Hành động', 2, 6)],
      },
      { title: 'Phía bạn', items: positionItems(input, [0, 1, 2]) },
      { title: 'Phía người ấy', items: positionItems(input, [4, 5, 6]) },
    ],
    advice: adviceOf(ids[3]),
  };
}

// ---------- Đại Trải Bài ----------

/** Tọa độ (hàng, cột) của vị trí i trong Đại Trải Bài 8×4 + 4 */
export function grandCoord(i: number): { row: number; col: number } {
  if (i >= 32) return { row: 4, col: 2 + (i - 32) };
  return { row: Math.floor(i / 8), col: i % 8 };
}

const distance = (a: number, b: number) => {
  const pa = grandCoord(a);
  const pb = grandCoord(b);
  return Math.max(Math.abs(pa.row - pb.row), Math.abs(pa.col - pb.col));
};

function readGrand(input: ReadingInput): Reading {
  const ids = input.cards;
  const sig = input.significator ?? 29;
  const sigPos = ids.indexOf(sig);
  const sigCard = getCard(sig);
  const { row, col } = grandCoord(sigPos);
  const house = getCard(sigPos + 1);

  const neighbors = ids
    .map((id, i) => ({ id, i }))
    .filter(({ i }) => i !== sigPos && distance(i, sigPos) === 1);

  const leftCount = row < 4 ? col : col - 2;
  const rightCount = row < 4 ? 7 - col : 5 - col;

  const positionText: string[] = [];
  positionText.push(
    `${sigCard.name} rơi vào Nhà ${house.name} (${house.keywords.slice(0, 3).join(', ')}). Đây là lĩnh vực đang chi phối bạn nhiều nhất lúc này.`,
  );
  if (row === 4) {
    positionText.push('Lá đại diện nằm ở hàng cuối — bạn đang chịu tác động của những yếu tố mang tính định mệnh.');
  } else {
    if (rightCount <= 1) positionText.push('Phía trước bạn còn rất ít lá: một giai đoạn sắp khép lại, điều mới đang đến gần.');
    else if (leftCount <= 1) positionText.push('Phía sau bạn gần như trống: bạn đang ở điểm khởi đầu, nhiều diễn biến còn ở phía trước.');
    if (row === 0) positionText.push('Bạn ở hàng trên cùng — đang làm chủ tình hình, nhìn thấy rõ bức tranh.');
    if (row === 3) positionText.push('Bạn ở hàng dưới cùng — có cảm giác bị nhiều thứ đè lên, cần tìm lại thế chủ động.');
  }
  if (ids[sigPos] === sigPos + 1) positionText.push('Lá đại diện về đúng nhà của mình — bạn đang sống đúng với bản thân.');

  const nearItems: ReadingItem[] = neighbors.map(({ id, i }) => {
    const p = grandCoord(i);
    const where =
      p.row < row ? 'Phía trên: điều bạn đang nghĩ' : p.row > row ? 'Phía dưới: điều trong tầm kiểm soát' : p.col < col ? 'Phía sau: điều vừa qua' : 'Phía trước: điều sắp tới';
    return { label: where, cards: [id], text: getCard(id).meanings[input.topic] };
  });

  const topicIds = [...TOPIC_CARDS[input.topic]];
  if (input.topic === 'love') topicIds.unshift(sig === 28 ? 29 : 28);
  const topicItems: ReadingItem[] = topicIds.map((id) => {
    const pos = ids.indexOf(id);
    const d = distance(pos, sigPos);
    const h = getCard(pos + 1);
    const near = d <= 1 ? 'nằm sát bạn — ảnh hưởng rất mạnh' : d <= 3 ? 'ở khoảng cách vừa phải' : 'nằm xa bạn — ảnh hưởng còn mờ nhạt';
    return {
      cards: [id],
      text: `${getCard(id).name} ${near}, rơi vào Nhà ${h.name}: ${h.keywords.slice(0, 2).join(', ')}.`,
    };
  });

  const homeCards = ids.map((id, i) => ({ id, i })).filter(({ id, i }) => id === i + 1 && id !== sig);

  const cartouche = ids.slice(32);
  const corners = [0, 7, 24, 31].map((i) => ids[i]);
  // Lá ngay phía trước lá đại diện; nếu đã ở cuối hàng thì lấy lá cuối của hàng định mệnh
  const lastCol = row < 4 ? 7 : 5;
  const ahead = col < lastCol ? ids[sigPos + 1] : sigPos === 35 ? ids[34] : cartouche[3];

  const nearCards = neighbors.map(({ id }) => getCard(id));
  const sections: ReadingSection[] = [
    { title: 'Vị trí của bạn', items: [{ cards: [sig], text: positionText.join(' ') }] },
    {
      title: 'Những lá quanh bạn',
      intro: 'Tám lá kề bên là những gì đang tác động trực tiếp lên bạn.',
      items: nearItems,
    },
    { title: 'Lá chủ đề', intro: 'Lá càng gần lá đại diện thì chủ đề đó càng hiện diện rõ trong đời bạn.', items: topicItems },
    {
      title: 'Bốn góc',
      intro: 'Khung cảnh bao trùm cả trải bài.',
      items: [{ cards: corners, text: `${cap(corners.map((id) => getCard(id).noun).join('; '))}.` }],
    },
    {
      title: 'Hàng định mệnh',
      intro: 'Bốn lá cuối cùng cho biết mọi chuyện rồi sẽ đi về đâu.',
      items: [{ cards: cartouche, text: sentence(cartouche) }],
    },
  ];
  if (homeCards.length) {
    sections.push({
      title: 'Lá về đúng nhà',
      intro: 'Khi một lá rơi vào chính nhà của nó, chủ đề ấy được nhấn mạnh gấp đôi.',
      items: homeCards.map(({ id }) => ({ cards: [id], text: `${getCard(id).name}: ${getCard(id).keywords.join(', ')}.` })),
    });
  }

  return {
    overview: [toneOverview(nearCards), suitOverview(nearCards)].filter(Boolean) as string[],
    sections,
    advice: adviceOf(ahead),
    timing: timingOf(cartouche[3]),
  };
}

export function interpret(input: ReadingInput): Reading {
  switch (input.spread.id) {
    case 'one':
      return readOne(input);
    case 'three':
      return readThree(input);
    case 'yesno':
      return readYesNo(input);
    case 'five':
      return readFive(input);
    case 'nine':
      return readNine(input);
    case 'relationship':
      return readRelationship(input);
    case 'grand':
      return readGrand(input);
  }
}

/** Bản văn bản thuần để sao chép */
export function readingToText(question: string, spread: Spread, cards: number[], reading: Reading): string {
  const lines: string[] = [];
  if (question.trim()) lines.push(`Câu hỏi: ${question.trim()}`);
  lines.push(`Trải bài: ${spread.name}`);
  lines.push(`Các lá: ${cards.map((id) => `${id}. ${getCard(id).name}`).join(', ')}`);
  lines.push('');
  if (reading.verdict) lines.push(`Trả lời: ${reading.verdict.label}. ${reading.verdict.detail}`);
  lines.push(...reading.overview);
  for (const section of reading.sections) {
    lines.push('', section.title);
    for (const item of section.items) {
      const names = item.cards.map((id) => getCard(id).name).join(' + ');
      lines.push(`- ${item.label ? `${item.label} (${names})` : names}: ${item.text}`);
    }
  }
  lines.push('', `Lời khuyên (${getCard(reading.advice.card).name}): ${reading.advice.text}`);
  return lines.join('\n');
}
