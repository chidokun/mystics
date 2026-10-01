/**
 * Lịch thiên văn dùng cho Bát Tự:
 * - Ngày Julius, kinh độ mặt trời (công thức rút gọn của Jean Meeus, sai số cỡ vài phút)
 * - Tiết khí: thời điểm mặt trời đi tới kinh độ 15°, 45°, … 345°
 * - Âm lịch Việt Nam theo thuật toán của Hồ Ngọc Đức, múi giờ UTC+7
 */

export const VN_TIMEZONE = 7;
const DR = Math.PI / 180;
const INT = Math.floor;

/** Số ngày Julius (tại trưa) của một ngày dương lịch */
export function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = INT((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
  if (jd < 2299161) jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
  return jd;
}

export function jdToDate(jd: number): { day: number; month: number; year: number } {
  let b: number;
  let c: number;
  if (jd > 2299160) {
    const a = jd + 32044;
    b = INT((4 * a + 3) / 146097);
    c = a - INT((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = INT((4 * c + 3) / 1461);
  const e = c - INT((1461 * d) / 4);
  const m = INT((5 * e + 2) / 153);
  return {
    day: e - INT((153 * m + 2) / 5) + 1,
    month: m + 3 - 12 * INT(m / 10),
    year: b * 100 + d - 4800 + INT(m / 10),
  };
}

/** Ngày Julius (có phần lẻ, theo giờ quốc tế) của một thời điểm theo giờ địa phương */
export function jdFromLocal(day: number, month: number, year: number, hour: number, minute: number, tz = VN_TIMEZONE): number {
  return jdFromDate(day, month, year) - 0.5 + (hour + minute / 60 - tz) / 24;
}

/**
 * Kinh độ mặt trời, tính bằng độ trong [0, 360).
 * `apparent` thêm hiệu chỉnh quang sai và chương động (dùng cho tiết khí);
 * bỏ đi để khớp đúng công thức âm lịch của Hồ Ngọc Đức.
 */
export function sunLongitude(jd: number, apparent = true): number {
  const T = (jd - 2451545.0) / 36525;
  const T2 = T * T;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(DR * M);
  DL += (0.019993 - 0.000101 * T) * Math.sin(DR * 2 * M) + 0.00029 * Math.sin(DR * 3 * M);
  let L = L0 + DL;
  if (apparent) L += -0.00569 - 0.00478 * Math.sin(DR * (125.04 - 1934.136 * T));
  return ((L % 360) + 360) % 360;
}

const wrap180 = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180;

/** Thời điểm (ngày Julius) gần `nearJd` nhất mà mặt trời ở kinh độ `target` */
export function findSunLongitude(target: number, nearJd: number): number {
  let jd = nearJd;
  for (let i = 0; i < 8; i++) {
    const diff = wrap180(target - sunLongitude(jd));
    jd += diff / 0.98565;
    if (Math.abs(diff) < 1e-5) break;
  }
  return jd;
}

/** 12 tiết mở đầu các tháng Bát Tự, theo thứ tự từ tháng Dần */
export const JIE_TERMS = [
  { name: 'Lập Xuân', longitude: 315 },
  { name: 'Kinh Trập', longitude: 345 },
  { name: 'Thanh Minh', longitude: 15 },
  { name: 'Lập Hạ', longitude: 45 },
  { name: 'Mang Chủng', longitude: 75 },
  { name: 'Tiểu Thử', longitude: 105 },
  { name: 'Lập Thu', longitude: 135 },
  { name: 'Bạch Lộ', longitude: 165 },
  { name: 'Hàn Lộ', longitude: 195 },
  { name: 'Lập Đông', longitude: 225 },
  { name: 'Đại Tuyết', longitude: 255 },
  { name: 'Tiểu Hàn', longitude: 285 },
];

/** Tháng tiết khí (0 là tháng Dần) ứng với kinh độ mặt trời */
export const solarMonthIndex = (longitude: number) => INT((((longitude - 315) % 360) + 360) % 360 / 30);

/** Tiết khí gần nhất về phía trước (dir = 1) hoặc phía sau (dir = -1) của một thời điểm */
export function adjacentJie(jd: number, dir: 1 | -1): { jd: number; name: string } {
  const lon = sunLongitude(jd);
  const month = solarMonthIndex(lon);
  const targetMonth = dir === 1 ? (month + 1) % 12 : month;
  const term = JIE_TERMS[targetMonth];
  const delta = dir === 1 ? (((term.longitude - lon) % 360) + 360) % 360 : -((((lon - term.longitude) % 360) + 360) % 360);
  return { jd: findSunLongitude(term.longitude, jd + delta / 0.98565), name: term.name };
}

// ---------------- Âm lịch (thuật toán Hồ Ngọc Đức) ----------------

function newMoon(k: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  let jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * DR);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * DR) + 0.0021 * Math.sin(2 * DR * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * DR) + 0.0161 * Math.sin(DR * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(DR * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(DR * 2 * F) - 0.0051 * Math.sin(DR * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(DR * (M - Mpr)) + 0.0004 * Math.sin(DR * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(DR * (2 * F - M)) - 0.0006 * Math.sin(DR * (2 * F + Mpr));
  C1 = C1 + 0.001 * Math.sin(DR * (2 * F - Mpr)) + 0.0005 * Math.sin(DR * (2 * Mpr + M));
  const deltat =
    T < -11
      ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
      : -0.000278 + 0.000265 * T + 0.000262 * T2;
  return jd1 + C1 - deltat;
}

const newMoonDay = (k: number, tz: number) => INT(newMoon(k) + 0.5 + tz / 24);

/** Cung (0–11, mỗi cung 30°) của mặt trời vào đầu ngày theo giờ địa phương */
const sunSector = (dayNumber: number, tz: number) => INT(sunLongitude(dayNumber - 0.5 - tz / 24, false) / 30);

function lunarMonth11(yy: number, tz: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = INT(off / 29.530588853);
  let nm = newMoonDay(k, tz);
  if (sunSector(nm, tz) >= 9) nm = newMoonDay(k - 1, tz);
  return nm;
}

function leapMonthOffset(a11: number, tz: number): number {
  const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last: number;
  let i = 1;
  let arc = sunSector(newMoonDay(k + i, tz), tz);
  do {
    last = arc;
    i++;
    arc = sunSector(newMoonDay(k + i, tz), tz);
  } while (arc !== last && i < 14);
  return i - 1;
}

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  leap: boolean;
}

export function solarToLunar(dd: number, mm: number, yy: number, tz = VN_TIMEZONE): LunarDate {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = newMoonDay(k + 1, tz);
  if (monthStart > dayNumber) monthStart = newMoonDay(k, tz);
  let a11 = lunarMonth11(yy, tz);
  let b11 = a11;
  let lunarYear: number;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = lunarMonth11(yy - 1, tz);
  } else {
    lunarYear = yy + 1;
    b11 = lunarMonth11(yy + 1, tz);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = INT((monthStart - a11) / 29);
  let leap = false;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapDiff = leapMonthOffset(a11, tz);
    if (diff >= leapDiff) {
      lunarMonth = diff + 10;
      if (diff === leapDiff) leap = true;
    }
  }
  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
  return { day: lunarDay, month: lunarMonth, year: lunarYear, leap };
}

/** Trả về null nếu ngày âm lịch không tồn tại (ví dụ tháng nhuận không có trong năm đó) */
export function lunarToSolar(
  lunarDay: number,
  lunarMonth: number,
  lunarYear: number,
  leap: boolean,
  tz = VN_TIMEZONE,
): { day: number; month: number; year: number } | null {
  let a11: number;
  let b11: number;
  if (lunarMonth < 11) {
    a11 = lunarMonth11(lunarYear - 1, tz);
    b11 = lunarMonth11(lunarYear, tz);
  } else {
    a11 = lunarMonth11(lunarYear, tz);
    b11 = lunarMonth11(lunarYear + 1, tz);
  }
  const k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = lunarMonth - 11;
  if (off < 0) off += 12;
  if (b11 - a11 > 365) {
    const leapOff = leapMonthOffset(a11, tz);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) leapMonth += 12;
    if (leap && lunarMonth !== leapMonth) return null;
    if (leap || off >= leapOff) off += 1;
  } else if (leap) {
    return null;
  }
  const monthStart = newMoonDay(k + off, tz);
  const result = jdToDate(monthStart + lunarDay - 1);
  // Ngày 30 của tháng thiếu sẽ tràn sang tháng sau
  const back = solarToLunar(result.day, result.month, result.year, tz);
  if (back.day !== lunarDay || back.month !== lunarMonth || back.leap !== leap) return null;
  return result;
}

/** Tháng nhuận của một năm âm lịch, hoặc 0 nếu không có */
export function leapMonthOf(lunarYear: number, tz = VN_TIMEZONE): number {
  for (let m = 1; m <= 12; m++) if (lunarToSolar(1, m, lunarYear, true, tz)) return m;
  return 0;
}
