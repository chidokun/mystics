import type { ComponentType, LazyExoticComponent } from 'react';

export interface ToolSection {
  /** Đoạn URL của mục, ví dụ 'trai-bai' → /#/lenormand/trai-bai */
  path: string;
  /** Tên hiển thị trên thanh tab */
  label: string;
  /** Một câu mô tả mục này làm gì, hiển thị ở trang chủ */
  summary: string;
  /** Trang của mục; có thể tự xử lý đường dẫn con qua useParams()['*'] */
  component: LazyExoticComponent<ComponentType>;
}

export interface ToolDefinition {
  slug: string;
  name: string;
  /** Tên ngắn trên thanh điều hướng; mặc định dùng `name` */
  navLabel?: string;
  /** Một câu giới thiệu công cụ */
  tagline: string;
  icon: ComponentType<{ className?: string }>;
  /** Màu nhấn riêng của công cụ, ví dụ 'var(--son)' hoặc '#6b4c9a' */
  accent: string;
  status: 'live' | 'soon';
  /** Mục đầu tiên là trang mặc định khi mở công cụ */
  sections: ToolSection[];
}
