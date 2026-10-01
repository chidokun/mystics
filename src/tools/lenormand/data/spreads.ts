import { CARDS } from './cards';

export type SpreadId = 'one' | 'three' | 'yesno' | 'five' | 'nine' | 'relationship' | 'grand';

export interface SpreadPosition {
  label: string;
  hint: string;
  /** Tọa độ trên lưới bố cục, tính từ 1 */
  col: number;
  row: number;
}

export interface Spread {
  id: SpreadId;
  name: string;
  /** Hợp với loại câu hỏi nào */
  summary: string;
  cols: number;
  rows: number;
  positions: SpreadPosition[];
  /** Đại Trải Bài cần biết lá nào đại diện cho người hỏi */
  needsSignificator?: boolean;
}

const line = (labels: [string, string][]): SpreadPosition[] =>
  labels.map(([label, hint], i) => ({ label, hint, col: i + 1, row: 1 }));

const grandPositions: SpreadPosition[] = CARDS.map((house, i) => {
  const inLastRow = i >= 32;
  return {
    label: `Nhà ${house.name}`,
    hint: `Chủ đề: ${house.keywords.slice(0, 3).join(', ')}`,
    col: inLastRow ? 3 + (i - 32) : (i % 8) + 1,
    row: inLastRow ? 5 : Math.floor(i / 8) + 1,
  };
});

export const SPREADS: Spread[] = [
  {
    id: 'one',
    name: 'Một lá',
    summary: 'Thông điệp trong ngày hoặc câu trả lời thật ngắn.',
    cols: 1,
    rows: 1,
    positions: line([['Thông điệp', 'Năng lượng chính, câu trả lời ngắn cho câu hỏi.']]),
  },
  {
    id: 'three',
    name: 'Ba lá đọc thành câu',
    summary: 'Câu hỏi cụ thể, muốn biết sự việc sẽ diễn biến ra sao.',
    cols: 3,
    rows: 1,
    positions: line([
      ['Khởi điểm', 'Chủ thể của câu chuyện, điều đang diễn ra.'],
      ['Diễn biến', 'Điều tác động, cách sự việc chuyển động.'],
      ['Kết quả', 'Chiều hướng sắp tới nếu mọi thứ giữ nguyên.'],
    ]),
  },
  {
    id: 'yesno',
    name: 'Có hay không',
    summary: 'Câu hỏi đóng, cần một câu trả lời rõ ràng.',
    cols: 3,
    rows: 1,
    positions: line([
      ['Lá thứ nhất', 'Yếu tố dẫn vào câu trả lời.'],
      ['Trọng tâm', 'Lá quyết định — có sức nặng gấp đôi.'],
      ['Lá thứ ba', 'Yếu tố khép lại câu trả lời.'],
    ]),
  },
  {
    id: 'five',
    name: 'Dòng thời gian năm lá',
    summary: 'Nhìn một chuyện từ quá khứ đến tương lai.',
    cols: 5,
    rows: 1,
    positions: line([
      ['Quá khứ xa', 'Gốc rễ của vấn đề.'],
      ['Quá khứ gần', 'Điều vừa xảy ra, còn ảnh hưởng.'],
      ['Hiện tại', 'Trọng tâm của câu chuyện lúc này.'],
      ['Sắp tới', 'Điều đang đến gần.'],
      ['Tương lai xa', 'Chiều hướng dài hạn.'],
    ]),
  },
  {
    id: 'nine',
    name: 'Ô vuông chín lá',
    summary: 'Tình huống nhiều mặt, cần nhìn toàn cảnh.',
    cols: 3,
    rows: 3,
    positions: [
      { label: 'Điều đã nghĩ', hint: 'Suy nghĩ cũ còn đọng lại.', col: 1, row: 1 },
      { label: 'Điều đang nghĩ', hint: 'Điều chiếm tâm trí bạn lúc này.', col: 2, row: 1 },
      { label: 'Điều mong muốn', hint: 'Hy vọng, mục tiêu bạn hướng tới.', col: 3, row: 1 },
      { label: 'Quá khứ', hint: 'Những gì đã dẫn tới hiện tại.', col: 1, row: 2 },
      { label: 'Trọng tâm', hint: 'Cốt lõi của vấn đề.', col: 2, row: 2 },
      { label: 'Sắp tới', hint: 'Điều đang đến.', col: 3, row: 2 },
      { label: 'Nền tảng', hint: 'Những gì bạn đã có trong tay.', col: 1, row: 3 },
      { label: 'Trong tầm tay', hint: 'Điều bạn có thể tác động được.', col: 2, row: 3 },
      { label: 'Kết quả', hint: 'Kết quả tiềm năng.', col: 3, row: 3 },
    ],
  },
  {
    id: 'relationship',
    name: 'Hai người',
    summary: 'Hiểu mình, hiểu người ấy và điều đang có giữa hai người.',
    cols: 3,
    rows: 3,
    positions: [
      { label: 'Bạn nghĩ', hint: 'Suy nghĩ của bạn về mối quan hệ.', col: 1, row: 1 },
      { label: 'Bạn cảm thấy', hint: 'Cảm xúc thật của bạn.', col: 1, row: 2 },
      { label: 'Bạn làm', hint: 'Cách bạn đang hành động.', col: 1, row: 3 },
      { label: 'Mối quan hệ', hint: 'Điều đang có giữa hai người.', col: 2, row: 2 },
      { label: 'Người ấy nghĩ', hint: 'Suy nghĩ của người ấy.', col: 3, row: 1 },
      { label: 'Người ấy cảm thấy', hint: 'Cảm xúc của người ấy.', col: 3, row: 2 },
      { label: 'Người ấy làm', hint: 'Cách người ấy đang hành động.', col: 3, row: 3 },
    ],
  },
  {
    id: 'grand',
    name: 'Đại Trải Bài',
    summary: 'Toàn bộ 36 lá — bức tranh tổng thể cuộc sống của bạn.',
    cols: 8,
    rows: 5,
    positions: grandPositions,
    needsSignificator: true,
  },
];

export const getSpread = (id: SpreadId): Spread => {
  const spread = SPREADS.find((s) => s.id === id);
  if (!spread) throw new Error(`Không có trải bài ${id}`);
  return spread;
};
