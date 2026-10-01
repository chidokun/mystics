import { ganzhiName } from '../data/ganzhi';
import type { LunarDate } from './calendar';
import { yearGanzhi } from './bazi';

const MONTH_NAMES = ['', 'Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Mười Một', 'Chạp'];

/** "mùng 1 tháng Giêng năm Giáp Thìn (2024)" */
export function formatLunar(l: LunarDate): string {
  const day = l.day <= 10 ? `mùng ${l.day}` : `ngày ${l.day}`;
  return `${day} tháng ${MONTH_NAMES[l.month]}${l.leap ? ' nhuận' : ''} năm ${ganzhiName(yearGanzhi(l.year))} (${l.year})`;
}

export const pad2 = (n: number) => String(n).padStart(2, '0');

/** "3 tuổi 5 tháng" */
export function formatAge(years: number): string {
  const y = Math.floor(years);
  const m = Math.round((years - y) * 12);
  if (m === 12) return `${y + 1} tuổi`;
  if (y === 0) return `${m} tháng tuổi`;
  return m ? `${y} tuổi ${m} tháng` : `${y} tuổi`;
}
