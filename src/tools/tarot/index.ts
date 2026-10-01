import { lazy } from 'react';
import type { ToolDefinition } from '../types';
import { TarotIcon } from './icon';
import { TAROT_SLUG } from './paths';

export const tarotTool: ToolDefinition = {
  slug: TAROT_SLUG,
  name: 'Tarot',
  tagline: 'Bộ 78 lá theo hệ Rider–Waite: 22 lá Ẩn chính cho những bước ngoặt lớn, 56 lá Ẩn phụ cho đời sống hằng ngày.',
  icon: TarotIcon,
  accent: 'var(--tim)',
  status: 'live',
  sections: [
    {
      path: 'trai-bai',
      label: 'Trải bài',
      summary: 'Chọn chủ đề, một trong bảy cách trải kể cả Celtic Cross, có lá xuôi và lá ngược.',
      component: lazy(() => import('./pages/ReadingPage')),
    },
    {
      path: 'tra-cuu',
      label: 'Tra cứu 78 lá',
      summary: 'Nghĩa xuôi và ngược của từng lá theo tình cảm, công việc và tài chính.',
      component: lazy(() => import('./pages/LookupPage')),
    },
  ],
};
