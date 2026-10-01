import { batuTool } from './batu';
import { ichingTool } from './iching';
import { lenormandTool } from './lenormand';
import { numerologyTool } from './numerology';
import { tarotTool } from './tarot';
import type { ToolDefinition } from './types';
import { upcomingTools } from './upcoming';

/**
 * Danh sách công cụ. Thêm công cụ mới:
 *   1. Tạo thư mục src/tools/<ten-cong-cu>/ với index.ts export một ToolDefinition
 *   2. Thêm vào mảng dưới đây — trang chủ, thanh điều hướng và đường dẫn tự cập nhật.
 */
export const TOOLS: ToolDefinition[] = [lenormandTool, tarotTool, numerologyTool, batuTool, ichingTool, ...upcomingTools];

export const LIVE_TOOLS = TOOLS.filter((t) => t.status === 'live');
export const UPCOMING_TOOLS = TOOLS.filter((t) => t.status === 'soon');
