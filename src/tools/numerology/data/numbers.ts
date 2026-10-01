export interface NumberMeaning {
  n: number;
  title: string;
  keywords: string[];
  essence: string;
  strengths: string[];
  challenges: string[];
  careers: string;
  love: string;
  advice: string;
  /** Khi là số sứ mệnh */
  mission: string;
  /** Khi là số linh hồn */
  soul: string;
  /** Khi là số nhân cách */
  persona: string;
  /** Khi là con số của một giai đoạn đỉnh cao */
  pinnacle: string;
}

export const NUMBERS: NumberMeaning[] = [
  {
    n: 1,
    title: 'Người tiên phong',
    keywords: ['độc lập', 'chủ động', 'lãnh đạo', 'khởi đầu'],
    essence:
      'Số 1 là năng lượng khởi đầu: độc lập, chủ động và muốn tự mình mở đường. Người mang số 1 có ý chí mạnh, thích dẫn dắt và không ngại đi trước người khác.',
    strengths: ['Quyết đoán, tự lập', 'Dám nghĩ dám làm, có tinh thần tiên phong', 'Có khả năng lãnh đạo bẩm sinh'],
    challenges: ['Cái tôi lớn, khó lắng nghe', 'Nóng vội, thiếu kiên nhẫn', 'Ngại bộc lộ cảm xúc thật'],
    careers: 'Khởi nghiệp, quản lý, sáng chế, kinh doanh tự do.',
    love: 'Bạn cần một người tôn trọng sự độc lập của mình. Học cách nói ra cảm xúc và lắng nghe nhiều hơn sẽ giúp mối quan hệ bền hơn.',
    advice: 'Dẫn đầu bằng việc làm, không bằng mệnh lệnh.',
    mission: 'Bạn đến để mở đường: khởi xướng ý tưởng và tự đứng vững trên đôi chân mình.',
    soul: 'Sâu bên trong, bạn khao khát được tự chủ và được công nhận là chính mình.',
    persona: 'Người khác thấy bạn tự tin, mạnh mẽ, có phần khó gần.',
    pinnacle: 'Giai đoạn rèn bản lĩnh độc lập, tự đưa ra quyết định và khởi sự điều mới.',
  },
  {
    n: 2,
    title: 'Người hòa giải',
    keywords: ['trực giác', 'nhạy cảm', 'hợp tác', 'hòa hợp'],
    essence:
      'Số 2 mang năng lượng kết nối: nhạy cảm, giàu trực giác và giỏi hợp tác. Bạn cảm nhận được điều người khác chưa nói ra và thường là cầu nối giữa mọi người.',
    strengths: ['Trực giác tốt, thấu hiểu người khác', 'Khéo léo, hòa nhã, giỏi làm việc nhóm', 'Kiên nhẫn, để ý chi tiết'],
    challenges: ['Dễ tổn thương', 'Thiếu tự tin, ngại quyết định', 'Dễ phụ thuộc vào người khác'],
    careers: 'Tư vấn, tâm lý, ngoại giao, nhân sự, nghệ thuật, trợ lý.',
    love: 'Bạn là người yêu tận tụy và thấu hiểu. Hãy chọn người trân trọng sự tinh tế của bạn, và đừng quên chăm sóc chính mình.',
    advice: 'Tin vào trực giác — và nói ra điều bạn cần.',
    mission: 'Bạn đến để kết nối, hàn gắn và tạo ra sự hòa hợp.',
    soul: 'Bạn khao khát bình yên, được yêu thương và thuộc về một mối quan hệ gắn bó.',
    persona: 'Người khác thấy bạn dịu dàng, dễ gần, đáng tin.',
    pinnacle: 'Giai đoạn học cách hợp tác, kiên nhẫn và xây dựng các mối quan hệ.',
  },
  {
    n: 3,
    title: 'Người sáng tạo',
    keywords: ['tư duy', 'sáng tạo', 'giao tiếp', 'hài hước'],
    essence:
      'Số 3 là con số của trí óc và sự thể hiện: tư duy nhanh, trí nhớ tốt, giàu óc hài hước. Bạn cần được nói ra, viết ra, chia sẻ ý tưởng của mình.',
    strengths: ['Tư duy nhanh nhạy, học giỏi', 'Hài hước, giao tiếp tốt', 'Sáng tạo, lạc quan'],
    challenges: ['Dễ phân tán, thiếu tập trung', 'Hay phán xét, nói lời sắc bén', 'Ngại việc lặp lại, nhàm chán'],
    careers: 'Giáo dục, truyền thông, viết lách, nghiên cứu, nghệ thuật trình diễn.',
    love: 'Bạn cần người có thể trò chuyện cùng mình ở tầm suy nghĩ. Bớt phân tích, thêm cảm nhận.',
    advice: 'Biến ý tưởng thành việc làm cụ thể.',
    mission: 'Bạn đến để truyền cảm hứng bằng lời nói, ý tưởng và niềm vui.',
    soul: 'Bạn khao khát được thể hiện bản thân và được lắng nghe.',
    persona: 'Người khác thấy bạn vui vẻ, lanh lợi, thu hút.',
    pinnacle: 'Giai đoạn phát triển trí tuệ, sáng tạo và khả năng giao tiếp.',
  },
  {
    n: 4,
    title: 'Người xây nền',
    keywords: ['thực tế', 'kỷ luật', 'tổ chức', 'bền bỉ'],
    essence:
      'Số 4 là nền móng: thực tế, ngăn nắp và đáng tin. Bạn học tốt nhất qua trải nghiệm thực tế và xây dựng mọi thứ từng bước chắc chắn.',
    strengths: ['Chăm chỉ, bền bỉ', 'Có tổ chức, giỏi lập kế hoạch', 'Trung thực, đáng tin'],
    challenges: ['Cứng nhắc, bảo thủ', 'Ngại thay đổi', 'Quá tập trung vào vật chất và công việc'],
    careers: 'Kỹ thuật, kế toán, xây dựng, vận hành, nghề thủ công.',
    love: 'Bạn chung thủy và đáng tin cậy. Thêm chút lãng mạn và linh hoạt sẽ khiến người kia thấy được yêu nhiều hơn.',
    advice: 'Giữ kỷ luật, nhưng chừa chỗ cho sự linh hoạt.',
    mission: 'Bạn đến để xây dựng những điều bền vững, có giá trị thực.',
    soul: 'Bạn khao khát sự ổn định, trật tự và an toàn.',
    persona: 'Người khác thấy bạn nghiêm túc, chắc chắn, đáng tin.',
    pinnacle: 'Giai đoạn lao động chăm chỉ, đặt nền móng vật chất vững chắc.',
  },
  {
    n: 5,
    title: 'Người tự do',
    keywords: ['tự do', 'cảm xúc', 'trải nghiệm', 'linh hoạt'],
    essence:
      'Số 5 nằm ở chính giữa biểu đồ — con số của tự do và cảm xúc. Bạn yêu trải nghiệm, ghét gò bó và có trái tim giàu yêu thương.',
    strengths: ['Linh hoạt, thích nghi nhanh', 'Giàu cảm xúc, biết yêu thương', 'Ham học hỏi, thích khám phá'],
    challenges: ['Bốc đồng, thiếu kiên định', 'Dễ chán', 'Dễ sa đà vào thú vui'],
    careers: 'Du lịch, bán hàng, truyền thông, tổ chức sự kiện, công việc tự do.',
    love: 'Bạn cần một mối quan hệ cho mình không gian. Cam kết không có nghĩa là mất tự do.',
    advice: 'Tự do thật sự đến từ kỷ luật với chính mình.',
    mission: 'Bạn đến để trải nghiệm, lan tỏa sự tự do và đổi mới.',
    soul: 'Bạn khao khát tự do, phiêu lưu và những điều mới.',
    persona: 'Người khác thấy bạn năng động, cuốn hút, phóng khoáng.',
    pinnacle: 'Giai đoạn thay đổi, di chuyển và mở rộng trải nghiệm sống.',
  },
  {
    n: 6,
    title: 'Người chăm sóc',
    keywords: ['trách nhiệm', 'sáng tạo', 'gia đình', 'yêu thương'],
    essence:
      'Số 6 là con số của sáng tạo và trách nhiệm với gia đình. Bạn ấm áp, hay quan tâm, có óc thẩm mỹ — nhưng cũng dễ lo lắng thay cho người khác.',
    strengths: ['Có trách nhiệm, chu đáo', 'Sáng tạo, có gu thẩm mỹ', 'Giỏi chăm sóc, chữa lành'],
    challenges: ['Hay lo âu', 'Ôm đồm, áp đặt sự quan tâm', 'Cầu toàn'],
    careers: 'Y tế, giáo dục, thiết kế, nghệ thuật, công tác cộng đồng.',
    love: 'Bạn là người yêu tận tâm, hướng về gia đình. Hãy để người khác chăm sóc lại bạn.',
    advice: 'Chăm sóc người khác bắt đầu từ chăm sóc chính mình.',
    mission: 'Bạn đến để nuôi dưỡng, chữa lành và tạo ra cái đẹp.',
    soul: 'Bạn khao khát một mái ấm hạnh phúc và được là chỗ dựa cho người thân.',
    persona: 'Người khác thấy bạn ấm áp, đáng tin, chu đáo.',
    pinnacle: 'Giai đoạn của gia đình, trách nhiệm và sự sáng tạo.',
  },
  {
    n: 7,
    title: 'Người chiêm nghiệm',
    keywords: ['trải nghiệm', 'chiêm nghiệm', 'triết lý', 'độc lập'],
    essence:
      'Số 7 học qua trải nghiệm thật — đôi khi qua mất mát, hy sinh. Bạn có chiều sâu, thích tự tìm hiểu, và trí tuệ của bạn được tôi luyện từ chính những gì mình đã đi qua.',
    strengths: ['Sâu sắc, giỏi phân tích', 'Suy nghĩ độc lập', 'Có thiên hướng triết học, tâm linh'],
    challenges: ['Dễ khép kín, cô lập', 'Hoài nghi', 'Cứ phải tự vấp mới chịu rút kinh nghiệm'],
    careers: 'Nghiên cứu, khoa học, giảng dạy, luật, lĩnh vực tâm linh.',
    love: 'Bạn cần thời gian để mở lòng. Một người kiên nhẫn và tôn trọng không gian riêng sẽ hợp với bạn.',
    advice: 'Học từ trải nghiệm của người khác để bớt va vấp.',
    mission: 'Bạn đến để tìm kiếm chân lý và chia sẻ điều mình đã chiêm nghiệm.',
    soul: 'Bạn khao khát hiểu thấu bản chất cuộc sống.',
    persona: 'Người khác thấy bạn bí ẩn, trầm tĩnh, sâu sắc.',
    pinnacle: 'Giai đoạn chiêm nghiệm, học qua trải nghiệm và phát triển nội tâm.',
  },
  {
    n: 8,
    title: 'Người làm chủ',
    keywords: ['độc lập', 'quyền lực', 'tài chính', 'tinh tế'],
    essence:
      'Số 8 là con số của sự độc lập và năng lực làm chủ vật chất. Bạn tinh tế, để ý chi tiết, có khả năng điều hành và tạo ra thành quả tài chính.',
    strengths: ['Độc lập, tự chủ', 'Giỏi quản lý, kinh doanh', 'Tinh tế, có trách nhiệm'],
    challenges: ['Cứng đầu, khó thỏa hiệp', 'Đặt nặng vật chất, thành tích', 'Khó bộc lộ cảm xúc'],
    careers: 'Kinh doanh, tài chính, quản lý, bất động sản, luật.',
    love: 'Bạn che chở người mình yêu. Hãy cho phép mình mềm mỏng và thể hiện tình cảm.',
    advice: 'Dùng sức mạnh để phục vụ, đừng để kiểm soát.',
    mission: 'Bạn đến để làm chủ thế giới vật chất và dùng nó một cách khôn ngoan.',
    soul: 'Bạn khao khát thành công, tự chủ và được tôn trọng.',
    persona: 'Người khác thấy bạn có uy, đĩnh đạc, thành đạt.',
    pinnacle: 'Giai đoạn của sự nghiệp, tài chính và khẳng định vị thế.',
  },
  {
    n: 9,
    title: 'Người lý tưởng',
    keywords: ['lý tưởng', 'nhân ái', 'trách nhiệm', 'tham vọng'],
    essence:
      'Số 9 mang lý tưởng lớn và trách nhiệm với cộng đồng. Bạn có tầm nhìn rộng, giàu lòng nhân ái và muốn để lại điều gì đó có ý nghĩa.',
    strengths: ['Nhân hậu, bao dung', 'Tầm nhìn rộng, lý tưởng cao', 'Có trách nhiệm'],
    challenges: ['Mơ mộng xa thực tế', 'Dễ thất vọng khi người khác không như kỳ vọng', 'Khó buông bỏ quá khứ'],
    careers: 'Hoạt động xã hội, giáo dục, y tế, nghệ thuật, tổ chức phi lợi nhuận.',
    love: 'Bạn yêu rộng lượng và lý tưởng. Hãy chấp nhận người kia với cả những điểm chưa hoàn hảo.',
    advice: 'Biến lý tưởng thành những việc làm nhỏ mỗi ngày.',
    mission: 'Bạn đến để phụng sự, cống hiến cho điều lớn hơn bản thân.',
    soul: 'Bạn khao khát một thế giới tốt đẹp hơn.',
    persona: 'Người khác thấy bạn bao dung, cao thượng, có sức hút.',
    pinnacle: 'Giai đoạn cống hiến, hoàn thiện và buông bỏ những gì đã cũ.',
  },
  {
    n: 10,
    title: 'Người thích nghi',
    keywords: ['thích nghi', 'tự tin', 'khởi đầu', 'may mắn'],
    essence:
      'Số chủ đạo 10 mang năng lượng của số 1 nhưng mềm dẻo hơn: tự tin, dễ thích nghi và thường gặp may. Bạn có thể bắt đầu lại ở bất cứ đâu.',
    strengths: ['Thích nghi nhanh với hoàn cảnh mới', 'Tự tin, lạc quan', 'Lãnh đạo linh hoạt'],
    challenges: ['Thiếu kiên định', 'Dễ tự mãn', 'Đôi khi bốc đồng'],
    careers: 'Kinh doanh, quản lý dự án, bán hàng, giải trí.',
    love: 'Bạn hấp dẫn và vui vẻ. Thể hiện cam kết rõ ràng để người kia yên tâm.',
    advice: 'Khởi đầu nào cũng cần sự bền bỉ đi kèm.',
    mission: 'Bạn đến để mở đường và thích nghi linh hoạt với mọi hoàn cảnh.',
    soul: 'Bạn khao khát tự do làm lại từ đầu theo cách của mình.',
    persona: 'Người khác thấy bạn tự tin, dễ mến, nhanh nhạy.',
    pinnacle: 'Giai đoạn khởi đầu mới với nhiều may mắn.',
  },
  {
    n: 11,
    title: 'Bậc thầy trực giác',
    keywords: ['trực giác', 'tâm linh', 'truyền cảm hứng', 'nhạy bén'],
    essence:
      '11 là số bậc thầy: trực giác rất mạnh, nhạy bén về tâm linh và có khả năng truyền cảm hứng. Năng lượng lớn đi kèm áp lực lớn — bạn cần cân bằng giữa lý tưởng và thực tế.',
    strengths: ['Trực giác vượt trội', 'Truyền cảm hứng, có sức ảnh hưởng', 'Lý tưởng, sáng tạo'],
    challenges: ['Căng thẳng thần kinh', 'Kỳ vọng quá cao vào bản thân', 'Dao động giữa tự tin và tự ti'],
    careers: 'Tư vấn tâm lý, chữa lành, nghệ thuật, giảng dạy, lĩnh vực tâm linh.',
    love: 'Bạn cần người hiểu chiều sâu tâm hồn mình. Đừng lý tưởng hóa người yêu.',
    advice: 'Tin vào tiếng nói bên trong, nhưng giữ chân trên mặt đất.',
    mission: 'Bạn đến để soi đường và nâng đỡ tinh thần người khác.',
    soul: 'Bạn khao khát sự thức tỉnh và kết nối tâm linh.',
    persona: 'Người khác thấy bạn đặc biệt, có sức hút khó giải thích.',
    pinnacle: 'Giai đoạn thức tỉnh tâm linh và phát huy trực giác.',
  },
  {
    n: 22,
    title: 'Bậc thầy kiến tạo',
    keywords: ['tầm nhìn lớn', 'kiến tạo', 'thực tế', 'bản lĩnh'],
    essence:
      '22/4 kết hợp trực giác của 11 với tính thực tế của 4: bạn có khả năng biến tầm nhìn lớn thành hiện thực. Đây là con số đòi hỏi nhiều — tiềm năng lớn, áp lực cũng lớn.',
    strengths: ['Tầm nhìn chiến lược', 'Năng lực thực thi', 'Bản lĩnh, kiên định'],
    challenges: ['Áp lực và căng thẳng', 'Tham vọng quá mức', 'Có lúc lùi về giới hạn của số 4: cứng nhắc'],
    careers: 'Kiến trúc, quản lý cấp cao, xây dựng tổ chức, hoạch định chính sách.',
    love: 'Bạn cần người đồng hành vững vàng, chia sẻ tầm nhìn. Đừng để công việc chiếm hết chỗ của tình cảm.',
    advice: 'Xây từng viên gạch — công trình lớn cần thời gian.',
    mission: 'Bạn đến để xây những công trình có ích cho nhiều người.',
    soul: 'Bạn khao khát để lại một di sản lâu dài.',
    persona: 'Người khác thấy bạn vững vàng, có tầm, đáng nể.',
    pinnacle: 'Giai đoạn có thể đạt thành tựu lớn nếu đủ kiên trì.',
  },
  {
    n: 33,
    title: 'Bậc thầy chữa lành',
    keywords: ['yêu thương', 'chữa lành', 'phụng sự', 'dẫn dắt'],
    essence:
      '33 là số bậc thầy hiếm gặp: tình yêu thương vô điều kiện và tinh thần phụng sự. Đây là năng lượng của số 6 ở tầm rộng hơn — chăm sóc cả cộng đồng chứ không chỉ gia đình.',
    strengths: ['Bao dung, giàu lòng trắc ẩn', 'Có khả năng chữa lành, nâng đỡ', 'Sáng tạo, truyền cảm hứng'],
    challenges: ['Hy sinh quá mức, quên bản thân', 'Gánh trách nhiệm thay người khác', 'Cầu toàn'],
    careers: 'Giáo dục, y tế, trị liệu, nghệ thuật, công tác xã hội.',
    love: 'Bạn yêu bằng cả trái tim. Hãy chọn người biết trân trọng và đáp lại.',
    advice: 'Yêu thương người khác không có nghĩa là quên mình.',
    mission: 'Bạn đến để nâng đỡ và chữa lành bằng tình yêu thương.',
    soul: 'Bạn khao khát xoa dịu nỗi đau của người khác.',
    persona: 'Người khác thấy bạn bao dung, ấm áp như một người thầy.',
    pinnacle: 'Giai đoạn phụng sự và lan tỏa yêu thương.',
  },
];

export function getNumber(n: number): NumberMeaning {
  const found = NUMBERS.find((x) => x.n === n);
  if (!found) throw new Error(`Không có ý nghĩa cho số ${n}`);
  return found;
}
