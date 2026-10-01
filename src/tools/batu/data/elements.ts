export type Element = 'moc' | 'hoa' | 'tho' | 'kim' | 'thuy';

export const ELEMENT_ORDER: Element[] = ['moc', 'hoa', 'tho', 'kim', 'thuy'];

/** Tương sinh: Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim, Kim sinh Thủy, Thủy sinh Mộc */
export const generates = (e: Element): Element => ELEMENT_ORDER[(ELEMENT_ORDER.indexOf(e) + 1) % 5];
/** Tương khắc: Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim, Kim khắc Mộc */
export const controls = (e: Element): Element => ELEMENT_ORDER[(ELEMENT_ORDER.indexOf(e) + 2) % 5];
export const generatedBy = (e: Element): Element => ELEMENT_ORDER[(ELEMENT_ORDER.indexOf(e) + 4) % 5];
export const controlledBy = (e: Element): Element => ELEMENT_ORDER[(ELEMENT_ORDER.indexOf(e) + 3) % 5];

export interface ElementInfo {
  id: Element;
  name: string;
  nature: string;
  season: string;
  direction: string;
  colors: string;
  organs: string;
  careers: string;
  /** Khi hành này mạnh trong lá số */
  traits: string;
}

export const ELEMENTS: Record<Element, ElementInfo> = {
  moc: {
    id: 'moc',
    name: 'Mộc',
    nature: 'Cây cối: vươn lên, phát triển, nhân từ',
    season: 'Mùa xuân',
    direction: 'Đông, Đông Nam',
    colors: 'xanh lá, xanh rêu',
    organs: 'Gan, mật',
    careers: 'giáo dục, xuất bản, thiết kế, thời trang, nông lâm, y dược thảo mộc',
    traits: 'Nhân hậu, có chí tiến thủ, thích giúp đỡ và phát triển.',
  },
  hoa: {
    id: 'hoa',
    name: 'Hỏa',
    nature: 'Lửa: tỏa sáng, nhiệt huyết, lễ nghĩa',
    season: 'Mùa hạ',
    direction: 'Nam',
    colors: 'đỏ, cam, hồng, tím',
    organs: 'Tim, ruột non',
    careers: 'truyền thông, giải trí, ẩm thực, năng lượng, điện tử, quảng cáo',
    traits: 'Nhiệt tình, sôi nổi, thích thể hiện, giàu cảm hứng.',
  },
  tho: {
    id: 'tho',
    name: 'Thổ',
    nature: 'Đất: nâng đỡ, bao dung, chữ tín',
    season: 'Cuối mỗi mùa',
    direction: 'Trung tâm, Đông Bắc, Tây Nam',
    colors: 'vàng, nâu, be',
    organs: 'Dạ dày, lá lách',
    careers: 'bất động sản, xây dựng, nông nghiệp, tư vấn, bảo hiểm, quản lý',
    traits: 'Điềm tĩnh, đáng tin, thực tế, giữ chữ tín.',
  },
  kim: {
    id: 'kim',
    name: 'Kim',
    nature: 'Kim loại: cứng rắn, quyết đoán, nghĩa khí',
    season: 'Mùa thu',
    direction: 'Tây, Tây Bắc',
    colors: 'trắng, xám, bạc, ánh kim',
    organs: 'Phổi, ruột già',
    careers: 'tài chính, ngân hàng, cơ khí, kỹ thuật, luật, quân đội',
    traits: 'Quyết đoán, nguyên tắc, trọng nghĩa, có kỷ luật.',
  },
  thuy: {
    id: 'thuy',
    name: 'Thủy',
    nature: 'Nước: linh hoạt, thông minh, trí tuệ',
    season: 'Mùa đông',
    direction: 'Bắc',
    colors: 'đen, xanh dương',
    organs: 'Thận, bàng quang',
    careers: 'thương mại, vận tải, du lịch, nghiên cứu, công nghệ thông tin, truyền thông',
    traits: 'Thông minh, linh hoạt, giỏi giao tiếp, thích tự do.',
  },
};
