import type { CSSProperties } from 'react';
import type { ToolDefinition } from './types';

/** Gán màu nhấn của công cụ cho một phần tử; dùng cùng class "has-accent". */
export const accentStyle = (tool: Pick<ToolDefinition, 'accent'>): CSSProperties =>
  ({ '--accent': tool.accent }) as CSSProperties;
