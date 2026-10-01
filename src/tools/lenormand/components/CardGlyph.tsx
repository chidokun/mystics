import type { ReactNode } from 'react';

/**
 * Hình vẽ nét cho 36 lá Lenormand, khung 64×64.
 * Các hình có class "bg" được tô màu mặt bài để che nét chồng phía sau.
 */

const dot = (cx: number, cy: number, r = 1.6) => <circle cx={cx} cy={cy} r={r} className="ink" />;

const star4 = (cx: number, cy: number, R: number, r: number) =>
  `M${cx} ${cy - R}L${cx + r} ${cy - r}L${cx + R} ${cy}L${cx + r} ${cy + r}L${cx} ${cy + R}L${cx - r} ${cy + r}L${cx - R} ${cy}L${cx - r} ${cy - r}Z`;

const sunRays = Array.from({ length: 12 }, (_, i) => {
  const a = (i * Math.PI) / 6;
  const r1 = 15;
  const r2 = i % 2 === 0 ? 25 : 21;
  const p = (r: number) => `${(32 + r * Math.cos(a)).toFixed(1)} ${(32 + r * Math.sin(a)).toFixed(1)}`;
  return `M${p(r1)}L${p(r2)}`;
}).join('');

const GLYPHS: Record<number, ReactNode> = {
  1: (
    <>
      <path d="M22 56C23 45 25 39 29 34C25 33 20 32 17 30C14 28 13 25 15 22L24 13C26 11 27 8 28 4L32 9C40 11 46 18 47 28C48 38 46 47 46 56Z" />
      <path d="M24 28C27 27 29 24 29 21" />
      {dot(25, 19)}
      {dot(17.5, 25.5, 1.1)}
      <path d="M34 12C38 15 41 19 42 24M37 11C42 14 45 19 46 25" />
    </>
  ),
  2: (
    <>
      <path d="M32 30C32 42 30 50 24 58" />
      <circle cx="32" cy="17" r="9" className="bg" />
      <circle cx="21" cy="31" r="9" className="bg" />
      <circle cx="43" cy="31" r="9" className="bg" />
      <path d="M32 26V13M29 29L17 33M35 29L47 33" />
    </>
  ),
  3: (
    <>
      <path d="M10 40H54L48 50H16Z" />
      <path d="M32 40V6" />
      <path d="M34 10C44 16 48 26 48 36H34Z" />
      <path d="M30 14C24 20 20 28 18 36H30Z" />
      <path d="M32 6L39 4L32 2" />
      <path d="M6 57C10 54 14 54 18 57S26 60 30 57S38 54 42 57S50 60 54 57" />
    </>
  ),
  4: (
    <>
      <path d="M8 30L32 10L56 30" />
      <path d="M14 26V54H50V26" />
      <path d="M28 54V42H36V54" />
      <path d="M19 33H26V40H19ZM38 33H45V40H38Z" />
      <path d="M42 18V11H47V22" />
    </>
  ),
  5: (
    <>
      <path d="M28 38L27 56M36 38L37 56M18 56H46" />
      <path d="M18 38C8 38 8 24 16 22C14 12 26 6 32 12C38 6 50 12 48 22C56 24 56 38 46 38Z" className="bg" />
      <path d="M32 38V26M32 31L25 25M32 29L39 23" />
    </>
  ),
  6: (
    <>
      <path d="M40 20C40 13 49 10 52 16C58 14 62 22 57 25" />
      <path d="M14 44C6 44 6 32 14 32C14 22 28 18 34 26C38 20 50 22 50 32C58 32 58 44 50 44Z" className="bg" />
      <path d="M20 50L17 57M31 50L28 57M42 50L39 57" />
    </>
  ),
  7: (
    <>
      <path
        d="M10 55C22 57 28 47 32 43C38 37 50 37 48 27C46 19 30 23 28 15C27 10 32 7 38 8"
        strokeWidth="3.2"
      />
      <ellipse cx="43" cy="9" rx="5.5" ry="3.8" className="bg" />
      {dot(44.5, 8, 1.1)}
      <path d="M48.5 9.5L54 11L57 9M54 11L57 13.5" />
    </>
  ),
  8: (
    <>
      <path d="M25 5H39L47 20L40 59H24L17 20Z" />
      <path d="M32 18V37M25.5 24.5H38.5" />
    </>
  ),
  9: (
    <>
      <path d="M24 26L30 50M40 24L34 50M32 32V50" />
      <path d="M27 41C22 38 17 40 15 45C20 45 24 45 27 41ZM37 41C42 38 47 40 49 45C44 45 40 45 37 41Z" className="bg" />
      <circle cx="23" cy="20" r="7" className="bg" />
      <circle cx="41" cy="18" r="7" className="bg" />
      <circle cx="32" cy="29" r="7" className="bg" />
      {dot(23, 20, 2)}
      {dot(41, 18, 2)}
      {dot(32, 29, 2)}
      <path d="M26 50H38L35 59H29Z" className="bg" />
    </>
  ),
  10: (
    <>
      <path d="M46 59L24 9" strokeWidth="3" />
      <path d="M24 9C36 3 50 7 58 19C48 13 37 12 27 16" />
      <path d="M31 27L40 23" />
    </>
  ),
  11: (
    <>
      <path d="M12 57L25 40" strokeWidth="4" />
      <path d="M25 40C31 32 45 36 48 26C52 16 44 9 37 13C32 16 35 23 42 22" />
      <circle cx="11" cy="58" r="2.2" className="bg" />
    </>
  ),
  12: (
    <>
      <path d="M4 30C11 17 20 17 25 27C30 17 39 17 46 30" strokeWidth="2.6" />
      <path d="M22 50C28 40 35 40 39 47C43 40 50 40 58 50" strokeWidth="2.6" />
    </>
  ),
  13: (
    <>
      <path d="M27 28L18 35M37 28L46 35M28 44V55M36 44V55" />
      <path d="M32 21L22 44H42Z" className="bg" />
      <circle cx="32" cy="14" r="6.5" className="bg" />
      <path d="M29 8C31 6 34 6 35 8" />
    </>
  ),
  14: (
    <>
      <path d="M14 10L14 32L32 52L50 32L50 10L40 22H24Z" />
      <path d="M18 18L22 23M46 18L42 23" />
      <path d="M21 30L27 32.5M43 30L37 32.5" />
      <path d="M25 39L32 46L39 39" />
      {dot(32, 47, 2.2)}
      <path d="M14 32L19 35M50 32L45 35" />
    </>
  ),
  15: (
    <>
      <circle cx="18" cy="18" r="7" />
      <circle cx="46" cy="18" r="7" />
      <circle cx="32" cy="35" r="18" className="bg" />
      <ellipse cx="32" cy="43" rx="8" ry="6" />
      <ellipse cx="32" cy="40" rx="3" ry="2" className="ink" />
      {dot(25, 30)}
      {dot(39, 30)}
    </>
  ),
  16: (
    <>
      <path d={star4(32, 30, 18, 4.5)} />
      <path d={star4(32, 30, 9, 2.5)} transform="rotate(45 32 30)" />
      <path d={star4(13, 12, 5, 1.4)} />
      <path d={star4(52, 50, 6, 1.6)} />
      <path d={star4(13, 52, 3.5, 1)} />
    </>
  ),
  17: (
    <>
      <path d="M28 38V59M33 38L36 49L30 51" />
      <path d="M14 32C18 24 36 22 42 26C44 30 40 36 30 38C22 38 16 36 14 32Z" className="bg" />
      <path d="M14 32L7 36M20 31C26 29 32 29 38 31" />
      <path d="M41 26C46 22 44 16 46 12" />
      <circle cx="47" cy="11" r="3.2" className="bg" />
      <path d="M50 11L61 16L50 13.5" />
    </>
  ),
  18: (
    <>
      <path d="M22 44C18 36 18 24 22 18C26 14 38 14 42 18C46 24 46 36 42 44C38 50 26 50 22 44Z" />
      <path d="M22 18C14 18 9 30 13 40C15 45 20 43 21 37Z" className="bg" />
      <path d="M42 18C50 18 55 30 51 40C49 45 44 43 43 37Z" className="bg" />
      {dot(27.5, 28)}
      {dot(36.5, 28)}
      <ellipse cx="32" cy="37" rx="3.2" ry="2.2" className="ink" />
      <path d="M32 39V42M28 43C30 45 34 45 36 43" />
    </>
  ),
  19: (
    <>
      <path d="M22 56V20H42V56" />
      <path d="M20 20V12H25V16H29.5V12H34.5V16H39V12H44V20Z" />
      <path d="M30 34V29A2 2 0 0 1 34 29V34Z" />
      <path d="M27 56V48A5 5 0 0 1 37 48V56" />
      <path d="M14 56H50" />
    </>
  ),
  20: (
    <>
      <path d="M6 57H58" />
      <path d="M22 57V31C22 21 42 21 42 31V57" />
      <path d="M8 41H22M8 49H22M12 37V57M17 37V57" />
      <path d="M42 41H56M42 49H56M47 37V57M52 37V57" />
      <path d="M28 57L30 42H34L36 57" />
      <circle cx="24" cy="26" r="2.5" className="bg" />
      <circle cx="32" cy="21" r="2.5" className="bg" />
      <circle cx="40" cy="26" r="2.5" className="bg" />
    </>
  ),
  21: (
    <>
      <path d="M4 56L22 20L32 38L40 27L60 56Z" />
      <path d="M16 32L22 20L28 32L25 30L22 34L19 30Z" />
      <path d="M35 34L40 27L45 34" />
    </>
  ),
  22: (
    <>
      <path d="M32 58V8" />
      <path d="M32 13H48L53 18.5L48 24H32" className="bg" />
      <path d="M32 29H16L11 34.5L16 40H32" className="bg" />
      <path d="M14 58C22 54 26 52 32 50C38 52 42 54 50 58" />
    </>
  ),
  23: (
    <>
      <path d="M12 48C4 48 4 40 10 38C14 36 12 30 6 30" />
      <path d="M12 48C10 36 24 28 38 32C46 34 52 40 56 44C52 48 44 48 40 48Z" className="bg" />
      <circle cx="35" cy="30" r="6" className="bg" />
      {dot(46, 39, 1.4)}
      <path d="M56 44L62 42M56 44L62 46.5M22 48V52M36 48V52" />
    </>
  ),
  24: <path d="M32 54C10 40 8 26 14 18C20 10 30 12 32 20C34 12 44 10 50 18C56 26 54 40 32 54Z" />,
  25: (
    <>
      <circle cx="32" cy="40" r="15" />
      <circle cx="32" cy="40" r="11" />
      <path d="M26 20L30 13H34L38 20L32 27Z" className="bg" />
      <path d="M26 20H38M30 13L32 20L34 13" />
    </>
  ),
  26: (
    <>
      <path d="M16 12H44A4 4 0 0 1 48 16V52H20A4 4 0 0 1 16 48Z" />
      <path d="M20 12V52M20 47H48" />
      <path d="M26 22H40M26 27H36" />
      <path d="M44 28H52V37H44Z" className="bg" />
      {dot(48, 32.5, 1.3)}
    </>
  ),
  27: (
    <>
      <path d="M8 18H56V48H8Z" />
      <path d="M8 18L32 36L56 18" />
      <path d="M8 48L26 32M56 48L38 32" />
      <circle cx="32" cy="36" r="3.5" className="ink" />
    </>
  ),
  28: (
    <>
      <path d="M14 58C14 45 22 39 32 39C42 39 50 45 50 58" />
      <path d="M28 39L32 47L36 39" />
      <circle cx="32" cy="27" r="8" className="bg" />
      <path d="M20 17H44" />
      <path d="M25 17V5H39V17" className="bg" />
    </>
  ),
  29: (
    <>
      <path d="M12 58C14 46 22 40 32 40C42 40 50 46 52 58" />
      <path d="M25 44C28 49 36 49 39 44" />
      <circle cx="32" cy="12" r="5" />
      <circle cx="32" cy="26" r="8.5" className="bg" />
      <path d="M23.5 25C24 19 28 17.5 32 17.5C36 17.5 40 19 40.5 25" />
    </>
  ),
  30: (
    <>
      <path d="M32 6C25 16 25 28 32 36C39 28 39 16 32 6Z" />
      <path d="M29 36C18 38 10 30 14 20C16 26 22 30 29 31M35 36C46 38 54 30 50 20C48 26 42 30 35 31" />
      <path d="M22 36H42V41H22Z" className="bg" />
      <path d="M32 41V57M28 41C26 48 22 50 18 48M36 41C38 48 42 50 46 48" />
    </>
  ),
  31: (
    <>
      <circle cx="32" cy="32" r="10" />
      <path d={sunRays} />
    </>
  ),
  32: (
    <>
      <path d="M36 9A22 22 0 1 0 55 43A20 20 0 0 1 36 9Z" />
      <path d={star4(50, 18, 5, 1.4)} />
    </>
  ),
  33: (
    <>
      <circle cx="16" cy="32" r="9" />
      <circle cx="16" cy="32" r="3" />
      <path d="M25 32H57M49 32V41M55 32V39M43 32V38" />
    </>
  ),
  34: (
    <>
      <path d="M48 32L58 22V42Z" />
      <path d="M8 32C18 18 38 18 48 32C38 46 18 46 8 32Z" className="bg" />
      {dot(17, 30, 2)}
      <path d="M24 24C27 28 27 36 24 40" />
      <path d="M31 28L34 32L31 36M38 28L41 32L38 36" />
    </>
  ),
  35: (
    <>
      <circle cx="32" cy="9" r="4" />
      <path d="M32 13V56M22 22H42" />
      <path d="M12 40C14 50 22 56 32 56C42 56 50 50 52 40" />
      <path d="M12 40L8 47M12 40L19 44M52 40L56 47M52 40L45 44" />
    </>
  ),
  36: (
    <>
      <path d="M28 6H36V20H48V28H36V52H28V28H16V20H28Z" />
      <path d="M18 58C24 54 40 54 46 58" />
    </>
  ),
};

export function CardGlyph({ id, className }: { id: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`glyph ${className ?? ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {GLYPHS[id]}
    </svg>
  );
}
