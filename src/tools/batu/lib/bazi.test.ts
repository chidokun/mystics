import { describe, expect, it } from 'vitest';
import { ganzhiIndex, ganzhiName, napAmOf } from '../data/ganzhi';
import { buildChart, fourPillars, tenGod, yearGanzhi } from './bazi';
import { adjacentJie, jdFromDate, jdFromLocal, jdToDate, leapMonthOf, lunarToSolar, solarToLunar, sunLongitude } from './calendar';

const names = (fp: ReturnType<typeof fourPillars>) =>
  [fp.year, fp.month, fp.day, fp.hour].map((g) => (g === undefined ? '-' : ganzhiName(g)));

describe('lịch', () => {
  it('đổi qua lại ngày Julius', () => {
    expect(jdFromDate(1, 1, 2000)).toBe(2451545);
    expect(jdToDate(2451545)).toEqual({ day: 1, month: 1, year: 2000 });
    expect(jdFromDate(4, 2, 2024)).toBe(2460345);
  });

  it('dương lịch sang âm lịch: các ngày Tết', () => {
    expect(solarToLunar(10, 2, 2024)).toEqual({ day: 1, month: 1, year: 2024, leap: false });
    expect(solarToLunar(29, 1, 2025)).toEqual({ day: 1, month: 1, year: 2025, leap: false });
    expect(solarToLunar(22, 1, 2023)).toEqual({ day: 1, month: 1, year: 2023, leap: false });
    expect(solarToLunar(27, 1, 1990)).toEqual({ day: 1, month: 1, year: 1990, leap: false });
    // Ngày cuối năm âm lịch vẫn thuộc năm cũ
    expect(solarToLunar(9, 2, 2024)).toMatchObject({ month: 12, year: 2023 });
  });

  it('âm lịch sang dương lịch, kể cả tháng nhuận', () => {
    expect(lunarToSolar(1, 1, 2025, false)).toEqual({ day: 29, month: 1, year: 2025 });
    expect(lunarToSolar(1, 2, 2023, false)).toEqual({ day: 20, month: 2, year: 2023 });
    expect(lunarToSolar(1, 2, 2023, true)).toEqual({ day: 22, month: 3, year: 2023 });
    expect(lunarToSolar(1, 4, 2020, true)).toEqual({ day: 23, month: 5, year: 2020 });
    expect(lunarToSolar(1, 3, 2024, true)).toBeNull();
  });

  it('tìm tháng nhuận', () => {
    expect(leapMonthOf(2023)).toBe(2);
    expect(leapMonthOf(2020)).toBe(4);
    expect(leapMonthOf(2025)).toBe(6);
    expect(leapMonthOf(2024)).toBe(0);
  });

  it('Lập Xuân 2024 rơi vào chiều 4/2 giờ Việt Nam', () => {
    const jd = adjacentJie(jdFromLocal(1, 2, 2024, 0, 0), 1).jd;
    const local = jd + 7 / 24 + 0.5;
    const date = jdToDate(Math.floor(local));
    const hours = (local - Math.floor(local)) * 24;
    expect(date).toEqual({ day: 4, month: 2, year: 2024 });
    expect(hours).toBeGreaterThan(15);
    expect(hours).toBeLessThan(16);
    expect(sunLongitude(jd)).toBeCloseTo(315, 3);
  });
});

describe('tứ trụ', () => {
  it('can chi năm và vòng 60', () => {
    expect(ganzhiName(yearGanzhi(1984))).toBe('Giáp Tý');
    expect(ganzhiName(yearGanzhi(2024))).toBe('Giáp Thìn');
    expect(ganzhiIndex(2, 2)).toBe(2);
    expect(ganzhiName(ganzhiIndex(9, 11))).toBe('Quý Hợi');
  });

  it('trụ ngày theo các mốc đã biết', () => {
    expect(names(fourPillars(1, 10, 1949))[2]).toBe('Giáp Tý');
    expect(names(fourPillars(1, 1, 2000))[2]).toBe('Mậu Ngọ');
  });

  it('mùng 1 Tết Giáp Thìn, giữa trưa', () => {
    expect(names(fourPillars(10, 2, 2024, 12, 0))).toEqual(['Giáp Thìn', 'Bính Dần', 'Giáp Thìn', 'Canh Ngọ']);
  });

  it('năm và tháng đổi ở Lập Xuân chứ không ở Tết', () => {
    expect(names(fourPillars(4, 2, 2024, 10, 0)).slice(0, 2)).toEqual(['Quý Mão', 'Ất Sửu']);
    expect(names(fourPillars(4, 2, 2024, 18, 0)).slice(0, 2)).toEqual(['Giáp Thìn', 'Bính Dần']);
  });

  it('sinh từ 23h tính sang ngày hôm sau', () => {
    const late = fourPillars(9, 2, 2024, 23, 30);
    const next = fourPillars(10, 2, 2024, 0, 30);
    expect(late.day).toBe(next.day);
    expect(late.hour).toBe(next.hour);
    expect(ganzhiName(late.hour!)).toBe('Giáp Tý');
  });

  it('không rõ giờ thì chỉ có ba trụ', () => {
    expect(fourPillars(10, 2, 2024).hour).toBeUndefined();
  });
});

