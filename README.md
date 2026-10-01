# Huyền Cơ

Bộ công cụ tâm linh chạy hoàn toàn trên trình duyệt:

- **Bài Lenormand**: 7 cách trải (1 lá, 3 lá đọc thành câu, Có/Không, dòng thời gian 5 lá, ô vuông 9 lá, Hai người, Đại Trải Bài 36 lá) kèm diễn giải tự động; tra cứu 36 lá theo chủ đề.
- **Tarot**: 78 lá hệ Rider–Waite, có lá ngược; 7 cách trải (1 lá, Quá khứ – Hiện tại – Tương lai, Tình huống – Hành động – Kết quả, Có/Không, Tình yêu, Hai lựa chọn, Celtic Cross); diễn giải theo vị trí, nguyên tố, lá Ẩn chính; tra cứu nghĩa xuôi và ngược.
- **Thần số học Pythagoras**: lập bảng từ họ tên và ngày sinh (số chủ đạo, sứ mệnh, linh hồn, nhân cách, ngày sinh, thái độ, trưởng thành, cân bằng, biểu đồ và mũi tên, năm/tháng cá nhân, bốn đỉnh cao và thử thách); tra cứu ý nghĩa.
- **Bát Tự Tứ Trụ**: nhập ngày giờ sinh dương lịch hoặc âm lịch (có tháng nhuận); tính bốn trụ theo tiết khí thiên văn, tàng can, thập thần, nạp âm, nhật chủ, cân bằng ngũ hành và hành nên bổ sung, hợp xung, thần sát, đại vận và lưu niên; tra cứu can chi, ngũ hành, thập thần, sáu mươi hoa giáp.
- **Kinh Dịch**: gieo ba đồng xu hoặc lập quẻ Mai Hoa từ hai con số; đọc quẻ chủ, hào động (chọn hào trọng tâm theo quy tắc Chu Hy), quẻ biến, quẻ hỗ; tra cứu 64 quẻ với lời quẻ, lời tượng, sáu hào và bát quái.

## Chạy

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # kiểm thử phần tính toán và diễn giải
npm run build    # xuất bản tĩnh vào dist/
```

Ứng dụng dùng hash router (`/#/lenormand/...`) nên thư mục `dist/` chạy được trên mọi host tĩnh (GitHub Pages, Netlify, S3…) mà không cần cấu hình chuyển hướng.

## Deploy lên GitHub Pages

Workflow `.github/workflows/deploy.yml` tự chạy mỗi khi push lên nhánh `main`: cài thư viện, chạy kiểm thử, build rồi đăng thư mục `dist/` lên GitHub Pages. Có thể chạy tay ở tab **Actions → Deploy lên GitHub Pages → Run workflow**.

Lần đầu cần bật Pages: vào **Settings → Pages → Build and deployment → Source** và chọn **GitHub Actions**.

Trang chạy được cả ở `https://<user>.github.io/<repo>/` lẫn tên miền riêng mà không cần sửa cấu hình, vì Vite build với đường dẫn tương đối (`base: './'`) và ứng dụng dùng hash router.

## Thêm một công cụ mới

1. Tạo thư mục `src/tools/<ten-cong-cu>/` với `index.ts` export một `ToolDefinition` (xem `src/tools/types.ts`):

   ```ts
   export const tarotTool: ToolDefinition = {
     slug: 'tarot',
     name: 'Tarot',
     tagline: 'Một câu giới thiệu.',
     icon: TarotIcon,
     accent: 'var(--tim)', // màu nhấn riêng: nút, tab, chip đang chọn, viền ô ở trang chủ
     status: 'live',
     sections: [
       { path: 'trai-bai', label: 'Trải bài', summary: '…', component: lazy(() => import('./pages/ReadingPage')) },
       { path: 'tra-cuu', label: 'Tra cứu', summary: '…', component: lazy(() => import('./pages/LookupPage')) },
     ],
   };
   ```

2. Thêm vào mảng `TOOLS` trong `src/tools/registry.ts`.

Trang chủ, thanh điều hướng, các tab và đường dẫn `/#/<slug>/<section>` được tạo tự động. Mỗi mục có thể tự xử lý đường dẫn con qua `useParams()['*']` (ví dụ `/#/lenormand/tra-cuu/24`). Đặt `status: 'soon'` để công cụ hiện trong mục "Đang chuẩn bị" mà chưa mở.

## Cấu trúc

```
src/
  tools/
    registry.ts        danh sách công cụ
    types.ts           kiểu ToolDefinition
    lenormand/         data/ (36 lá, cặp lá, cách trải), lib/ (xào bài, diễn giải), components/, pages/
    tarot/             data/ (78 lá, cách trải), lib/interpret.ts, components/ (lá bài, hình vẽ), pages/
    numerology/        data/ (ý nghĩa số, mũi tên, chu kỳ), lib/calc.ts, components/, pages/
    batu/              data/ (can chi, ngũ hành, thập thần), lib/calendar.ts (tiết khí, âm lịch), lib/bazi.ts, components/, pages/
    iching/            data/ (64 quẻ, bát quái), lib/iching.ts (gieo quẻ, quẻ biến, quẻ hỗ), components/, pages/
  lib/                 random.ts (ngẫu nhiên bằng crypto), storage.ts, text.ts
  components/          khung trang dùng chung (header, layout công cụ, hộp thoại)
  styles/              tokens.css (bảng màu: đỏ son, chàm, ngọc, hòe, tím; nền trắng), kiểu nền
```
