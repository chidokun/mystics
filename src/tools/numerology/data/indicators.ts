import type { NumberMeaning } from './numbers';

export type IndicatorId =
  | 'expression'
  | 'soul'
  | 'personality'
  | 'birthday'
  | 'attitude'
  | 'maturity'
  | 'balance';

export interface Indicator {
  id: IndicatorId;
  name: string;
  /** Chỉ số này nói về điều gì */
  about: string;
  /** Cách tính, viết ngắn gọn */
  how: string;
  /** Lấy câu diễn giải phù hợp từ ý nghĩa con số */
  line: (m: NumberMeaning) => string;
}

export const INDICATORS: Indicator[] = [
  {
    id: 'expression',
    name: 'Số sứ mệnh',
    about: 'Tài năng bẩm sinh và điều bạn đến để làm.',
    how: 'Tổng giá trị mọi chữ cái trong họ tên.',
    line: (m) => m.mission,
  },
  {
    id: 'soul',
    name: 'Số linh hồn',
    about: 'Khao khát sâu kín bên trong.',
    how: 'Tổng các nguyên âm (A, E, I, O, U, Y) trong họ tên.',
    line: (m) => m.soul,
  },
  {
    id: 'personality',
    name: 'Số nhân cách',
    about: 'Ấn tượng bạn để lại trong mắt người khác.',
    how: 'Tổng các phụ âm trong họ tên.',
    line: (m) => m.persona,
  },
  {
    id: 'birthday',
    name: 'Số ngày sinh',
    about: 'Một năng khiếu đặc biệt hỗ trợ con đường chính.',
    how: 'Ngày sinh rút gọn.',
    line: (m) => `Năng khiếu nổi bật: ${m.keywords.slice(0, 2).join(' và ')}. ${m.strengths[0]}.`,
  },
  {
    id: 'attitude',
    name: 'Số thái độ',
    about: 'Phản ứng đầu tiên của bạn trước tình huống mới.',
    how: 'Ngày cộng tháng sinh, rút gọn.',
    line: (m) => `Bạn thường phản ứng theo hướng ${m.keywords.slice(0, 2).join(', ')}. ${m.persona}`,
  },
  {
    id: 'maturity',
    name: 'Số trưởng thành',
    about: 'Mục tiêu bạn dần hướng tới sau tuổi 35–40.',
    how: 'Số chủ đạo cộng số sứ mệnh, rút gọn.',
    line: (m) => `Càng trưởng thành, bạn càng hướng về hình mẫu "${m.title.toLowerCase()}". ${m.advice}`,
  },
  {
    id: 'balance',
    name: 'Số cân bằng',
    about: 'Cách lấy lại thăng bằng khi gặp khó khăn.',
    how: 'Tổng chữ cái đầu của mỗi từ trong họ tên.',
    line: (m) => `Khi rối, hãy dựa vào phẩm chất ${m.keywords.slice(0, 2).join(' và ')} của mình. ${m.advice}`,
  },
];
