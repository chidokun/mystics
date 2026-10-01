/** Đọc/ghi localStorage an toàn: chế độ ẩn danh hoặc trình duyệt chặn lưu trữ sẽ không làm vỡ trang. */
export function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStored(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Bỏ qua: lưu trữ chỉ để tiện, không bắt buộc.
  }
}
