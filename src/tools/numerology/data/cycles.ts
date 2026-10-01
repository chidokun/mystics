export interface PersonalYearMeaning {
  n: number;
  title: string;
  text: string;
  focus: string;
}

export const PERSONAL_YEARS: PersonalYearMeaning[] = [
  {
    n: 1,
    title: 'Năm khởi đầu',
    text: 'Năm đầu tiên của chu kỳ 9 năm. Thời điểm gieo hạt: bắt đầu dự án, công việc, mối quan hệ hay thói quen mới.',
    focus: 'Chủ động, dám bắt đầu, đặt mục tiêu cho cả chu kỳ.',
  },
  {
    n: 2,
    title: 'Năm kết nối',
    text: 'Hạt giống nảy mầm chậm. Năm của kiên nhẫn, hợp tác và chăm chút các mối quan hệ.',
    focus: 'Lắng nghe, hợp tác, đừng nóng vội đòi kết quả.',
  },
  {
    n: 3,
    title: 'Năm thể hiện',
    text: 'Năng lượng sáng tạo và giao tiếp lên cao. Năm của niềm vui, mở rộng quan hệ và thể hiện bản thân.',
    focus: 'Sáng tạo, chia sẻ, nhưng tránh dàn trải.',
  },
  {
    n: 4,
    title: 'Năm xây nền',
    text: 'Năm của làm việc chăm chỉ: củng cố nền móng, sắp xếp lại tài chính, sức khỏe và kế hoạch.',
    focus: 'Kỷ luật, kiên trì, chăm sóc sức khỏe.',
  },
  {
    n: 5,
    title: 'Năm thay đổi',
    text: 'Năm bước ngoặt giữa chu kỳ: di chuyển, thay đổi, tự do và những trải nghiệm mới.',
    focus: 'Đón nhận thay đổi, linh hoạt, tránh quyết định bốc đồng.',
  },
  {
    n: 6,
    title: 'Năm trách nhiệm',
    text: 'Gia đình, nhà cửa và các cam kết được đặt lên hàng đầu. Năm thuận cho chuyện cưới hỏi, an cư.',
    focus: 'Quan tâm người thân, giữ cam kết, cân bằng cho và nhận.',
  },
  {
    n: 7,
    title: 'Năm chiêm nghiệm',
    text: 'Năm nhìn vào bên trong: học hỏi, nghỉ ngơi, suy ngẫm. Không phải lúc vội vàng mở rộng.',
    focus: 'Học tập, tĩnh tâm, đánh giá lại con đường.',
  },
  {
    n: 8,
    title: 'Năm gặt hái',
    text: 'Thành quả của những năm trước bắt đầu đến: sự nghiệp, tài chính, vị thế.',
    focus: 'Nắm cơ hội, quản lý tiền bạc khôn ngoan.',
  },
  {
    n: 9,
    title: 'Năm hoàn tất',
    text: 'Năm cuối của chu kỳ: kết thúc, buông bỏ và dọn chỗ cho chu kỳ mới.',
    focus: 'Hoàn tất việc dở dang, tha thứ, buông những gì đã cũ.',
  },
];

export const getPersonalYear = (n: number) => PERSONAL_YEARS[n - 1];

export const CHALLENGES: { n: number; title: string; text: string }[] = [
  {
    n: 0,
    title: 'Thử thách của sự lựa chọn',
    text: 'Không có một thử thách cụ thể — hoặc có tất cả. Bạn tự do chọn con đường, nhưng cũng phải tự chịu trách nhiệm cho lựa chọn của mình.',
  },
  { n: 1, title: 'Khẳng định bản thân', text: 'Học cách đứng vững, không để người khác lấn át — đồng thời không để cái tôi trở nên quá lớn.' },
  { n: 2, title: 'Nhạy cảm quá mức', text: 'Học cách tự tin, bớt bận tâm lời người khác và không để cảm xúc chi phối quyết định.' },
  { n: 3, title: 'Bày tỏ bản thân', text: 'Học cách thể hiện cảm xúc một cách tự tin, tránh hời hợt hoặc phân tán năng lượng.' },
  { n: 4, title: 'Kỷ luật và kiên nhẫn', text: 'Học cách làm việc có trật tự, kiên nhẫn — tránh cả cứng nhắc lẫn lười biếng.' },
  { n: 5, title: 'Tự do có trách nhiệm', text: 'Học cách tận hưởng tự do mà không bốc đồng, không thay đổi liên tục.' },
  { n: 6, title: 'Trách nhiệm và cầu toàn', text: 'Học cách chăm sóc người khác mà không áp đặt, không ôm đồm mọi việc.' },
  { n: 7, title: 'Niềm tin', text: 'Học cách vượt qua hoài nghi, cô lập và mở lòng tin tưởng người khác.' },
  { n: 8, title: 'Tiền bạc và quyền lực', text: 'Học cách cân bằng giữa vật chất và tinh thần, dùng quyền lực một cách công bằng.' },
];

export const getChallenge = (n: number) => CHALLENGES[n];
