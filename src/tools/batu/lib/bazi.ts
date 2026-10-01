import { controls, controlledBy, ELEMENT_ORDER, generatedBy, generates, type Element } from '../data/elements';
import { BRANCHES, ganzhiIndex, napAmOf, STEMS } from '../data/ganzhi';
import { BRANCH_COMBOS, BRANCH_TRINES, isClash, STEM_COMBOS, type TenGod } from '../data/gods';
import {
  adjacentJie,
  jdFromDate,
  jdFromLocal,
  jdToDate,
  lunarToSolar,
  solarMonthIndex,
  solarToLunar,
  sunLongitude,
  type LunarDate,
} from './calendar';

export type Gender = 'male' | 'female';
export type PillarKey = 'year' | 'month' | 'day' | 'hour';

export interface BirthInput {
  calendar: 'solar' | 'lunar';
  day: number;
  month: number;
  year: number;
  /** Chỉ dùng cho âm lịch */
  leap?: boolean;
  /** Bỏ trống nếu không rõ giờ sinh */
  hour?: number;
  minute?: number;
  gender: Gender;
}

export interface Pillar {
  key: PillarKey;
  label: string;
  /** Vị trí trong vòng 60 hoa giáp, 0 là Giáp Tý */
  ganzhi: number;
  stem: number;
  branch: number;
  /** Thập thần của thiên can; trụ ngày không có vì chính là nhật chủ */
  stemGod?: TenGod;
  hidden: { stem: number; god: TenGod }[];
}

export interface LuckPillar {
  ganzhi: number;
  fromAge: number;
  fromYear: number;
  god: TenGod;
}

export interface BaziChart {
  solar: { day: number; month: number; year: number };
  lunar: LunarDate;
  time?: { hour: number; minute: number };
  gender: Gender;
  pillars: Pillar[];
  dayMaster: number;
  /** Tỉ trọng ngũ hành (đã tính tàng can), cộng lại bằng 1 */
  elements: Record<Element, number>;
  strength: { ratio: number; label: 'vượng' | 'nhược' | 'trung hòa'; seasonal: boolean };
  favorable: Element[];
  unfavorable: Element[];
  gods: Record<TenGod, number>;
  relations: { kind: 'hợp' | 'xung' | 'tam hợp' | 'can hợp'; text: string }[];
  shensha: { id: string; pillars: PillarKey[] }[];
  luck: { forward: boolean; startAge: number; pillars: LuckPillar[]; term: string };
  /** Cảnh báo khi sinh sát thời điểm giao tiết */
  warnings: string[];
}

export const PILLAR_LABELS: Record<PillarKey, string> = { year: 'Năm', month: 'Tháng', day: 'Ngày', hour: 'Giờ' };

/** Ý nghĩa vị trí của từng trụ */
export const PILLAR_AREAS: Record<PillarKey, string> = {
  year: 'tổ tiên, gia đình gốc, tuổi thơ',
  month: 'cha mẹ, anh chị em, môi trường sự nghiệp',
  day: 'bản thân và người bạn đời',
  hour: 'con cái, ước vọng, tuổi già',
};

export function tenGod(dayMaster: number, other: number): TenGod {
  const a = STEMS[dayMaster];
  const b = STEMS[other];
  const same = a.yang === b.yang;
  if (a.element === b.element) return same ? 'ty' : 'kiep';
  if (generates(a.element) === b.element) return same ? 'thuc' : 'thuong';
  if (controls(a.element) === b.element) return same ? 'thientai' : 'chinhtai';
  if (controls(b.element) === a.element) return same ? 'that' : 'quan';
  return same ? 'thienan' : 'chinhan';
}

// ---------- Tứ trụ ----------

export const yearGanzhi = (year: number) => (((year - 4) % 60) + 60) % 60;

/** Can tháng Dần theo can năm (Ngũ Hổ Độn) */
const firstMonthStem = (yearStem: number) => ((yearStem % 5) * 2 + 2) % 10;
/** Can giờ Tý theo can ngày (Ngũ Thử Độn) */
const firstHourStem = (dayStem: number) => ((dayStem % 5) * 2) % 10;

export const dayGanzhi = (jdn: number) => (((jdn + 49) % 60) + 60) % 60;
export const hourBranch = (hour: number) => Math.floor(((hour + 1) % 24) / 2);

export interface FourPillars {
  year: number;
  month: number;
  day: number;
  hour?: number;
  /** Kinh độ mặt trời lúc sinh */
  longitude: number;
  birthJd: number;
}

