/** Bỏ dấu tiếng Việt để tìm kiếm và tính toán: "Nguyễn Đức" → "Nguyen Duc" */
export function stripDiacritics(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export const normalizeSearch = (s: string) => stripDiacritics(s).toLowerCase().trim();
