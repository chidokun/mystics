/** Số nguyên ngẫu nhiên trong [0, max), dùng crypto và loại bỏ thiên lệch modulo. */
export function randomInt(max: number): number {
  const buf = new Uint32Array(1);
  const limit = Math.floor(0x1_0000_0000 / max) * max;
  let x: number;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);
  return x % max;
}

/** Xáo trộn Fisher–Yates, trả về mảng mới. */
export function shuffle<T>(items: readonly T[], rand: (max: number) => number = randomInt): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Bộ sinh số giả ngẫu nhiên có seed, dùng trong kiểm thử để kết quả lặp lại được. */
export function seededRandom(seed: number): (max: number) => number {
  let s = seed;
  return (max: number) => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s % max;
  };
}