/** Tính bốn trụ từ ngày giờ dương lịch theo giờ Việt Nam */
export function fourPillars(day: number, month: number, year: number, hour?: number, minute = 0): FourPillars {
  const knownTime = hour !== undefined;
  const birthJd = jdFromLocal(day, month, year, knownTime ? hour : 12, knownTime ? minute : 0);
  const lon = sunLongitude(birthJd);

  // Năm Bát Tự đổi ở Lập Xuân (kinh độ 315°), không phải ở Tết âm lịch
  const baziYear = month <= 2 && lon >= 270 && lon < 315 ? year - 1 : year;
  const y = yearGanzhi(baziYear);

  const m = solarMonthIndex(lon);
  const monthStem = (firstMonthStem(y % 10) + m) % 10;
  const monthBranch = (m + 2) % 12;

  // Giờ Tý bắt đầu lúc 23h: sinh từ 23h tính sang ngày hôm sau
  const jdn = jdFromDate(day, month, year) + (knownTime && hour >= 23 ? 1 : 0);
  const d = dayGanzhi(jdn);

  let h: number | undefined;
  if (knownTime) {
    const hb = hourBranch(hour);
    h = ganzhiIndex((firstHourStem(d % 10) + hb) % 10, hb);
  }

  return { year: y, month: ganzhiIndex(monthStem, monthBranch), day: d, hour: h, longitude: lon, birthJd };
}

// ---------- Phân tích ----------

const HIDDEN_WEIGHTS = [1, 0.5, 0.3];

function makePillar(key: PillarKey, ganzhi: number, dayMaster: number): Pillar {
  const stem = ganzhi % 10;
  const branch = ganzhi % 12;
  return {
    key,
    label: PILLAR_LABELS[key],
    ganzhi,
    stem,
    branch,
    stemGod: key === 'day' ? undefined : tenGod(dayMaster, stem),
    hidden: BRANCHES[branch].hidden.map((s) => ({ stem: s, god: tenGod(dayMaster, s) })),
  };
}

function elementWeights(pillars: Pillar[]) {
  const all = Object.fromEntries(ELEMENT_ORDER.map((e) => [e, 0])) as Record<Element, number>;
  const others = { ...all };
  for (const p of pillars) {
    all[STEMS[p.stem].element] += 1;
    if (p.key !== 'day') others[STEMS[p.stem].element] += 1;
    // Chi tháng (lệnh tháng) nặng gấp rưỡi vì quyết định khí của mùa sinh
    const factor = p.key === 'month' ? 1.5 : 1;
    BRANCHES[p.branch].hidden.forEach((s, i) => {
      const w = HIDDEN_WEIGHTS[i] * factor;
      all[STEMS[s].element] += w;
      others[STEMS[s].element] += w;
    });
  }
  return { all, others };
}

function analyseStrength(dayMaster: number, pillars: Pillar[], others: Record<Element, number>) {
  const dm = STEMS[dayMaster].element;
  const total = ELEMENT_ORDER.reduce((s, e) => s + others[e], 0);
  const support = others[dm] + others[generatedBy(dm)];
  const ratio = support / total;
  const monthMain = STEMS[BRANCHES[pillars.find((p) => p.key === 'month')!.branch].hidden[0]].element;
  const seasonal = monthMain === dm || monthMain === generatedBy(dm);
  const label: BaziChart['strength']['label'] = ratio >= 0.52 ? 'vượng' : ratio <= 0.4 ? 'nhược' : 'trung hòa';
  return { ratio, label, seasonal };
}

function pickFavorable(dayMaster: number, label: BaziChart['strength']['label'], ratio: number, all: Record<Element, number>) {
  const dm = STEMS[dayMaster].element;
  const output = generates(dm);
  const wealth = controls(dm);
  const power = controlledBy(dm);
  const resource = generatedBy(dm);
  if (label === 'vượng') {
    return {
      favorable: ratio > 0.62 ? [output, wealth, power] : [output, wealth],
      unfavorable: [resource, dm],
    };
  }
  if (label === 'nhược') return { favorable: [resource, dm], unfavorable: [power, wealth] };
  // Trung hòa: bổ sung hành yếu nhất, tránh hành đang mạnh nhất
  const sorted = [...ELEMENT_ORDER].sort((a, b) => all[a] - all[b]);
  return { favorable: sorted.slice(0, 2), unfavorable: [sorted[4]] };
}

