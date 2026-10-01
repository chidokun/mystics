import { lazy } from 'react';
import type { ToolDefinition } from '../types';
import { BatuIcon } from './icon';
import { BATU_SLUG } from './paths';

export const batuTool: ToolDefinition = {
  slug: BATU_SLUG,
  name: 'Bát Tự Tứ Trụ',
  navLabel: 'Bát Tự',
  tagline: 'Đổi giờ, ngày, tháng, năm sinh thành bốn cột can chi để xem ngũ hành, nhật chủ, thập thần và các vận mười năm.',
  icon: BatuIcon,
  accent: 'var(--lam)',
  status: 'live',
  sections: [
    {
      path: 'lap-la-so',
      label: 'Lập lá số',
      summary: 'Nhập ngày giờ sinh dương lịch hoặc âm lịch để có tứ trụ, cân bằng ngũ hành, đại vận và lưu niên.',
      component: lazy(() => import('./pages/ChartPage')),
    },
    {
      path: 'tra-cuu',
      label: 'Tra cứu',
      summary: 'Thiên can, địa chi, ngũ hành sinh khắc, thập thần và sáu mươi hoa giáp.',
      component: lazy(() => import('./pages/LookupPage')),
    },
  ],
};
