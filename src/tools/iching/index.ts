import { lazy } from 'react';
import type { ToolDefinition } from '../types';
import { IChingIcon } from './icon';
import { ICHING_SLUG } from './paths';

export const ichingTool: ToolDefinition = {
  slug: ICHING_SLUG,
  name: 'Gieo quẻ Kinh Dịch',
  navLabel: 'Kinh Dịch',
  tagline: 'Gieo ba đồng xu sáu lần để lập quẻ, rồi đọc lời quẻ, hào động và quẻ biến trong 64 quẻ của Kinh Dịch.',
  icon: IChingIcon,
  accent: 'var(--muc)',
  status: 'live',
  sections: [
    {
      path: 'gieo-que',
      label: 'Gieo quẻ',
      summary: 'Gieo đồng xu hoặc lập quẻ từ hai con số, nhận quẻ chủ, hào động, quẻ biến và quẻ hỗ.',
      component: lazy(() => import('./pages/CastPage')),
    },
    {
      path: 'tra-cuu',
      label: 'Tra cứu 64 quẻ',
      summary: 'Lời quẻ, lời tượng và sáu hào của từng quẻ; ý nghĩa bát quái.',
      component: lazy(() => import('./pages/LookupPage')),
    },
  ],
};
