import type { ReactNode } from 'react';
import { getTarotCard, type TarotSuit } from '../data/cards';

/**
 * Hình vẽ nét cho 78 lá Tarot, khung 64×64.
 * Ẩn chính có hình riêng; Ẩn phụ ghép từ biểu tượng chất (Gậy, Cốc, Kiếm, Tiền).
 */

const star4 = (cx: number, cy: number, R: number, r: number) =>
  `M${cx} ${cy - R}L${cx + r} ${cy - r}L${cx + R} ${cy}L${cx + r} ${cy + r}L${cx} ${cy + R}L${cx - r} ${cy + r}L${cx - R} ${cy}L${cx - r} ${cy - r}Z`;

/** Ngôi sao năm cánh; `down` để vẽ ngược */
const pentagram = (cx: number, cy: number, R: number, down = false) => {
  const start = down ? 90 : -90;
  const pts = Array.from({ length: 5 }, (_, i) => {
    const a = ((start + i * 144) * Math.PI) / 180;
    return `${(cx + R * Math.cos(a)).toFixed(1)} ${(cy + R * Math.sin(a)).toFixed(1)}`;
  });
  return `M${pts.join('L')}Z`;
};

const lemniscate = (cx: number, cy: number, w = 12, h = 5) =>
  `M${cx} ${cy}C${cx - w * 0.4} ${cy - h} ${cx - w} ${cy - h} ${cx - w} ${cy}C${cx - w} ${cy + h} ${cx - w * 0.4} ${cy + h} ${cx} ${cy}C${cx + w * 0.4} ${cy - h} ${cx + w} ${cy - h} ${cx + w} ${cy}C${cx + w} ${cy + h} ${cx + w * 0.4} ${cy + h} ${cx} ${cy}Z`;

const rays = (cx: number, cy: number, r1: number, r2: number, n: number, wavy = false) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i * 2 * Math.PI) / n;
    const p = (r: number, da = 0) => `${(cx + r * Math.cos(a + da)).toFixed(1)} ${(cy + r * Math.sin(a + da)).toFixed(1)}`;
    if (wavy && i % 2 === 1) return `M${p(r1)}Q${p((r1 + r2) / 2, 0.18)} ${p(r2 - 1)}`;
    return `M${p(r1)}L${p(r2)}`;
  }).join('');

/** Biểu tượng chất, vẽ trong khung 24×24 */
const SUIT_SYMBOL: Record<TarotSuit, ReactNode> = {
  wands: (
    <>
      <path d="M12 2V22" strokeWidth="2.6" />
      <path d="M12 7C9 6 8 4 8 4M12 10C15 9 16 7 16 7M12 15C9 14 8 12 8 12" />
    </>
  ),
  cups: (
    <>
      <path d="M5 3H19C19 10 16 13 12 13C8 13 5 10 5 3Z" className="bg" />
      <path d="M12 13V19M7.5 21H16.5" />
    </>
  ),
  swords: (
    <>
      <path d="M12 1L14 4V15H10V4Z" className="bg" />
      <path d="M6.5 15H17.5M12 15V20" />
      <circle cx="12" cy="21.5" r="1.4" className="bg" />
    </>
  ),
  pentacles: (
    <>
      <circle cx="12" cy="12" r="10" className="bg" />
      <path d={pentagram(12, 12.6, 7.5)} />
    </>
  ),
};

const suitAt = (suit: TarotSuit, cx: number, cy: number, size: number, key?: string | number) => (
  <g key={key} transform={`translate(${cx - size / 2} ${cy - size / 2}) scale(${size / 24})`} strokeWidth={2.2 * (24 / size) * 0.75}>
    {SUIT_SYMBOL[suit]}
  </g>
);

/** Vị trí các biểu tượng trên lá số 1–10 */
const PIPS: Record<number, [number, number][]> = {
  1: [[32, 32]],
  2: [[32, 16], [32, 48]],
  3: [[32, 11], [32, 32], [32, 53]],
  4: [[20, 18], [44, 18], [20, 46], [44, 46]],
  5: [[20, 15], [44, 15], [32, 32], [20, 49], [44, 49]],
  6: [[20, 11], [44, 11], [20, 32], [44, 32], [20, 53], [44, 53]],
  7: [[20, 11], [44, 11], [32, 21], [20, 32], [44, 32], [20, 53], [44, 53]],
  8: [[20, 11], [44, 11], [32, 21], [20, 32], [44, 32], [32, 43], [20, 53], [44, 53]],
  9: [[20, 9], [44, 9], [20, 24], [44, 24], [32, 32], [20, 40], [44, 40], [20, 55], [44, 55]],
  10: [[20, 9], [44, 9], [32, 16], [20, 24], [44, 24], [20, 40], [44, 40], [32, 48], [20, 55], [44, 55]],
};

