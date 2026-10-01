import type { Element } from './elements';

export interface Stem {
  index: number;
  name: string;
  element: Element;
  yang: boolean;
  /** Hình tượng trong tự nhiên */
  image: string;
  /** Mô tả khi là nhật chủ */
  nature: string;
  strengths: string;
  cautions: string;
}

export const STEMS: Stem[] = [
  {
    index: 0,
    name: 'Giáp',
    element: 'moc',
    yang: true,
    image: 'Cây đại thụ',
    nature: 'Như cây lớn vươn thẳng lên trời: ngay thẳng, có chí hướng, thích dẫn dắt và che chở người khác.',
    strengths: 'Chính trực, kiên định, có tầm nhìn dài hạn, tinh thần trách nhiệm cao.',
    cautions: 'Cứng nhắc, khó uốn mình theo hoàn cảnh; ngại nhận sự giúp đỡ.',
  },
  {
    index: 1,
    name: 'Ất',
    element: 'moc',
    yang: false,
    image: 'Hoa cỏ, dây leo',
    nature: 'Như dây leo tìm đường vươn lên: mềm mỏng, khéo léo, giỏi thích nghi và kết nối.',
    strengths: 'Linh hoạt, tinh tế, giỏi ngoại giao, bền bỉ một cách lặng lẽ.',
    cautions: 'Dễ dựa dẫm, thiếu quyết đoán, hay lo người khác nghĩ gì.',
  },
  {
    index: 2,
    name: 'Bính',
    element: 'hoa',
    yang: true,
    image: 'Mặt trời',
    nature: 'Như mặt trời chiếu sáng muôn nơi: nhiệt tình, hào phóng, cởi mở và dễ nổi bật giữa đám đông.',
    strengths: 'Lạc quan, truyền cảm hứng, thẳng thắn, rộng lượng.',
    cautions: 'Nóng vội, thích phô trương, dễ hứa nhiều hơn làm.',
  },
  {
    index: 3,
    name: 'Đinh',
    element: 'hoa',
    yang: false,
    image: 'Ngọn nến, ngọn đèn',
    nature: 'Như ngọn đèn soi trong đêm: ấm áp, tinh tế, sâu sắc, chăm chút cho người thân.',
    strengths: 'Chu đáo, giàu trực giác, kiên nhẫn, có óc thẩm mỹ.',
    cautions: 'Đa cảm, dễ suy nghĩ nhiều, hay giữ trong lòng.',
  },
  {
    index: 4,
    name: 'Mậu',
    element: 'tho',
    yang: true,
    image: 'Núi lớn, đê đập',
    nature: 'Như núi đứng vững giữa trời đất: điềm tĩnh, đáng tin, bao dung, là chỗ dựa cho người khác.',
    strengths: 'Vững vàng, giữ chữ tín, chịu đựng tốt, biết bảo vệ.',
    cautions: 'Chậm thay đổi, bảo thủ, đôi khi khép kín.',
  },
  {
    index: 5,
    name: 'Kỷ',
    element: 'tho',
    yang: false,
    image: 'Đất vườn, ruộng đồng',
    nature: 'Như đất ruộng nuôi dưỡng mùa màng: thực tế, khéo léo, chu toàn và giỏi vun đắp.',
    strengths: 'Chăm chỉ, đa năng, biết lắng nghe, giỏi sắp xếp.',
    cautions: 'Hay lo nghĩ, thiếu tự tin, dễ ôm việc của người khác.',
  },
  {
    index: 6,
    name: 'Canh',
    element: 'kim',
    yang: true,
    image: 'Kim loại thô, thanh kiếm',
    nature: 'Như thanh kiếm cần được tôi luyện: cương quyết, nghĩa khí, thẳng thắn và dám đối đầu.',
    strengths: 'Quyết đoán, trọng nghĩa, hành động nhanh, chịu được áp lực.',
    cautions: 'Cứng rắn, dễ gây va chạm, nói thẳng đến mức mất lòng.',
  },
  {
    index: 7,
    name: 'Tân',
    element: 'kim',
    yang: false,
    image: 'Trang sức, châu ngọc',
    nature: 'Như món trang sức tinh xảo: tinh tế, coi trọng hình ảnh và giá trị, nhạy cảm với cái đẹp.',
    strengths: 'Thanh lịch, sắc sảo, tỉ mỉ, có gu.',
    cautions: 'Cầu toàn, dễ tự ái, nhạy cảm với lời chê.',
  },
  {
    index: 8,
    name: 'Nhâm',
    element: 'thuy',
    yang: true,
    image: 'Biển cả, sông lớn',
    nature: 'Như dòng sông lớn chảy ra biển: thông minh, phóng khoáng, thích tự do và trải nghiệm.',
    strengths: 'Nhanh nhạy, bao quát, giỏi thích ứng, nhiều ý tưởng.',
    cautions: 'Thiếu kiên định, dễ buông thả, khó bị ràng buộc.',
  },
  {
    index: 9,
    name: 'Quý',
    element: 'thuy',
    yang: false,
    image: 'Mưa, sương, suối nhỏ',
    nature: 'Như giọt mưa thấm vào đất: trực giác tốt, mềm mỏng, giàu tưởng tượng, âm thầm nuôi dưỡng.',
    strengths: 'Tinh ý, sâu sắc, kiên nhẫn, giỏi quan sát.',
    cautions: 'Dễ lo âu, hay nghi ngờ, ngại bộc lộ bản thân.',
  },
];

