import { useElementWidth } from '../../../lib/useElementWidth';
import type { Peak } from '../lib/calc';

type Anchor = 'start' | 'end' | 'middle';

/** Nhãn có nền cùng màu trang để các cạnh chạy phía sau mà chữ vẫn rõ */
function Label({ x, y, anchor, lines, strong }: { x: number; y: number; anchor: Anchor; lines: string[]; strong?: boolean }) {
  const w = Math.max(...lines.map((l, i) => l.length * (i === 0 && strong ? 7.2 : 6.6))) + 10;
  const h = lines.length * 16 + 4;
  const left = anchor === 'start' ? x - 5 : anchor === 'end' ? x - w + 5 : x - w / 2;
  return (
    <g>
      <rect x={left} y={y - 13} width={w} height={h} rx={4} className="nm-pyr-pill" />
      {lines.map((line, i) => (
        <text key={i} x={x} y={y + i * 16} textAnchor={anchor} className={`nm-pyr-label${i === 0 && strong ? ' nm-pyr-label--strong' : ''}`}>
          {line}
        </text>
      ))}
    </g>
  );
}

interface Props {
  base: { day: number; month: number; year: number };
  peaks: Peak[];
  /** Đỉnh đang ở giai đoạn hiện tại, -1 nếu chưa tới đỉnh 1 */
  currentIndex: number;
}

/**
 * Kim tự tháp bốn đỉnh cao: đáy là tháng, ngày, năm sinh (đã rút gọn).
 * Đỉnh 1 nối tháng và ngày, đỉnh 2 nối ngày và năm, đỉnh 3 nối đỉnh 1 và 2, đỉnh 4 nối tháng và năm.
 * Bốn thử thách vẽ đối xứng xuống phía dưới theo cùng quy tắc.
 */
export function PinnaclePyramid({ base, peaks, currentIndex }: Props) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const W = Math.min(width, 640);
  const narrow = W < 440;
  const r = narrow ? 17 : 21;
  const s = narrow ? 58 : 66;
  const top = 34;
  const yBase = top + 3 * s;
  const height = yBase + 3 * s + 40;
  const mx = Math.max(narrow ? 46 : 70, W * 0.13);
  const xM = mx;
  const xD = W / 2;
  const xY = W - mx;

  const P = [
    { x: (xM + xD) / 2, y: yBase - s },
    { x: (xD + xY) / 2, y: yBase - s },
    { x: xD, y: yBase - 2 * s },
    { x: xD, y: yBase - 3 * s },
  ];
  const C = [
    { x: (xM + xD) / 2, y: yBase + s },
    { x: (xD + xY) / 2, y: yBase + s },
    { x: xD, y: yBase + 2 * s },
    { x: xD, y: yBase + 3 * s },
  ];
  const B = { m: { x: xM, y: yBase }, d: { x: xD, y: yBase }, y: { x: xY, y: yBase } };

  /** Đoạn nối hai nút, cắt bớt ở hai đầu để không đè lên vòng tròn */
  const edge = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x1: a.x + (dx / len) * r, y1: a.y + (dy / len) * r, x2: b.x - (dx / len) * r, y2: b.y - (dy / len) * r };
  };

  const peakEdges: [{ x: number; y: number }, { x: number; y: number }][] = [
    [B.m, P[0]],
    [B.d, P[0]],
    [B.d, P[1]],
    [B.y, P[1]],
    [P[0], P[2]],
    [P[1], P[2]],
    [B.m, P[3]],
    [B.y, P[3]],
  ];
  const challengeEdges: typeof peakEdges = [
    [B.m, C[0]],
    [B.d, C[0]],
    [B.d, C[1]],
    [B.y, C[1]],
    [C[0], C[2]],
    [C[1], C[2]],
    [B.m, C[3]],
    [B.y, C[3]],
  ];

  // Nhãn: đỉnh và thử thách bên trái thì canh phải, còn lại canh trái
  const side = (i: number) => (i === 0 ? 'left' : 'right');
  const labelX = (x: number, where: 'left' | 'right') => (where === 'left' ? x - r - 8 : x + r + 8);

  const summary = peaks
    .map((p, i) => `Đỉnh ${i + 1} số ${p.pinnacle} ở tuổi ${p.age}, thử thách ${p.challenge}`)
    .join('; ');

  return (
    <div ref={ref} className="nm-pyramid">
      {W > 0 && (
        <svg
          width={W}
          height={height}
          role="img"
          aria-label={`Kim tự tháp bốn đỉnh cao. Tháng ${base.month}, ngày ${base.day}, năm ${base.year}. ${summary}.`}
        >
          {challengeEdges.map(([a, b], i) => (
            <line key={`c${i}`} {...edge(a, b)} className="nm-pyr-edge nm-pyr-edge--challenge" />
          ))}
          {peakEdges.map(([a, b], i) => (
            <line key={`p${i}`} {...edge(a, b)} className="nm-pyr-edge nm-pyr-edge--peak" />
          ))}

          {(
            [
              [B.m, base.month, 'Tháng', narrow ? 'below' : 'left'],
              [B.d, base.day, 'Ngày', 'below'],
              [B.y, base.year, 'Năm', narrow ? 'below' : 'right'],
            ] as const
          ).map(([pt, value, text, where]) => (
            <g key={text}>
              <circle cx={pt.x} cy={pt.y} r={r} className="nm-pyr-node nm-pyr-node--base" />
              <text x={pt.x} y={pt.y + 6} textAnchor="middle" className="nm-pyr-num">
                {value}
              </text>
              <Label
                x={where === 'below' ? pt.x : labelX(pt.x, where)}
                y={where === 'below' ? pt.y + r + 18 : pt.y + 5}
                anchor={where === 'left' ? 'end' : where === 'right' ? 'start' : 'middle'}
                lines={[text]}
              />
            </g>
          ))}

          {peaks.map((p, i) => {
            const pt = P[i];
            const where = side(i);
            const isNow = i === currentIndex;
            return (
              <g key={`peak${i}`}>
                <circle cx={pt.x} cy={pt.y} r={r} className={`nm-pyr-node nm-pyr-node--peak${isNow ? ' is-now' : ''}`} />
                <text x={pt.x} y={pt.y + 6} textAnchor="middle" className={`nm-pyr-num${isNow ? ' is-now' : ''}`}>
                  {p.pinnacle}
                </text>
                <Label
                  x={labelX(pt.x, where)}
                  y={pt.y - 3}
                  anchor={where === 'left' ? 'end' : 'start'}
                  strong
                  lines={
                    narrow
                      ? [`Đỉnh ${i + 1}`, `${p.age} tuổi`]
                      : [`Đỉnh ${i + 1}: ${p.age} tuổi`, isNow ? `đang ở đây, từ ${p.year}` : `năm ${p.year}`]
                  }
                />
              </g>
            );
          })}

          {peaks.map((p, i) => {
            const pt = C[i];
            const where = side(i);
            return (
              <g key={`ch${i}`}>
                <circle cx={pt.x} cy={pt.y} r={r} className="nm-pyr-node nm-pyr-node--challenge" />
                <text x={pt.x} y={pt.y + 6} textAnchor="middle" className="nm-pyr-num">
                  {p.challenge}
                </text>
                <Label x={labelX(pt.x, where)} y={pt.y + 5} anchor={where === 'left' ? 'end' : 'start'} lines={[`Thử thách ${i + 1}`]} />
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
