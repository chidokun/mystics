import { lazy } from 'react';
import type { ToolDefinition } from '../types';
import { NumerologyIcon } from './icon';
import { NUMEROLOGY_SLUG } from './paths';

export const numerologyTool: ToolDefinition = {
  slug: NUMEROLOGY_SLUG,
  name: 'Thần số học Pythagoras',
  navLabel: 'Thần số học',
  tagline: 'Đổi họ tên và ngày sinh thành những con số, để đọc ra tính cách, điểm mạnh và các chu kỳ trong cuộc đời bạn.',
  icon: NumerologyIcon,
  accent: 'var(--luc)',
  status: 'live',
  sections: [
    {
      path: 'lap-bang',
      label: 'Lập bảng',
      summary: 'Nhập họ tên và ngày sinh để có số chủ đạo, biểu đồ mũi tên, năm cá nhân và bốn đỉnh cao.',
      component: lazy(() => import('./pages/ChartPage')),
    },
    {
      path: 'tra-cuu',
      label: 'Tra cứu',
      summary: 'Ý nghĩa các con số từ 1 đến 33, mũi tên, chu kỳ và cách tính.',
      component: lazy(() => import('./pages/LookupPage')),
    },
  ],
};