export interface Branch {
  index: number;
  name: string;
  animal: string;
  element: Element;
  yang: boolean;
  /** Tàng can: chủ khí trước, rồi trung khí, dư khí */
  hidden: number[];
  /** Khung giờ của canh giờ */
  hours: string;
  /** Tháng tiết khí tương ứng */
  month: string;
}

export const BRANCHES: Branch[] = [
  { index: 0, name: 'Tý', animal: 'Chuột', element: 'thuy', yang: true, hidden: [9], hours: '23h–1h', month: 'Tháng 11 âm (từ Đại Tuyết)' },
  { index: 1, name: 'Sửu', animal: 'Trâu', element: 'tho', yang: false, hidden: [5, 9, 7], hours: '1h–3h', month: 'Tháng 12 âm (từ Tiểu Hàn)' },
  { index: 2, name: 'Dần', animal: 'Hổ', element: 'moc', yang: true, hidden: [0, 2, 4], hours: '3h–5h', month: 'Tháng 1 âm (từ Lập Xuân)' },
  { index: 3, name: 'Mão', animal: 'Mèo', element: 'moc', yang: false, hidden: [1], hours: '5h–7h', month: 'Tháng 2 âm (từ Kinh Trập)' },
  { index: 4, name: 'Thìn', animal: 'Rồng', element: 'tho', yang: true, hidden: [4, 1, 9], hours: '7h–9h', month: 'Tháng 3 âm (từ Thanh Minh)' },
  { index: 5, name: 'Tỵ', animal: 'Rắn', element: 'hoa', yang: false, hidden: [2, 4, 6], hours: '9h–11h', month: 'Tháng 4 âm (từ Lập Hạ)' },
  { index: 6, name: 'Ngọ', animal: 'Ngựa', element: 'hoa', yang: true, hidden: [3, 5], hours: '11h–13h', month: 'Tháng 5 âm (từ Mang Chủng)' },
  { index: 7, name: 'Mùi', animal: 'Dê', element: 'tho', yang: false, hidden: [5, 3, 1], hours: '13h–15h', month: 'Tháng 6 âm (từ Tiểu Thử)' },
  { index: 8, name: 'Thân', animal: 'Khỉ', element: 'kim', yang: true, hidden: [6, 8, 4], hours: '15h–17h', month: 'Tháng 7 âm (từ Lập Thu)' },
  { index: 9, name: 'Dậu', animal: 'Gà', element: 'kim', yang: false, hidden: [7], hours: '17h–19h', month: 'Tháng 8 âm (từ Bạch Lộ)' },
  { index: 10, name: 'Tuất', animal: 'Chó', element: 'tho', yang: true, hidden: [4, 7, 3], hours: '19h–21h', month: 'Tháng 9 âm (từ Hàn Lộ)' },
  { index: 11, name: 'Hợi', animal: 'Lợn', element: 'thuy', yang: false, hidden: [8, 0], hours: '21h–23h', month: 'Tháng 10 âm (từ Lập Đông)' },
];