const pipSize = (n: number) => (n === 1 ? 44 : n <= 3 ? 20 : n <= 6 ? 18 : n <= 8 ? 15 : 14);

/** Huy hiệu lá hoàng gia, đặt ở nửa trên */
const COURT: Record<number, ReactNode> = {
  // Tiểu Đồng: mũ có lông chim
  11: (
    <>
      <path d="M22 22C22 13 42 13 42 22Z" />
      <path d="M40 15C46 10 50 8 54 8C50 12 46 14 41 17" />
    </>
  ),
  // Hiệp Sĩ: đầu ngựa
  12: (
    <path d="M24 26C25 20 26 17 29 15C26 14.5 23 14 21.5 13C20 12 20 10 21 9L26 4.5C27 3.5 27.5 2.5 28 1L30 3.5C35 4.5 38 8 38.5 13C39 18 38 22 38 26Z" />
  ),
  // Hoàng Hậu: vương miện bo tròn
  13: (
    <>
      <path d="M20 22L22 10L27 16L32 7L37 16L42 10L44 22Z" />
      <circle cx="22" cy="9" r="1.6" className="ink" />
      <circle cx="32" cy="6" r="1.6" className="ink" />
      <circle cx="42" cy="9" r="1.6" className="ink" />
    </>
  ),
  // Vua: vương miện nhọn có đai
  14: (
    <>
      <path d="M18 24V10L25 17L32 5L39 17L46 10V24Z" />
      <path d="M18 20H46" />
    </>
  ),
};

