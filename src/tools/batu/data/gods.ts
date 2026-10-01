import type { Element } from './elements';

export type TenGod = 'ty' | 'kiep' | 'thuc' | 'thuong' | 'thientai' | 'chinhtai' | 'that' | 'quan' | 'thienan' | 'chinhan';

export interface TenGodInfo {
  id: TenGod;
  name: string;
  short: string;
  /** Quan hệ với nhật chủ */
  relation: string;
  meaning: string;
  /** Khi thập thần này nổi bật trong lá số */
  strong: string;
}

export const TEN_GODS: Record<TenGod, TenGodInfo> = {
  ty: {
    id: 'ty',
    name: 'Tỷ Kiên',
    short: 'Tỷ',
    relation: 'Cùng hành, cùng âm dương với nhật chủ',
    meaning: 'Anh em, bạn bè, đồng nghiệp ngang hàng; lòng tự tôn và sự độc lập.',
    strong: 'Tự lập, có chính kiến, coi trọng tình bạn; đôi khi cố chấp, khó hợp tác về tiền bạc.',
  },
  kiep: {
    id: 'kiep',
    name: 'Kiếp Tài',
    short: 'Kiếp',
    relation: 'Cùng hành, khác âm dương với nhật chủ',
    meaning: 'Người cạnh tranh, sự ganh đua; dám liều, quyết đoán.',
    strong: 'Hăng hái, dám mạo hiểm, giỏi giao tiếp; cần cẩn thận chuyện chia tiền, đầu cơ.',
  },
  thuc: {
    id: 'thuc',
    name: 'Thực Thần',
    short: 'Thực',
    relation: 'Do nhật chủ sinh ra, cùng âm dương',
    meaning: 'Tài năng tự nhiên, sự hưởng thụ, phúc lộc ăn uống; khả năng sáng tạo nhẹ nhàng.',
    strong: 'Ôn hòa, có khiếu nghệ thuật, biết tận hưởng cuộc sống; đôi khi thiếu tham vọng.',
  },
  thuong: {
    id: 'thuong',
    name: 'Thương Quan',
    short: 'Thương',
    relation: 'Do nhật chủ sinh ra, khác âm dương',
    meaning: 'Tài hoa, cá tính, khả năng diễn đạt; tinh thần phá cách.',
    strong: 'Thông minh, sắc sảo, giỏi thể hiện; dễ chống đối khuôn phép, nói thẳng làm mất lòng.',
  },
  thientai: {
    id: 'thientai',
    name: 'Thiên Tài',
    short: 'T.Tài',
    relation: 'Bị nhật chủ khắc, cùng âm dương',
    meaning: 'Tiền bất ngờ, kinh doanh, đầu tư; sự hào phóng và nhạy bén thời cơ.',
    strong: 'Nhanh nhạy với cơ hội, hào phóng, giao thiệp rộng; tiền đến nhanh mà đi cũng nhanh.',
  },
  chinhtai: {
    id: 'chinhtai',
    name: 'Chính Tài',
    short: 'C.Tài',
    relation: 'Bị nhật chủ khắc, khác âm dương',
    meaning: 'Thu nhập ổn định, tài sản do lao động; sự cẩn trọng và thực tế.',
    strong: 'Chăm chỉ, tiết kiệm, quản lý tiền tốt; có khi quá thận trọng, ngại thay đổi.',
  },
  that: {
    id: 'that',
    name: 'Thất Sát',
    short: 'Sát',
    relation: 'Khắc nhật chủ, cùng âm dương (còn gọi Thiên Quan)',
    meaning: 'Áp lực, thử thách, quyền uy; khả năng chịu đựng và quyết đoán trong khủng hoảng.',
    strong: 'Can đảm, có uy, hợp môi trường cạnh tranh; dễ căng thẳng, nóng nảy nếu thiếu kiềm chế.',
  },
  quan: {
    id: 'quan',
    name: 'Chính Quan',
    short: 'Quan',
    relation: 'Khắc nhật chủ, khác âm dương',
    meaning: 'Danh dự, kỷ luật, sự nghiệp trong tổ chức; trách nhiệm và chuẩn mực.',
    strong: 'Đứng đắn, có trách nhiệm, hợp làm quản lý, công chức; đôi khi gò bó, ngại phá lệ.',
  },
  thienan: {
    id: 'thienan',
    name: 'Thiên Ấn',
    short: 'Kiêu',
    relation: 'Sinh ra nhật chủ, cùng âm dương (còn gọi Kiêu Thần)',
    meaning: 'Tư duy độc đáo, trực giác, kiến thức chuyên sâu, huyền học.',
    strong: 'Sâu sắc, sáng tạo theo lối riêng, hợp nghiên cứu; dễ cô độc, đa nghi.',
  },
  chinhan: {
    id: 'chinhan',
    name: 'Chính Ấn',
    short: 'Ấn',
    relation: 'Sinh ra nhật chủ, khác âm dương',
    meaning: 'Sự che chở, học vấn, mẹ và người đỡ đầu; lòng nhân từ.',
    strong: 'Hiếu học, nhân hậu, được nâng đỡ; đôi khi thụ động, dựa dẫm.',
  },
};

