import { lazy } from 'react';
import type { ToolDefinition } from '../types';
import { LenormandIcon } from './icon';
import { LENORMAND_SLUG } from './paths';

export const lenormandTool: ToolDefinition = {
  slug: LENORMAND_SLUG,
  name: 'Bài Lenormand',
  navLabel: 'Lenormand',
  tagline: 'Bộ 36 lá ra đời ở châu Âu thế kỷ 19. Lá bài được đọc theo cặp, ghép thành câu, nên câu trả lời thường thẳng và cụ thể.',
  icon: LenormandIcon,
  accent: 'var(--son)',
  status: 'live',
  sections: [
    {
      path: 'trai-bai',
      label: 'Trải bài',
      summary: 'Đặt câu hỏi, chọn một trong bảy cách trải và nhận diễn giải.',
      component: lazy(() => import('./pages/ReadingPage')),
    },
    {
      path: 'tra-cuu',
      label: 'Tra cứu 36 lá',
      summary: 'Ý nghĩa từng lá theo tình cảm, công việc, tài chính, sức khỏe.',
      component: lazy(() => import('./pages/LookupPage')),
    },
  ],
};
