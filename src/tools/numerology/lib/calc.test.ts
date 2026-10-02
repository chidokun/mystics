import { describe, expect, it } from 'vitest';
import {
  birthChart,
  buildProfile,
  findArrows,
  gridPosition,
  isValidDate,
  letterValue,
  lifePath,
  nameNumbers,
  peakBase,
  personalMonth,
  nameWords,
  peaks,
  personalYear,
  reduce,
  worldYear,
} from './calc';

describe('reduce', () => {
  it('rút gọn và giữ số bậc thầy', () => {
    expect(reduce(39)).toBe(3);
    expect(reduce(29)).toBe(11);
    expect(reduce(22)).toBe(22);
    expect(reduce(33)).toBe(33);
    expect(reduce(33, [])).toBe(6);
  });
});

describe('lifePath', () => {
  it('cộng mọi chữ số rồi rút gọn', () => {
    expect(lifePath({ day: 15, month: 8, year: 1996 })).toBe(3); // 39 → 12 → 3
  });
  it('giữ 10, 11 và 22', () => {
    expect(lifePath({ day: 1, month: 1, year: 2006 })).toBe(10);
    expect(lifePath({ day: 2, month: 9, year: 1971 })).toBe(11);
    expect(lifePath({ day: 1, month: 1, year: 1964 })).toBe(22);
  });
  it('rút 33 về 6', () => {
    expect(lifePath({ day: 6, month: 9, year: 1980 })).toBe(6);
  });
});

describe('tên', () => {
  it('bỏ dấu tiếng Việt và ký tự lạ', () => {
    expect(nameWords('  Nguyễn Văn  Đức-Anh ')).toEqual(['NGUYEN', 'VAN', 'DUC', 'ANH']);
  });
  it('quy đổi chữ cái theo bảng Pythagoras', () => {
    expect(['A', 'I', 'J', 'R', 'S', 'Z'].map(letterValue)).toEqual([1, 9, 1, 9, 1, 8]);
  });
  it('tính sứ mệnh, linh hồn, nhân cách', () => {
    const n = nameNumbers('Nguyễn Văn An');
    expect(n.expression).toBe(3); // 48
    expect(n.soul).toBe(8); // U Y E A A = 17
    expect(n.personality).toBe(4); // 31
    expect(n.balance).toBe(1); // N V A = 5 + 4 + 1 = 10 → 1
  });
});

describe('biểu đồ ngày sinh', () => {
  it('đếm chữ số, bỏ số 0', () => {
    const c = birthChart({ day: 15, month: 8, year: 1996 });
    expect(c).toEqual({ 1: 2, 2: 0, 3: 0, 4: 0, 5: 1, 6: 1, 7: 0, 8: 1, 9: 2 });
  });
  it('tìm mũi tên', () => {
    const c = birthChart({ day: 15, month: 8, year: 1996 });
    expect(findArrows(c)).toEqual({ full: ['159'], empty: [] });
    const c2 = birthChart({ day: 11, month: 1, year: 2000 });
    const { empty } = findArrows(c2);
    expect(empty).toEqual(expect.arrayContaining(['456', '789', '369', '357']));
  });
  it('đặt 3-6-9 ở hàng trên, 1-4-7 ở hàng dưới', () => {
    expect(gridPosition(3)).toEqual({ col: 0, row: 0 });
    expect(gridPosition(1)).toEqual({ col: 0, row: 2 });
    expect(gridPosition(9)).toEqual({ col: 2, row: 0 });
    expect(gridPosition(5)).toEqual({ col: 1, row: 1 });
  });
});

describe('chu kỳ', () => {
  it('năm cá nhân', () => {
    expect(personalYear({ day: 15, month: 8, year: 1996 }, 2026)).toBe(6); // 1+5+8+2+0+2+6 = 24
  });
  it('năm thế giới', () => {
    expect([2017, 2020, 2024, 2025, 2026, 2027].map(worldYear)).toEqual([1, 4, 8, 9, 1, 2]);
  });
  it('tháng cá nhân trong năm', () => {
    const date = { day: 15, month: 8, year: 1996 };
    // Năm cá nhân 2026 là 6: tháng 1 → 7, tháng 3 → 9, tháng 4 → 1
    expect([1, 3, 4, 12].map((m) => personalMonth(date, 2026, m))).toEqual([7, 9, 1, 9]);
  });
  it('số gốc của kim tự tháp đỉnh cao', () => {
    expect(peakBase({ day: 15, month: 8, year: 1996 })).toEqual({ day: 6, month: 8, year: 7 });
  });
  it('bốn đỉnh và thử thách', () => {
    const p = peaks({ day: 15, month: 8, year: 1996 });
    expect(p.map((x) => x.age)).toEqual([33, 42, 51, 60]);
    expect(p.map((x) => x.pinnacle)).toEqual([5, 4, 9, 6]);
    expect(p.map((x) => x.challenge)).toEqual([2, 1, 1, 1]);
    expect(p[0].year).toBe(2029);
  });
});

describe('isValidDate', () => {
  it('kiểm tra ngày hợp lệ', () => {
    expect(isValidDate({ day: 29, month: 2, year: 2024 })).toBe(true);
    expect(isValidDate({ day: 29, month: 2, year: 2023 })).toBe(false);
    expect(isValidDate({ day: 31, month: 4, year: 2000 })).toBe(false);
  });
});

describe('buildProfile', () => {
  it('tổng hợp đầy đủ', () => {
    const p = buildProfile('Nguyễn Văn An', { day: 15, month: 8, year: 1996 }, new Date(2026, 9, 1));
    expect(p.lifePath).toBe(3);
    expect(p.birthday).toBe(6);
    expect(p.attitude).toBe(5);
    expect(p.maturity).toBe(6);
    expect(p.personalMonth).toBe(7); // 6 + 10 = 16 → 7
    expect(p.age).toBe(30);
    expect(p.passion).toEqual([5]);
    expect(p.missingInName).toEqual([2, 6, 8, 9]);
  });
});
