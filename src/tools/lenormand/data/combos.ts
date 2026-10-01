/**
 * Các cặp lá có nghĩa riêng, phổ biến trong cách đọc Lenormand.
 * `both: true` nghĩa là đọc được theo cả hai thứ tự.
 */
interface Combo {
  a: number;
  b: number;
  both?: boolean;
  text: string;
}

const COMBOS: Combo[] = [
  { a: 24, b: 25, both: true, text: 'Cam kết tình cảm — đính hôn, kết hôn hoặc lời hứa nghiêm túc.' },
  { a: 27, b: 25, both: true, text: 'Hợp đồng, văn bản được ký kết.' },
  { a: 3, b: 4, both: true, text: 'Chuyển nhà, hoặc một ngôi nhà ở nơi xa.' },
  { a: 34, b: 33, both: true, text: 'Giải pháp tài chính then chốt; tiền bạc được khai thông.' },
  { a: 8, b: 17, text: 'Kết thúc một giai đoạn để bước sang chương mới tốt hơn.' },
  { a: 17, b: 13, both: true, text: 'Tin vui về con cái, hoặc một khởi đầu mới thuận lợi.' },
  { a: 1, b: 27, both: true, text: 'Tin nhắn, thư từ sắp tới.' },
  { a: 7, b: 24, both: true, text: 'Tình cảm phức tạp; có thể có người thứ ba hoặc sự cám dỗ.' },
  { a: 6, b: 26, both: true, text: 'Sự thật bị che giấu kỹ; bí mật mờ mịt khó lần ra.' },
  { a: 26, b: 27, text: 'Tài liệu mật, thông tin nội bộ hoặc giấy tờ chưa công bố.' },
  { a: 14, b: 35, both: true, text: 'Công việc ổn định, lâu dài.' },
  { a: 31, b: 33, both: true, text: 'Thành công chắc chắn.' },
  { a: 21, b: 33, text: 'Vượt qua trở ngại; tìm ra lối đi qua ngọn núi.' },
  { a: 10, b: 24, both: true, text: 'Tổn thương tình cảm đột ngột; một cuộc chia tay dứt khoát.' },
  { a: 23, b: 34, both: true, text: 'Thất thoát tiền bạc; tiền rò rỉ từng chút.' },
  { a: 18, b: 24, text: 'Tình bạn chuyển thành tình yêu.' },
  { a: 12, b: 24, both: true, text: 'Trò chuyện tình cảm, hẹn hò.' },
  { a: 9, b: 24, both: true, text: 'Một lời tỏ tình hoặc món quà từ trái tim.' },
  { a: 22, b: 3, text: 'Lựa chọn đi xa; quyết định chuyển đi hoặc đổi hướng lớn.' },
  { a: 5, b: 8, both: true, text: 'Sức khỏe suy kiệt, cần nghỉ ngơi nghiêm túc.' },
  { a: 5, b: 31, both: true, text: 'Hồi phục mạnh mẽ, sức sống dồi dào.' },
  { a: 19, b: 27, both: true, text: 'Văn bản chính thức, giấy tờ từ cơ quan.' },
  { a: 20, b: 32, both: true, text: 'Được công chúng biết đến; danh tiếng lan rộng.' },
  { a: 30, b: 4, both: true, text: 'Gia đình yên ấm; người lớn tuổi trong nhà.' },
  { a: 16, b: 32, both: true, text: 'Ước mơ sáng tạo thành hiện thực; nổi bật trên mạng xã hội.' },
  { a: 11, b: 12, both: true, text: 'Cãi vã, lời qua tiếng lại.' },
  { a: 28, b: 29, both: true, text: 'Hai người gặp nhau; một cặp đôi.' },
  { a: 36, b: 33, text: 'Thử thách mang tính định mệnh nhưng đã có lời giải.' },
  { a: 15, b: 34, both: true, text: 'Tài sản lớn; quản lý tiền bạc vững vàng.' },
  { a: 2, b: 34, both: true, text: 'Khoản tiền may mắn bất ngờ.' },
  { a: 3, b: 34, both: true, text: 'Kinh doanh với nước ngoài; thu nhập từ phương xa.' },
  { a: 14, b: 24, both: true, text: 'Tình cảm không thật lòng; cần tỉnh táo.' },
  { a: 21, b: 24, text: 'Cảm xúc bị chặn lại; rào cản trong tình yêu.' },
  { a: 6, b: 31, text: 'Mây tan, trời sáng: rối ren sắp được giải tỏa.' },
  { a: 10, b: 25, both: true, text: 'Phá vỡ cam kết; hủy hợp đồng.' },
  { a: 8, b: 25, both: true, text: 'Một mối quan hệ hay thỏa thuận đi đến hồi kết.' },
  { a: 13, b: 14, text: 'Công việc mới, vị trí thử việc.' },
  { a: 35, b: 31, both: true, text: 'Sự nghiệp vững vàng và thành công.' },
];

const index = new Map<string, string>();
for (const c of COMBOS) {
  index.set(`${c.a}-${c.b}`, c.text);
  if (c.both) index.set(`${c.b}-${c.a}`, c.text);
}

export const findCombo = (a: number, b: number): string | undefined => index.get(`${a}-${b}`);

export interface ComboRef {
  other: number;
  /** Lá đang xem đứng trước trong cặp */
  first: boolean;
  text: string;
}

export const combosFor = (id: number): ComboRef[] =>
  COMBOS.flatMap((c): ComboRef[] => {
    if (c.a === id) return [{ other: c.b, first: true, text: c.text }];
    if (c.b === id) return [{ other: c.a, first: false, text: c.text }];
    return [];
  });
