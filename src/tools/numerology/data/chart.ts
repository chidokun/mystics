import type { ArrowLine } from '../lib/calc';

export interface DigitMeaning {
  digit: number;
  theme: string;
  /** Lần lượt: không có, 1 lần, 2 lần, 3 lần, từ 4 lần trở lên */
  byCount: [string, string, string, string, string];
}

export const DIGITS: DigitMeaning[] = [
  {
    digit: 1,
    theme: 'Cái tôi và cách bày tỏ',
    byCount: [
      'Hiếm gặp. Cần học cách khẳng định bản thân và nói ra suy nghĩ của mình.',
      'Khó diễn đạt cảm xúc thật bằng lời, dễ bị hiểu lầm. Viết ra hoặc thể hiện bằng hành động sẽ dễ hơn.',
      'Cân bằng: diễn đạt rõ ràng, nhìn được cả hai mặt của vấn đề.',
      'Hoặc rất hoạt ngôn, vui tính, hoặc rất trầm lặng — tùy hoàn cảnh. Giỏi trò chuyện khi thấy thoải mái.',
      'Có quá nhiều điều muốn nói nên dễ bị hiểu lầm. Hãy chậm lại và lắng nghe nhiều hơn.',
    ],
  },
  {
    digit: 2,
    theme: 'Trực giác và sự nhạy cảm',
    byCount: [
      'Cần rèn sự tinh tế và kiên nhẫn; đôi khi vô tình làm người khác tổn thương mà không biết.',
      'Có trực giác tốt, nhạy cảm nhưng dễ bị tổn thương.',
      'Trực giác rất tốt, nhìn người chuẩn. Đây là mức cân bằng nhất.',
      'Quá nhạy cảm, dễ tổn thương, có xu hướng thu mình.',
      'Cực kỳ nhạy cảm và thiếu kiên nhẫn. Cần không gian yên tĩnh và các hoạt động tĩnh tâm.',
    ],
  },
  {
    digit: 3,
    theme: 'Trí nhớ và tư duy',
    byCount: [
      'Nên chủ động rèn trí nhớ và tư duy logic; học bằng thực hành sẽ hiệu quả hơn đọc lý thuyết.',
      'Trí nhớ tốt, suy nghĩ rõ ràng, lạc quan.',
      'Giàu trí tưởng tượng, sáng tạo; dễ sống trong thế giới riêng.',
      'Trí tưởng tượng quá mạnh, dễ lo sợ vô cớ, hay tranh luận.',
      'Suy nghĩ quá nhiều, dễ căng thẳng. Vận động và tập trung vào việc trước mắt sẽ giúp bạn.',
    ],
  },
  {
    digit: 4,
    theme: 'Tính thực tế và tổ chức',
    byCount: [
      'Thiếu tính thực tế và ngăn nắp; cần rèn thói quen sắp xếp và sự kiên nhẫn.',
      'Thực tế, khéo tay, thích làm việc cụ thể.',
      'Rất ngăn nắp, giỏi tổ chức; có thể quá chú trọng vật chất.',
      'Quá thiên về vật chất và công việc chân tay; dễ cứng nhắc.',
      'Cuốn vào công việc, khó thư giãn; cần cân bằng đời sống tinh thần.',
    ],
  },
  {
    digit: 5,
    theme: 'Cảm xúc và sự quyết tâm',
    byCount: [
      'Cần xây dựng quyết tâm và sự cân bằng cảm xúc; dễ thiếu động lực.',
      'Có lòng trắc ẩn, quyết tâm, cảm xúc cân bằng.',
      'Quyết tâm cao, mạnh mẽ; đôi khi áp đặt.',
      'Dễ bốc đồng, nói nhanh hơn nghĩ; cần tập kiềm chế.',
      'Cảm xúc rất mạnh, dễ liều lĩnh; cần kỷ luật với chính mình.',
    ],
  },
  {
    digit: 6,
    theme: 'Sáng tạo và gia đình',
    byCount: [
      'Có thể ít gắn bó với gia đình, hoặc chưa tin vào khả năng sáng tạo của mình.',
      'Yêu gia đình, sáng tạo, có trách nhiệm.',
      'Dễ lo âu, nhất là về gia đình; cần một kênh sáng tạo để giải tỏa.',
      'Rất hay lo, dễ căng thẳng; quan hệ gia đình có thể phức tạp.',
      'Lo âu cao độ; cần chủ động chăm sóc sức khỏe tinh thần.',
    ],
  },
  {
    digit: 7,
    theme: 'Bài học qua trải nghiệm',
    byCount: [
      'Bạn có thể học từ trải nghiệm của người khác; nên nuôi dưỡng chiều sâu suy ngẫm.',
      'Học qua trải nghiệm của bản thân, thường ở một lĩnh vực: tình cảm, sức khỏe hoặc tiền bạc.',
      'Học qua mất mát ở nhiều lĩnh vực hơn; tích lũy được trí tuệ sâu sắc.',
      'Nhiều thử thách, dễ buồn bã — nhưng có tiềm năng trở thành người rất thông tuệ.',
      'Cuộc đời nhiều biến cố; cần học cách buông bỏ và tìm niềm tin.',
    ],
  },
  {
    digit: 8,
    theme: 'Sự độc lập và tinh tế',
    byCount: [
      'Ít để ý chi tiết, dễ bừa bộn; nên rèn sự cẩn thận và tự lập.',
      'Ngăn nắp, tinh tế, để ý chi tiết, độc lập.',
      'Rất độc lập, tin vào phán đoán của mình; có thể cứng đầu.',
      'Bồn chồn, thích di chuyển, khó ở yên một chỗ.',
      'Độc lập đến mức khó hợp tác; cần học cách dựa vào người khác.',
    ],
  },
  {
    digit: 9,
    theme: 'Lý tưởng và trách nhiệm',
    byCount: [
      'Thường gặp ở người sinh từ năm 2000. Nên phát triển lòng nhân ái và tầm nhìn rộng.',
      'Có lý tưởng, tham vọng và tinh thần trách nhiệm.',
      'Lý tưởng cao, thông minh; có thể hay phê phán người khác.',
      'Quá lý tưởng, dễ sống trong suy nghĩ, xa rời thực tế.',
      'Lý tưởng hóa mọi thứ, dễ thất vọng; cần bám vào thực tế.',
    ],
  },
];

