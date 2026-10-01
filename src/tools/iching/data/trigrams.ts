export type TrigramId = 'can' | 'doai' | 'ly' | 'chan' | 'ton' | 'kham' | 'cang' | 'khon';

export interface Trigram {
  id: TrigramId;
  /** Tên quái: Càn, Đoài… */
  name: string;
  /** Tượng tự nhiên: Thiên, Trạch… */
  nature: string;
  /** Nghĩa tiếng Việt của tượng */
  natureVi: string;
  symbol: string;
  /** Ba hào từ dưới lên, true là hào dương */
  lines: [boolean, boolean, boolean];
  /** Số Tiên thiên dùng trong Mai Hoa Dịch Số */
  number: number;
  quality: string;
  family: string;
  direction: string;
  element: string;
  body: string;
}

export const TRIGRAMS: Trigram[] = [
  {
    id: 'can',
    name: 'Càn',
    nature: 'Thiên',
    natureVi: 'Trời',
    symbol: '☰',
    lines: [true, true, true],
    number: 1,
    quality: 'Cương kiện, sáng tạo, mạnh mẽ không ngừng',
    family: 'Cha',
    direction: 'Tây Bắc',
    element: 'Kim',
    body: 'Đầu',
  },
  {
    id: 'doai',
    name: 'Đoài',
    nature: 'Trạch',
    natureVi: 'Đầm',
    symbol: '☱',
    lines: [true, true, false],
    number: 2,
    quality: 'Vui vẻ, cởi mở, giao tiếp',
    family: 'Thiếu nữ (con gái út)',
    direction: 'Tây',
    element: 'Kim',
    body: 'Miệng',
  },
  {
    id: 'ly',
    name: 'Ly',
    nature: 'Hỏa',
    natureVi: 'Lửa',
    symbol: '☲',
    lines: [true, false, true],
    number: 3,
    quality: 'Sáng suốt, rực rỡ, nương tựa',
    family: 'Trung nữ (con gái giữa)',
    direction: 'Nam',
    element: 'Hỏa',
    body: 'Mắt',
  },
  {
    id: 'chan',
    name: 'Chấn',
    nature: 'Lôi',
    natureVi: 'Sấm',
    symbol: '☳',
    lines: [true, false, false],
    number: 4,
    quality: 'Chấn động, khởi phát, hành động',
    family: 'Trưởng nam (con trai cả)',
    direction: 'Đông',
    element: 'Mộc',
    body: 'Chân',
  },
  {
    id: 'ton',
    name: 'Tốn',
    nature: 'Phong',
    natureVi: 'Gió',
    symbol: '☴',
    lines: [false, true, true],
    number: 5,
    quality: 'Mềm mỏng, thấm sâu, thuận theo',
    family: 'Trưởng nữ (con gái cả)',
    direction: 'Đông Nam',
    element: 'Mộc',
    body: 'Đùi',
  },
  {
    id: 'kham',
    name: 'Khảm',
    nature: 'Thủy',
    natureVi: 'Nước',
    symbol: '☵',
    lines: [false, true, false],
    number: 6,
    quality: 'Hiểm trở, sâu thẳm, chảy mãi',
    family: 'Trung nam (con trai giữa)',
    direction: 'Bắc',
    element: 'Thủy',
    body: 'Tai',
  },
  {
    id: 'cang',
    name: 'Cấn',
    nature: 'Sơn',
    natureVi: 'Núi',
    symbol: '☶',
    lines: [false, false, true],
    number: 7,
    quality: 'Dừng lại, tĩnh lặng, vững vàng',
    family: 'Thiếu nam (con trai út)',
    direction: 'Đông Bắc',
    element: 'Thổ',
    body: 'Tay',
  },
  {
    id: 'khon',
    name: 'Khôn',
    nature: 'Địa',
    natureVi: 'Đất',
    symbol: '☷',
    lines: [false, false, false],
    number: 8,
    quality: 'Nhu thuận, bao dung, nuôi dưỡng',
    family: 'Mẹ',
    direction: 'Tây Nam',
    element: 'Thổ',
    body: 'Bụng',
  },
];

export const getTrigram = (id: TrigramId): Trigram => TRIGRAMS.find((t) => t.id === id)!;

export const trigramFromLines = (lines: readonly boolean[]): Trigram => {
  const found = TRIGRAMS.find((t) => t.lines.every((l, i) => l === lines[i]));
  if (!found) throw new Error('Ba hào không hợp lệ');
  return found;
};

/** Mai Hoa Dịch Số: số dư 1–8 (0 tính là 8) ứng với quái theo thứ tự Tiên thiên */
export const trigramFromNumber = (n: number): Trigram => {
  const r = ((n % 8) + 8) % 8 || 8;
  return TRIGRAMS.find((t) => t.number === r)!;
};