function countGods(pillars: Pillar[]) {
  const gods = { ty: 0, kiep: 0, thuc: 0, thuong: 0, thientai: 0, chinhtai: 0, that: 0, quan: 0, thienan: 0, chinhan: 0 } as Record<TenGod, number>;
  for (const p of pillars) {
    if (p.stemGod) gods[p.stemGod] += 1;
    p.hidden.forEach((h, i) => (gods[h.god] += HIDDEN_WEIGHTS[i]));
  }
  return gods;
}

function findRelations(pillars: Pillar[]): BaziChart['relations'] {
  const out: BaziChart['relations'] = [];
  const name = (p: Pillar) => `trụ ${p.label.toLowerCase()}`;
  for (let i = 0; i < pillars.length; i++) {
    for (let j = i + 1; j < pillars.length; j++) {
      const a = pillars[i];
      const b = pillars[j];
      const areas = `${PILLAR_AREAS[a.key]} với ${PILLAR_AREAS[b.key]}`;
      const sc = STEM_COMBOS.find((c) => c.pair.includes(a.stem) && c.pair.includes(b.stem) && a.stem !== b.stem);
      if (sc)
        out.push({
          kind: 'can hợp',
          text: `${STEMS[a.stem].name} ${name(a)} hợp ${STEMS[b.stem].name} ${name(b)} (hóa ${ELEMENT_NAMES[sc.element]}): sự gắn kết, hấp dẫn giữa ${areas}.`,
        });
      const bc = BRANCH_COMBOS.find((c) => c.pair.includes(a.branch) && c.pair.includes(b.branch) && a.branch !== b.branch);
      if (bc)
        out.push({
          kind: 'hợp',
          text: `${BRANCHES[a.branch].name} ${name(a)} lục hợp ${BRANCHES[b.branch].name} ${name(b)}: hòa hợp, hỗ trợ giữa ${areas}.`,
        });
      if (isClash(a.branch, b.branch))
        out.push({
          kind: 'xung',
          text: `${BRANCHES[a.branch].name} ${name(a)} xung ${BRANCHES[b.branch].name} ${name(b)}: biến động, va chạm giữa ${areas}; cũng là động lực thay đổi.`,
        });
    }
  }
  for (const t of BRANCH_TRINES) {
    const present = t.trio.every((b) => pillars.some((p) => p.branch === b));
    if (present)
      out.push({
        kind: 'tam hợp',
        text: `Đủ bộ tam hợp ${t.trio.map((b) => BRANCHES[b].name).join(', ')} (cục ${ELEMENT_NAMES[t.element]}): năng lượng ${ELEMENT_NAMES[t.element]} được tăng cường mạnh.`,
      });
  }
  return out;
}

const ELEMENT_NAMES: Record<Element, string> = { moc: 'Mộc', hoa: 'Hỏa', tho: 'Thổ', kim: 'Kim', thuy: 'Thủy' };

const QUY_NHAN: number[][] = [[1, 7], [0, 8], [11, 9], [11, 9], [1, 7], [0, 8], [1, 7], [6, 2], [3, 5], [3, 5]];
const VAN_XUONG = [5, 6, 8, 9, 8, 9, 11, 0, 2, 3];
/** Nhóm tam hợp của một chi: 0 Thân Tý Thìn, 1 Dần Ngọ Tuất, 2 Tỵ Dậu Sửu, 3 Hợi Mão Mùi */
const TRINE_GROUP = [0, 2, 1, 3, 0, 2, 1, 3, 0, 2, 1, 3];
const DAO_HOA = [9, 3, 6, 0];
const DICH_MA = [2, 8, 11, 5];
const HOA_CAI = [4, 10, 1, 7];

function findShensha(pillars: Pillar[], dayMaster: number): BaziChart['shensha'] {
  const year = pillars.find((p) => p.key === 'year')!;
  const day = pillars.find((p) => p.key === 'day')!;
  const at = (targets: number[]) => pillars.filter((p) => targets.includes(p.branch)).map((p) => p.key);
  const byBranch = (table: number[]) => [...new Set([table[TRINE_GROUP[year.branch]], table[TRINE_GROUP[day.branch]]])];
  const rows: BaziChart['shensha'] = [
    { id: 'quynhan', pillars: at(QUY_NHAN[dayMaster]) },
    { id: 'vanxuong', pillars: at([VAN_XUONG[dayMaster]]) },
    { id: 'daohoa', pillars: at(byBranch(DAO_HOA)) },
    { id: 'dichma', pillars: at(byBranch(DICH_MA)) },
    { id: 'hoacai', pillars: at(byBranch(HOA_CAI)) },
  ];
  return rows.filter((r) => r.pillars.length > 0);
}

