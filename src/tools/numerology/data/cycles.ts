export interface PersonalYearMeaning {
  n: number;
  title: string;
  text: string;
  focus: string;
}

/**
 * Mức năng lượng (0–10) của mỗi số trong chu kỳ 9, theo đường cong năng lượng chín năm phổ biến
 * trong thần số học Việt Nam: đỉnh ở chỗ chuyển từ năm 9 sang năm 1, đổ dốc qua năm 2, 3,
 * xuống thấp ở năm 4, 5, nhô nhẹ ở năm 6, chạm đáy ở năm 7, rồi leo lại từ năm 8 lên năm 9.
 * Đây là thang diễn giải để vẽ biểu đồ, không phải phép tính cổ điển.
 */
export const CYCLE_ENERGY: Record<number, number> = { 1: 9, 2: 6, 3: 4, 4: 2, 5: 2, 6: 3, 7: 1, 8: 5, 9: 9 };

export const energyLabel = (e: number) => (e >= 7 ? 'cao' : e >= 4 ? 'vừa' : 'thấp');

/**
 * Mốc chuyển năng lượng: năng lượng của năm cá nhân số n bắt đầu từ ngày 1 của tháng này
 * trong năm dương lịch liền trước (ví dụ năm số 1 bắt đầu từ 1/10 của năm số 9).
 */
export const SHIFT_MONTH: Record<number, number> = { 1: 10, 2: 11, 3: 9, 4: 10, 5: 11, 6: 9, 7: 10, 8: 8, 9: 9 };

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

/** Tháng cá nhân: nhịp nhỏ bên trong năm cá nhân */
export const PERSONAL_MONTHS: { n: number; title: string; text: string }[] = [
  { n: 1, title: 'Tháng khởi động', text: 'Hợp bắt đầu việc mới, chủ động đề xuất ý tưởng và gặp gỡ người mới.' },
  { n: 2, title: 'Tháng hợp tác', text: 'Chậm lại, lắng nghe và kiên nhẫn chờ kết quả; hợp làm việc nhóm, vun đắp quan hệ.' },
  { n: 3, title: 'Tháng giao tiếp', text: 'Năng lượng sáng tạo và gặp gỡ lên cao; dễ phân tán nên hãy giữ một trọng tâm.' },
  { n: 4, title: 'Tháng kỷ luật', text: 'Tập trung làm việc, sắp xếp giấy tờ, tài chính và sức khỏe; chưa phải lúc mạo hiểm.' },
  { n: 5, title: 'Tháng biến động', text: 'Thay đổi, đi lại, cơ hội bất ngờ; linh hoạt nhưng tránh quyết định bốc đồng.' },
  { n: 6, title: 'Tháng gia đình', text: 'Dành thời gian cho người thân và nhà cửa; trách nhiệm tăng, cần cân bằng cho và nhận.' },
  { n: 7, title: 'Tháng tĩnh lặng', text: 'Hợp học hỏi, nghỉ ngơi và suy ngẫm; hạn chế ký kết hay mở rộng lớn.' },
  { n: 8, title: 'Tháng thu hoạch', text: 'Thuận cho công việc, tiền bạc và thương lượng; nỗ lực trước đó bắt đầu được đền đáp.' },
  { n: 9, title: 'Tháng khép lại', text: 'Hoàn tất việc dở dang, dọn dẹp và buông điều cũ để chuẩn bị cho nhịp mới.' },
];

export const getPersonalMonth = (n: number) => PERSONAL_MONTHS[n - 1];

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

export interface WorldYearMeaning {
  n: number;
  title: string;
  text: string;
  advice: string;
}