/** Nhóm thập thần theo vai trò đối với nhật chủ */
export const GOD_GROUP: Record<TenGod, 'self' | 'output' | 'wealth' | 'power' | 'resource'> = {
  ty: 'self',
  kiep: 'self',
  thuc: 'output',
  thuong: 'output',
  thientai: 'wealth',
  chinhtai: 'wealth',
  that: 'power',
  quan: 'power',
  thienan: 'resource',
  chinhan: 'resource',
};

export interface ShenSha {
  id: string;
  name: string;
  meaning: string;
}

export const SHEN_SHA: Record<string, ShenSha> = {
  quynhan: {
    id: 'quynhan',
    name: 'Thiên Ất Quý Nhân',
    meaning: 'Sao quý nhân lớn nhất: gặp khó thường có người giúp, dễ được người có địa vị nâng đỡ.',
  },
  vanxuong: {
    id: 'vanxuong',
    name: 'Văn Xương',
    meaning: 'Thông minh, học giỏi, có khiếu văn chương; thuận lợi trong thi cử, nghiên cứu.',
  },
  daohoa: {
    id: 'daohoa',
    name: 'Đào Hoa',
    meaning: 'Duyên dáng, có sức hút, đường tình cảm phong phú; cần tỉnh táo trong các mối quan hệ.',
  },
  dichma: {
    id: 'dichma',
    name: 'Dịch Mã',
    meaning: 'Hay di chuyển, đi xa, thay đổi chỗ ở hoặc công việc; hợp nghề cần đi lại.',
  },
  hoacai: {
    id: 'hoacai',
    name: 'Hoa Cái',
    meaning: 'Thông tuệ, thích nghệ thuật, triết học, tâm linh; có xu hướng sống nội tâm, đôi khi cô độc.',
  },
};

/** Thiên can ngũ hợp: cặp can hợp hóa thành một hành */
export const STEM_COMBOS: { pair: [number, number]; element: Element }[] = [
  { pair: [0, 5], element: 'tho' },
  { pair: [1, 6], element: 'kim' },
  { pair: [2, 7], element: 'thuy' },
  { pair: [3, 8], element: 'moc' },
  { pair: [4, 9], element: 'hoa' },
];

/** Địa chi lục hợp */
export const BRANCH_COMBOS: { pair: [number, number]; element: Element }[] = [
  { pair: [0, 1], element: 'tho' },
  { pair: [2, 11], element: 'moc' },
  { pair: [3, 10], element: 'hoa' },
  { pair: [4, 9], element: 'kim' },
  { pair: [5, 8], element: 'thuy' },
  { pair: [6, 7], element: 'hoa' },
];

/** Địa chi tam hợp cục */
export const BRANCH_TRINES: { trio: [number, number, number]; element: Element }[] = [
  { trio: [8, 0, 4], element: 'thuy' },
  { trio: [11, 3, 7], element: 'moc' },
  { trio: [2, 6, 10], element: 'hoa' },
  { trio: [5, 9, 1], element: 'kim' },
];

/** Địa chi lục xung: hai chi đối nhau trên vòng 12 */
export const isClash = (a: number, b: number) => Math.abs(a - b) === 6;