export const digitMeaning = (digit: number, count: number): string =>
  DIGITS[digit - 1].byCount[Math.min(count, 4)];

export interface ArrowMeaning {
  line: ArrowLine;
  /** Tên khi đủ cả ba số */
  fullName: string;
  full: string;
  /** Tên khi trống cả ba số */
  emptyName: string;
  empty: string;
}

export const ARROWS: ArrowMeaning[] = [
  {
    line: '123',
    fullName: 'Mũi tên Kế hoạch',
    full: 'Bạn có đầu óc tổ chức, thích lên kế hoạch chi tiết trước khi làm và thường làm việc có phương pháp.',
    emptyName: 'Mũi tên Thiếu kế hoạch',
    empty: 'Rất hiếm gặp. Bạn dễ làm theo cảm hứng; lập danh sách việc cần làm sẽ giúp ích nhiều.',
  },
  {
    line: '456',
    fullName: 'Mũi tên Ý chí',
    full: 'Ý chí mạnh, quyết tâm theo đuổi mục tiêu tới cùng. Hãy dùng sức mạnh này một cách mềm mỏng để không áp đặt người khác.',
    emptyName: 'Mũi tên Uất giận',
    empty: 'Dễ thất vọng, bực bội khi mọi việc không như ý, nhất là trong các mối quan hệ. Học cách chấp nhận và điều chỉnh kỳ vọng sẽ giúp bạn nhẹ lòng hơn.',
  },
  {
    line: '789',
    fullName: 'Mũi tên Hoạt động',
    full: 'Tràn đầy năng lượng, thích hành động hơn ngồi yên. Bạn cần vận động và có việc để làm thì mới thấy vui.',
    emptyName: 'Mũi tên Thụ động',
    empty: 'Dễ trì trệ, thiếu động lực hành động, chờ hoàn cảnh thay đổi. Đặt mục tiêu nhỏ và bắt đầu ngay sẽ giúp bạn chuyển động.',
  },
  {
    line: '147',
    fullName: 'Mũi tên Thực tế',
    full: 'Thực tế, khéo léo, giỏi dùng tay chân và làm ra kết quả cụ thể. Hợp với công việc đòi hỏi kỹ năng thực hành.',
    emptyName: 'Mũi tên Thiếu thực tế',
    empty: 'Dễ thiếu trật tự trong sinh hoạt và khó biến ý tưởng thành việc cụ thể. Thói quen nhỏ mỗi ngày là chìa khóa.',
  },
  {
    line: '258',
    fullName: 'Mũi tên Cân bằng cảm xúc',
    full: 'Cảm xúc ổn định, biết thấu hiểu và hỗ trợ người khác. Bạn thường là chỗ dựa tinh thần cho mọi người.',
    emptyName: 'Mũi tên Nhạy cảm',
    empty: 'Rất nhạy cảm, dễ tổn thương và hay giấu cảm xúc từ nhỏ. Cần môi trường an toàn để mở lòng; nghệ thuật, âm nhạc giúp bạn cân bằng.',
  },
  {
    line: '369',
    fullName: 'Mũi tên Trí tuệ',
    full: 'Trí nhớ tốt, suy nghĩ sắc bén, học nhanh. Hợp với công việc cần tư duy và phân tích.',
    emptyName: 'Mũi tên Trí nhớ ngắn hạn',
    empty: 'Dễ quên, khó tập trung lâu vào lý thuyết. Ghi chép và luyện trí nhớ thường xuyên sẽ giúp ích nhiều.',
  },
  {
    line: '159',
    fullName: 'Mũi tên Quyết tâm',
    full: 'Kiên định, bền bỉ, đã đặt mục tiêu thì quyết làm tới cùng. Cẩn thận để quyết tâm không biến thành cố chấp.',
    emptyName: 'Mũi tên Trì hoãn',
    empty: 'Hay chần chừ, để việc đến phút cuối. Chia việc lớn thành phần nhỏ và đặt hạn chót rõ ràng sẽ giúp bạn.',
  },
  {
    line: '357',
    fullName: 'Mũi tên Tâm linh',
    full: 'Có chiều sâu tâm hồn, biết cảm thông và hướng về những giá trị tinh thần. Bạn có khả năng xoa dịu người khác.',
    emptyName: 'Mũi tên Hoài nghi',
    empty: 'Hay nghi ngờ, cần bằng chứng rõ ràng mới tin. Mở lòng hơn với những điều chưa giải thích được sẽ giúp bạn bớt căng thẳng.',
  },
];

export const getArrow = (line: ArrowLine): ArrowMeaning => ARROWS.find((a) => a.line === line)!;