/** Năm thế giới: nhịp chung của mọi người, tính từ riêng năm dương lịch */
export const WORLD_YEARS: WorldYearMeaning[] = [
  {
    n: 1,
    title: 'Khởi đầu chu kỳ mới',
    text: 'Thế giới bước vào một chu kỳ chín năm mới. Ý tưởng, công nghệ, phong trào và gương mặt lãnh đạo mới xuất hiện; những gì khởi động năm nay thường định hình xu hướng của cả chu kỳ. Nhịp sống nhanh, đề cao sự độc lập và tinh thần tiên phong.',
    advice: 'Thuận để khởi nghiệp, học kỹ năng mới, đặt mục tiêu dài hạn. Bám vào cách làm cũ sẽ dễ bị bỏ lại.',
  },
  {
    n: 2,
    title: 'Hợp tác và cân bằng',
    text: 'Sau cú hích của năm 1, thế giới chậm lại để kết nối: đàm phán, liên minh, ngoại giao. Các vấn đề về bình đẳng, quan hệ đối tác và sự chia rẽ nổi lên. Nhiều việc phải chờ, kết quả đến chậm.',
    advice: 'Hợp tác, kiên nhẫn, chăm chút các mối quan hệ. Tránh nóng vội đòi kết quả hay đối đầu trực diện.',
  },
  {
    n: 3,
    title: 'Sáng tạo và giao tiếp',
    text: 'Truyền thông, giải trí, nghệ thuật và mạng xã hội sôi động; tinh thần lạc quan hơn, tiêu dùng và du lịch tăng. Mặt trái là nhiều tin đồn, phát ngôn ồn ào và sự hời hợt.',
    advice: 'Thể hiện, quảng bá, mở rộng kết nối. Giữ một trọng tâm, tránh dàn trải và hứa nhiều làm ít.',
  },
  {
    n: 4,
    title: 'Xây nền và kỷ luật',
    text: 'Năm của hạ tầng, luật lệ và cải tổ hệ thống. Kinh tế có xu hướng thắt chặt, mọi người phải làm việc thực chất hơn; không khí chung dễ nặng nề, trì trệ.',
    advice: 'Củng cố nền móng, tiết kiệm, chăm sóc sức khỏe. Tránh đầu cơ mạo hiểm hay đốt cháy giai đoạn.',
  },
  {
    n: 5,
    title: 'Biến động và đổi mới',
    text: 'Năm bản lề giữa chu kỳ: thay đổi nhanh và bất ngờ trong chính sách, công nghệ, cách sống và đi lại. Nhu cầu tự do, cải cách tăng cao; thị trường dễ biến động.',
    advice: 'Linh hoạt, cập nhật liên tục, sẵn sàng thích nghi. Tránh quyết định bốc đồng theo đám đông.',
  },
  {
    n: 6,
    title: 'Trách nhiệm và cộng đồng',
    text: 'Gia đình, giáo dục, y tế, môi trường và an sinh được đặt lên hàng đầu. Trách nhiệm xã hội được nhắc tới nhiều; đây cũng là năm của hàn gắn sau biến động.',
    advice: 'Chăm lo người thân và cộng đồng, giữ cam kết. Tránh ôm đồm hay áp đặt lên người khác.',
  },
  {
    n: 7,
    title: 'Chiêm nghiệm và tìm sự thật',
    text: 'Thế giới chậm lại để nhìn lại mình. Khoa học, nghiên cứu, tâm linh được chú ý; nhiều sự thật được phơi bày, niềm tin bị thử thách, bất ổn diễn ra ngầm bên dưới.',
    advice: 'Học hỏi, nghiên cứu, đầu tư vào bản thân. Hạn chế mở rộng ồ ạt khi chưa hiểu rõ.',
  },
  {
    n: 8,
    title: 'Tiền bạc và quyền lực',
    text: 'Kinh tế, tài chính, thương mại và quyền lực là tâm điểm. Cạnh tranh và tái cấu trúc mạnh; nỗ lực của những năm trước được thu hoạch, nhưng cũng dễ có cú sốc tài chính khi cân bằng bị phá vỡ.',
    advice: 'Quản lý tài chính chặt chẽ, nắm cơ hội kinh doanh. Tránh tham lam và lạm dụng quyền lực.',
  },
  {
    n: 9,
    title: 'Kết thúc và chuyển hóa',
    text: 'Năm khép lại chu kỳ chín năm: những gì lỗi thời được dọn đi, nhiều cái kết và chia ly. Tinh thần nhân đạo, từ thiện và hòa giải nổi lên, chuẩn bị cho chu kỳ mới.',
    advice: 'Hoàn tất việc dở dang, buông điều đã cũ, dọn chỗ cho năm 1 sắp tới.',
  },
];

export const getWorldYear = (n: number) => WORLD_YEARS[n - 1];

/** So nhịp năm cá nhân với nhịp năm thế giới dựa trên mức năng lượng */
export function worldRelation(personal: number, world: number): string {
  if (personal === world) {
    return `Năm cá nhân trùng năm thế giới: bạn đi cùng nhịp với số đông, năng lượng số ${world} được khuếch đại nên cả điểm mạnh lẫn điểm yếu của nó đều rõ hơn.`;
  }
  const diff = CYCLE_ENERGY[personal] - CYCLE_ENERGY[world];
  if (diff >= 3) {
    return 'Năng lượng của bạn cao hơn nhịp chung: bạn dễ đi trước số đông, trong khi xung quanh chưa sẵn sàng theo kịp. Hãy chủ động nhưng kiên nhẫn với người khác.';
  }
  if (diff <= -3) {
    return 'Nhịp chung đang sôi động hơn bạn: thế giới thúc giục hành động trong khi năm của bạn cần chậm lại. Tận dụng làn sóng chung ở mức vừa phải, đừng để bị cuốn theo.';
  }
  return 'Năng lượng của bạn và nhịp chung khá tương đồng: thuận lợi để hòa vào xu hướng chung thay vì đi ngược dòng.';
}
