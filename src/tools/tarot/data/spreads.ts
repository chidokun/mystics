export type TarotSpreadId = 'one' | 'ppf' | 'sao' | 'yesno' | 'love' | 'choice' | 'celtic';

export interface TarotPosition {
  label: string;
  hint: string;
  /** Ô trên lưới, tính từ 1; colSpan/rowSpan cho các bố cục so le */
  col: number;
  row: number;
  colSpan?: number;
  rowSpan?: number;
  /** Lá nằm ngang đè lên lá trước (vị trí "thử thách" của Celtic Cross) */
  crossing?: boolean;
}

export interface TarotSpread {
  id: TarotSpreadId;
  name: string;
  summary: string;
  cols: number;
  rows: number;
  positions: TarotPosition[];
}

const line = (labels: [string, string][]): TarotPosition[] =>
  labels.map(([label, hint], i) => ({ label, hint, col: i + 1, row: 1 }));

export const TAROT_SPREADS: TarotSpread[] = [
  {
    id: 'one',
    name: 'Một lá',
    summary: 'Thông điệp trong ngày hoặc lời khuyên ngắn.',
    cols: 1,
    rows: 1,
    positions: line([['Thông điệp', 'Năng lượng chính dành cho bạn lúc này.']]),
  },
  {
    id: 'ppf',
    name: 'Quá khứ, hiện tại, tương lai',
    summary: 'Hiểu một chuyện đến từ đâu và đang đi về đâu.',
    cols: 3,
    rows: 1,
    positions: line([
      ['Quá khứ', 'Điều đã dẫn tới tình huống hiện tại.'],
      ['Hiện tại', 'Năng lượng đang chi phối lúc này.'],
      ['Tương lai', 'Chiều hướng sắp tới nếu mọi thứ giữ nguyên.'],
    ]),
  },
  {
    id: 'sao',
    name: 'Tình huống, hành động, kết quả',
    summary: 'Cần biết nên làm gì với một vấn đề cụ thể.',
    cols: 3,
    rows: 1,
    positions: line([
      ['Tình huống', 'Bản chất của vấn đề.'],
      ['Hành động', 'Điều bạn nên làm.'],
      ['Kết quả', 'Điều sẽ đến nếu bạn làm như vậy.'],
    ]),
  },
  {
    id: 'yesno',
    name: 'Có hay không',
    summary: 'Câu hỏi đóng, cần câu trả lời rõ ràng.',
    cols: 3,
    rows: 1,
    positions: line([
      ['Lá thứ nhất', 'Yếu tố dẫn vào câu trả lời.'],
      ['Trọng tâm', 'Lá quyết định — có sức nặng gấp đôi.'],
      ['Lá thứ ba', 'Yếu tố khép lại câu trả lời.'],
    ]),
  },
  {
    id: 'love',
    name: 'Tình yêu',
    summary: 'Nhìn rõ hai người và điều đang có giữa hai người.',
    cols: 6,
    rows: 2,
    positions: [
      { label: 'Bạn', hint: 'Bạn đang mang năng lượng gì vào mối quan hệ.', col: 1, colSpan: 2, row: 1 },
      { label: 'Người ấy', hint: 'Người ấy đang mang năng lượng gì.', col: 5, colSpan: 2, row: 1 },
      { label: 'Mối quan hệ', hint: 'Điều đang có giữa hai người.', col: 3, colSpan: 2, row: 1 },
      { label: 'Thử thách', hint: 'Điều cần vượt qua.', col: 2, colSpan: 2, row: 2 },
      { label: 'Hướng đi', hint: 'Chiều hướng của mối quan hệ.', col: 4, colSpan: 2, row: 2 },
    ],
  },
  {
    id: 'choice',
    name: 'Hai lựa chọn',
    summary: 'Đang phân vân giữa hai con đường.',
    cols: 6,
    rows: 3,
    positions: [
      { label: 'Bạn lúc này', hint: 'Bạn đang đứng ở đâu trước lựa chọn.', col: 3, colSpan: 2, row: 3 },
      { label: 'Con đường A', hint: 'Điều sẽ trải qua nếu chọn A.', col: 1, colSpan: 2, row: 2 },
      { label: 'Kết quả A', hint: 'Nơi con đường A dẫn tới.', col: 1, colSpan: 2, row: 1 },
      { label: 'Con đường B', hint: 'Điều sẽ trải qua nếu chọn B.', col: 5, colSpan: 2, row: 2 },
      { label: 'Kết quả B', hint: 'Nơi con đường B dẫn tới.', col: 5, colSpan: 2, row: 1 },
    ],
  },
  {
    id: 'celtic',
    name: 'Celtic Cross',
    summary: 'Mười lá, nhìn toàn cảnh một vấn đề lớn.',
    cols: 5,
    rows: 8,
    positions: [
      { label: 'Hiện tại', hint: 'Trung tâm của vấn đề.', col: 2, row: 4, rowSpan: 2 },
      { label: 'Thử thách', hint: 'Điều đang cản trở hoặc đan xen.', col: 2, row: 4, rowSpan: 2, crossing: true },
      { label: 'Mục tiêu', hint: 'Điều bạn ý thức hướng tới.', col: 2, row: 2, rowSpan: 2 },
      { label: 'Gốc rễ', hint: 'Nền tảng, điều nằm sâu bên dưới.', col: 2, row: 6, rowSpan: 2 },
      { label: 'Quá khứ gần', hint: 'Điều vừa đi qua.', col: 1, row: 4, rowSpan: 2 },
      { label: 'Tương lai gần', hint: 'Điều sắp đến.', col: 3, row: 4, rowSpan: 2 },
      { label: 'Bản thân', hint: 'Thái độ và vị trí của bạn.', col: 5, row: 7, rowSpan: 2 },
      { label: 'Môi trường', hint: 'Người và hoàn cảnh xung quanh.', col: 5, row: 5, rowSpan: 2 },
      { label: 'Hy vọng và lo sợ', hint: 'Điều bạn mong và điều bạn sợ.', col: 5, row: 3, rowSpan: 2 },
      { label: 'Kết quả', hint: 'Chiều hướng cuối cùng.', col: 5, row: 1, rowSpan: 2 },
    ],
  },
];

export const getTarotSpread = (id: TarotSpreadId): TarotSpread => {
  const s = TAROT_SPREADS.find((x) => x.id === id);
  if (!s) throw new Error(`Không có cách trải ${id}`);
  return s;
};