/** Tên một cặp can chi theo số thứ tự trong vòng 60 (0 là Giáp Tý) */
export const ganzhiName = (i: number) => `${STEMS[i % 10].name} ${BRANCHES[i % 12].name}`;

/** Ghép can và chi thành số thứ tự trong vòng 60 */
export const ganzhiIndex = (stem: number, branch: number) => (((6 * stem - 5 * branch) % 60) + 60) % 60;

/** Nạp âm của 30 cặp hoa giáp (mỗi cặp gồm 2 năm liên tiếp) */
export const NAP_AM: { name: string; meaning: string; element: Element }[] = [
  { name: 'Hải Trung Kim', meaning: 'Vàng trong biển', element: 'kim' },
  { name: 'Lư Trung Hỏa', meaning: 'Lửa trong lò', element: 'hoa' },
  { name: 'Đại Lâm Mộc', meaning: 'Gỗ rừng già', element: 'moc' },
  { name: 'Lộ Bàng Thổ', meaning: 'Đất ven đường', element: 'tho' },
  { name: 'Kiếm Phong Kim', meaning: 'Vàng mũi kiếm', element: 'kim' },
  { name: 'Sơn Đầu Hỏa', meaning: 'Lửa trên núi', element: 'hoa' },
  { name: 'Giản Hạ Thủy', meaning: 'Nước dưới khe', element: 'thuy' },
  { name: 'Thành Đầu Thổ', meaning: 'Đất trên thành', element: 'tho' },
  { name: 'Bạch Lạp Kim', meaning: 'Vàng chân đèn', element: 'kim' },
  { name: 'Dương Liễu Mộc', meaning: 'Gỗ cây dương liễu', element: 'moc' },
  { name: 'Tuyền Trung Thủy', meaning: 'Nước trong suối', element: 'thuy' },
  { name: 'Ốc Thượng Thổ', meaning: 'Đất trên mái nhà', element: 'tho' },
  { name: 'Tích Lịch Hỏa', meaning: 'Lửa sấm sét', element: 'hoa' },
  { name: 'Tùng Bách Mộc', meaning: 'Gỗ tùng bách', element: 'moc' },
  { name: 'Trường Lưu Thủy', meaning: 'Nước chảy mãi', element: 'thuy' },
  { name: 'Sa Trung Kim', meaning: 'Vàng trong cát', element: 'kim' },
  { name: 'Sơn Hạ Hỏa', meaning: 'Lửa dưới chân núi', element: 'hoa' },
  { name: 'Bình Địa Mộc', meaning: 'Gỗ đồng bằng', element: 'moc' },
  { name: 'Bích Thượng Thổ', meaning: 'Đất trên vách', element: 'tho' },
  { name: 'Kim Bạch Kim', meaning: 'Vàng pha bạc', element: 'kim' },
  { name: 'Phú Đăng Hỏa', meaning: 'Lửa đèn dầu', element: 'hoa' },
  { name: 'Thiên Hà Thủy', meaning: 'Nước trên trời', element: 'thuy' },
  { name: 'Đại Dịch Thổ', meaning: 'Đất cõi lớn', element: 'tho' },
  { name: 'Thoa Xuyến Kim', meaning: 'Vàng trang sức', element: 'kim' },
  { name: 'Tang Đố Mộc', meaning: 'Gỗ cây dâu', element: 'moc' },
  { name: 'Đại Khê Thủy', meaning: 'Nước khe lớn', element: 'thuy' },
  { name: 'Sa Trung Thổ', meaning: 'Đất pha cát', element: 'tho' },
  { name: 'Thiên Thượng Hỏa', meaning: 'Lửa trên trời', element: 'hoa' },
  { name: 'Thạch Lựu Mộc', meaning: 'Gỗ cây lựu', element: 'moc' },
  { name: 'Đại Hải Thủy', meaning: 'Nước biển lớn', element: 'thuy' },
];

export const napAmOf = (ganzhi: number) => NAP_AM[Math.floor(ganzhi / 2)];