function luckPillars(fp: FourPillars, gender: Gender, dayMaster: number, birthYear: number): BaziChart['luck'] {
  const yearYang = STEMS[fp.year % 10].yang;
  const forward = (gender === 'male') === yearYang;
  const term = adjacentJie(fp.birthJd, forward ? 1 : -1);
  const days = Math.abs(term.jd - fp.birthJd);
  // Ba ngày tương ứng một năm vận
  const startAge = days / 3;
  const startDate = jdToDate(Math.floor(fp.birthJd + 0.5 + startAge * 365.2422));
  const pillars: LuckPillar[] = Array.from({ length: 8 }, (_, i) => {
    const ganzhi = (((fp.month + (forward ? 1 : -1) * (i + 1)) % 60) + 60) % 60;
    return {
      ganzhi,
      fromAge: startAge + i * 10,
      fromYear: Math.max(startDate.year, birthYear) + i * 10,
      god: tenGod(dayMaster, ganzhi % 10),
    };
  });
  return { forward, startAge, pillars, term: term.name };
}

export class BirthError extends Error {}

export function buildChart(input: BirthInput): BaziChart {
  let solar = { day: input.day, month: input.month, year: input.year };
  if (input.calendar === 'lunar') {
    const s = lunarToSolar(input.day, input.month, input.year, Boolean(input.leap));
    if (!s) throw new BirthError(input.leap ? 'Năm đó không có tháng nhuận này.' : 'Ngày âm lịch này không tồn tại (tháng thiếu chỉ có 29 ngày).');
    solar = s;
  } else if (solar.day > new Date(solar.year, solar.month, 0).getDate()) {
    throw new BirthError('Ngày dương lịch không hợp lệ.');
  }
  const lunar = solarToLunar(solar.day, solar.month, solar.year);
  const fp = fourPillars(solar.day, solar.month, solar.year, input.hour, input.minute ?? 0);
  const dayMaster = fp.day % 10;

  const pillars: Pillar[] = [
    makePillar('year', fp.year, dayMaster),
    makePillar('month', fp.month, dayMaster),
    makePillar('day', fp.day, dayMaster),
  ];
  if (fp.hour !== undefined) pillars.push(makePillar('hour', fp.hour, dayMaster));

  const { all, others } = elementWeights(pillars);
  const sum = ELEMENT_ORDER.reduce((s, e) => s + all[e], 0);
  const elements = Object.fromEntries(ELEMENT_ORDER.map((e) => [e, all[e] / sum])) as Record<Element, number>;
  const strength = analyseStrength(dayMaster, pillars, others);
  const { favorable, unfavorable } = pickFavorable(dayMaster, strength.label, strength.ratio, all);

  const warnings: string[] = [];
  const prev = adjacentJie(fp.birthJd, -1);
  const next = adjacentJie(fp.birthJd, 1);
  const hoursToTerm = Math.min(fp.birthJd - prev.jd, next.jd - fp.birthJd) * 24;
  const nearest = fp.birthJd - prev.jd < next.jd - fp.birthJd ? prev : next;
  if (input.hour === undefined && hoursToTerm < 12) {
    warnings.push(`Ngày sinh trùng ngày giao tiết ${nearest.name}. Không rõ giờ sinh nên trụ tháng${nearest.name === 'Lập Xuân' ? ' và trụ năm' : ''} có thể chưa chính xác.`);
  } else if (input.hour !== undefined && hoursToTerm < 2) {
    warnings.push(`Bạn sinh trong vòng 2 giờ quanh lúc giao tiết ${nearest.name}. Nếu giờ sinh ghi lệch, trụ tháng${nearest.name === 'Lập Xuân' ? ' và trụ năm' : ''} có thể khác.`);
  }

  return {
    solar,
    lunar,
    time: input.hour !== undefined ? { hour: input.hour, minute: input.minute ?? 0 } : undefined,
    gender: input.gender,
    pillars,
    dayMaster,
    elements,
    strength,
    favorable,
    unfavorable,
    gods: countGods(pillars),
    relations: findRelations(pillars),
    shensha: findShensha(pillars, dayMaster),
    luck: luckPillars(fp, input.gender, dayMaster, solar.year),
    warnings,
  };
}

/** Can chi và thập thần của các năm sắp tới (lưu niên) */
export function annualPillars(dayMaster: number, fromYear: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const year = fromYear + i;
    const ganzhi = yearGanzhi(year);
    return { year, ganzhi, god: tenGod(dayMaster, ganzhi % 10) };
  });
}

export { napAmOf };