describe('phân tích', () => {
  it('thập thần so với nhật chủ Giáp', () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((s) => tenGod(0, s))).toEqual([
      'kiep',
      'thuc',
      'thuong',
      'thientai',
      'chinhtai',
      'that',
      'quan',
      'thienan',
      'chinhan',
      'ty',
    ]);
  });

  it('nạp âm', () => {
    expect(napAmOf(yearGanzhi(1984)).name).toBe('Hải Trung Kim');
    expect(napAmOf(yearGanzhi(1990)).name).toBe('Lộ Bàng Thổ');
    expect(napAmOf(yearGanzhi(2024)).name).toBe('Phú Đăng Hỏa');
  });

  it('lập lá số từ ngày âm lịch giống như từ dương lịch', () => {
    const a = buildChart({ calendar: 'solar', day: 10, month: 2, year: 2024, hour: 12, gender: 'male' });
    const b = buildChart({ calendar: 'lunar', day: 1, month: 1, year: 2024, hour: 12, gender: 'male' });
    expect(b.pillars.map((p) => p.ganzhi)).toEqual(a.pillars.map((p) => p.ganzhi));
    expect(a.lunar).toEqual({ day: 1, month: 1, year: 2024, leap: false });
  });

  it('đại vận thuận cho nam năm dương, nghịch cho nữ năm dương', () => {
    const male = buildChart({ calendar: 'solar', day: 10, month: 2, year: 2024, hour: 12, gender: 'male' });
    const female = buildChart({ calendar: 'solar', day: 10, month: 2, year: 2024, hour: 12, gender: 'female' });
    expect(male.luck.forward).toBe(true);
    expect(female.luck.forward).toBe(false);
    // Tháng Bính Dần: vận thuận bắt đầu Đinh Mão, vận nghịch bắt đầu Ất Sửu
    expect(ganzhiName(male.luck.pillars[0].ganzhi)).toBe('Đinh Mão');
    expect(ganzhiName(female.luck.pillars[0].ganzhi)).toBe('Ất Sửu');
    for (const c of [male, female]) {
      expect(c.luck.startAge).toBeGreaterThanOrEqual(0);
      expect(c.luck.startAge).toBeLessThanOrEqual(10.5);
    }
  });

  it('tỉ trọng ngũ hành cộng lại bằng 1', () => {
    const c = buildChart({ calendar: 'solar', day: 15, month: 8, year: 1996, hour: 9, minute: 30, gender: 'female' });
    const total = Object.values(c.elements).reduce((a, b) => a + b, 0);
    expect(total).toBeCloseTo(1, 6);
    expect(c.favorable.length).toBeGreaterThan(0);
  });

  it('báo lỗi ngày âm lịch không tồn tại', () => {
    expect(() => buildChart({ calendar: 'lunar', day: 1, month: 3, year: 2024, leap: true, gender: 'male' })).toThrow();
  });

  it('cảnh báo khi sinh sát giờ giao tiết', () => {
    const c = buildChart({ calendar: 'solar', day: 4, month: 2, year: 2024, hour: 15, minute: 0, gender: 'male' });
    expect(c.warnings.length).toBe(1);
  });

  it('chạy ổn định qua nhiều năm', () => {
    for (let y = 1920; y <= 2080; y += 7) {
      for (const m of [1, 2, 6, 12]) {
        const c = buildChart({ calendar: 'solar', day: 3 + (y % 20), month: m, year: y, hour: (y * 7) % 24, gender: y % 2 ? 'male' : 'female' });
        expect(c.pillars).toHaveLength(4);
        expect(c.luck.pillars).toHaveLength(8);
      }
    }
  });
});