const MAJOR: Record<number, ReactNode> = {
  0: (
    <>
      <circle cx="48" cy="13" r="5" />
      <path d={rays(48, 13, 7.5, 10.5, 8)} />
      <path d="M14 50L34 18" />
      <circle cx="36.5" cy="15" r="5" className="bg" />
      <path d="M4 56H36L42 62" />
      <circle cx="19" cy="42" r="2.4" />
    </>
  ),
  1: (
    <>
      <path d={lemniscate(32, 10, 11, 5)} />
      <path d="M32 20V44" strokeWidth="3" />
      <circle cx="32" cy="19" r="2" className="ink" />
      <circle cx="32" cy="45" r="2" className="ink" />
      <path d="M10 50H54M14 50V60M50 50V60" />
    </>
  ),
  2: (
    <>
      <rect x="9" y="10" width="9" height="46" rx="1" className="ink" />
      <rect x="46" y="10" width="9" height="46" rx="1" />
      <path d="M18 14C25 20 39 20 46 14" />
      <path d="M36 24A8 8 0 1 0 36 38A6 6 0 1 1 36 24Z" />
      <path d="M26 44H38V54H26ZM28.5 48H35.5M28.5 51H33" />
    </>
  ),
  3: (
    <>
      {[
        [17, 15],
        [24.5, 9.5],
        [32, 7.5],
        [39.5, 9.5],
        [47, 15],
      ].map(([x, y]) => (
        <path key={`${x}-${y}`} d={star4(x, y, 3.5, 1)} />
      ))}
      <circle cx="32" cy="32" r="10" />
      <path d="M32 42V58M25 50H39" />
    </>
  ),
  4: (
    <>
      <path d="M18 24H46V56H18Z" />
      <path d="M18 24C10 24 9 14 15 13C20 12 21 19 17 19.5M46 24C54 24 55 14 49 13C44 12 43 19 47 19.5" />
      <circle cx="32" cy="34" r="4" />
      <path d="M32 38V50M27 42H37" />
    </>
  ),
  5: (
    <>
      <path d="M32 5V38M26 13H38M23 21H41M20 29H44" />
      <circle cx="16" cy="54" r="4" />
      <path d="M19 51L34 36M30 40L33 43M27 43L30 46" />
      <circle cx="48" cy="54" r="4" />
      <path d="M45 51L30 36M34 40L31 43M37 43L34 46" />
    </>
  ),
  6: (
    <>
      <circle cx="32" cy="12" r="5" />
      <path d={rays(32, 12, 7.5, 10.5, 10)} />
      <circle cx="17" cy="31" r="5" />
      <path d="M17 36L11 56H23Z" className="bg" />
      <circle cx="47" cy="31" r="5" />
      <path d="M47 36L41 56H53Z" className="bg" />
      <path d="M32 47C27 43 27 39 29.5 38C31 37.5 32 39 32 40C32 39 33 37.5 34.5 38C37 39 37 43 32 47Z" />
    </>
  ),
  7: (
    <>
      <path d="M12 14H52" />
      <path d={star4(22, 10, 2.5, 0.8)} />
      <path d={star4(32, 10, 2.5, 0.8)} />
      <path d={star4(42, 10, 2.5, 0.8)} />
      <path d="M16 14V34M48 14V34" />
      <path d="M12 34H52V46H12Z" className="bg" />
      <circle cx="20" cy="52" r="7" className="bg" />
      <circle cx="44" cy="52" r="7" className="bg" />
      <circle cx="20" cy="52" r="1.6" className="ink" />
      <circle cx="44" cy="52" r="1.6" className="ink" />
    </>
  ),
  8: (
    <>
      <path d={lemniscate(32, 8, 9, 4)} />
      <path d={rays(32, 38, 14, 20, 16)} />
      <circle cx="32" cy="38" r="12" className="bg" />
      <circle cx="27.5" cy="35" r="1.4" className="ink" />
      <circle cx="36.5" cy="35" r="1.4" className="ink" />
      <path d="M29.5 41L32 43.5L34.5 41M32 43.5V46" />
    </>
  ),
  9: (
    <>
      <path d="M44 6V60" strokeWidth="2.8" />
      <path d="M24 16H44" />
      <path d="M24 16V20" />
      <path d="M17 25L24 20L31 25V37L24 42L17 37Z" className="bg" />
      <path d={star4(24, 31, 4.5, 1.3)} />
    </>
  ),
  10: (
    <>
      <circle cx="32" cy="32" r="23" />
      <circle cx="32" cy="32" r="15" />
      <circle cx="32" cy="32" r="3.5" />
      <path d={rays(32, 32, 3.5, 23, 8)} />
    </>
  ),
  11: (
    <>
      <path d="M32 8V54M22 54H42M14 16H50" />
      <path d="M16 16L10 32M16 16L22 32M9 32Q16 40 23 32Z" />
      <path d="M48 16L42 32M48 16L54 32M41 32Q48 40 55 32Z" />
      <circle cx="32" cy="8" r="2.4" className="ink" />
    </>
  ),
  12: (
    <>
      <path d="M10 8H54M14 8V60M50 8V60" />
      <path d="M32 8V16M32 16V34M32 22L40 26L32 30" />
      <path d="M26 40L32 34L38 40" />
      <circle cx="32" cy="49" r="8" strokeDasharray="2 3" />
      <circle cx="32" cy="49" r="4.5" className="bg" />
    </>
  ),
  13: (
    <>
      <path d="M18 6V58" strokeWidth="2.8" />
      <path d="M18 8H50L44 18L50 28H18" className="bg" />
      <circle cx="31" cy="18" r="5" />
      <circle cx="31" cy="18" r="1.8" className="ink" />
      <path d="M26 18H36M31 13V23" strokeWidth="1.2" />
      <path d="M36 60A9 9 0 0 1 54 60" />
      <path d="M8 60H58" />
    </>
  ),
  14: (
    <>
      <path d="M12 14H28C28 21 25 24 20 24C15 24 12 21 12 14Z" className="bg" />
      <path d="M20 24V30M16 30H24" />
      <path d="M26 20C34 22 40 30 42 38" strokeDasharray="3 2.5" />
      <path d="M36 38H52C52 45 49 48 44 48C39 48 36 45 36 38Z" className="bg" />
      <path d="M44 48V54M40 54H48" />
      <path d="M6 60C10 57 14 57 18 60S26 63 30 60S38 57 42 60S50 63 54 60" />
    </>
  ),
  15: (
    <>
      <path d="M22 18C16 14 14 8 17 3M42 18C48 14 50 8 47 3" />
      <circle cx="32" cy="30" r="15" className="bg" />
      <path d={pentagram(32, 29, 13, true)} />
      <ellipse cx="24" cy="54" rx="4" ry="5.5" />
      <ellipse cx="32" cy="54" rx="4" ry="5.5" />
      <ellipse cx="40" cy="54" rx="4" ry="5.5" />
    </>
  ),
  16: (
    <>
      <path d="M24 60V22H40V60" />
      <path d="M22 22V16H26V19H30V16H34V19H38V16H42V22Z" />
      <path d="M44 13L48 5L51 10L55 3L56 13Z" className="bg" />
      <path d="M58 2L46 16L52 18L40 32" strokeWidth="2.6" />
      <path d="M29 30V36M35 42V48M29 50V54" />
      <path d="M16 60H48" />
      <circle cx="16" cy="30" r="1.4" className="ink" />
      <circle cx="12" cy="42" r="1.4" className="ink" />
      <circle cx="50" cy="44" r="1.4" className="ink" />
    </>
  ),
  17: (
    <>
      <path d={star4(32, 20, 15, 3.8)} />
      <path d={star4(32, 20, 8, 2)} transform="rotate(45 32 20)" />
      {[
        [10, 10],
        [54, 10],
        [8, 30],
        [56, 30],
        [16, 42],
        [48, 42],
      ].map(([x, y]) => (
        <path key={`${x}-${y}`} d={star4(x, y, 3, 0.9)} />
      ))}
      <path d="M6 52C10 49 14 49 18 52S26 55 30 52S38 49 42 52S50 55 54 52M10 59C14 56 18 56 22 59S30 62 34 59S42 56 46 59" />
    </>
  ),
  18: (
    <>
      <circle cx="32" cy="18" r="12" />
      <path d="M33 8A10 10 0 0 1 33 28A7.5 7.5 0 0 0 33 8Z" className="ink" />
      <path d="M24 34L23 37M32 35L32 38M40 34L41 37" />
      <path d="M6 60V42H14V60M50 60V42H58V60" />
      <path d="M32 62C27 56 37 52 32 46" />
    </>
  ),
  19: (
    <>
      <circle cx="32" cy="28" r="10" />
      <path d={rays(32, 28, 13, 22, 16, true)} />
      <path d="M8 58H56" />
      <path d="M14 58V52M22 58V50M42 58V50M50 58V52" />
      <circle cx="14" cy="50" r="2" />
      <circle cx="22" cy="48" r="2" />
      <circle cx="42" cy="48" r="2" />
      <circle cx="50" cy="50" r="2" />
    </>
  ),
  20: (
    <>
      <path d="M8 6L30 20" strokeWidth="3" />
      <path d="M29 15L44 8L42 34L30 25Z" className="bg" />
      <path d="M20 22H32V32H20ZM26 22V32M20 27H32" />
      <path d="M6 60H58" />
      <circle cx="18" cy="50" r="3" />
      <path d="M13 44L18 47L23 44" />
      <circle cx="32" cy="48" r="3" />
      <path d="M27 42L32 45L37 42" />
      <circle cx="46" cy="50" r="3" />
      <path d="M41 44L46 47L51 44" />
    </>
  ),
  21: (
    <>
      <ellipse cx="32" cy="32" rx="14" ry="22" />
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const x = 32 + 14 * Math.cos(a);
        const y = 32 + 22 * Math.sin(a);
        const dx = 4 * Math.cos(a + 0.9);
        const dy = 4 * Math.sin(a + 0.9);
        return <path key={i} d={`M${x.toFixed(1)} ${y.toFixed(1)}l${dx.toFixed(1)} ${dy.toFixed(1)}`} />;
      })}
      <path d="M28 7L36 13M36 7L28 13M28 51L36 57M36 51L28 57" className="accent" />
      <circle cx="8" cy="8" r="3" />
      <circle cx="56" cy="8" r="3" />
      <circle cx="8" cy="56" r="3" />
      <circle cx="56" cy="56" r="3" />
    </>
  ),
};

export function TarotGlyph({ id, className }: { id: number; className?: string }) {
  const card = getTarotCard(id);
  let content: ReactNode;
  if (card.arcana === 'major') {
    content = MAJOR[card.rank];
  } else if (card.rank <= 10) {
    const size = pipSize(card.rank);
    content = PIPS[card.rank].map(([x, y], i) => suitAt(card.suit!, x, y, size, i));
  } else {
    content = (
      <>
        {COURT[card.rank]}
        {suitAt(card.suit!, 32, 45, 26)}
      </>
    );
  }
  return (
    <svg
      viewBox="0 0 64 64"
      className={`tr-glyph ${className ?? ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {content}
    </svg>
  );
}
