import { useId, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { useElementWidth } from '../../../lib/useElementWidth';
import { energyLabel } from '../data/cycles';

export interface EnergyPoint {
  key: number;
  /** Nhãn trục ngang, ví dụ "2026" hoặc "T3" */
  tick: string;
  /** Nhãn ngắn khi trục hẹp, ví dụ "’26" */
  short?: string;
  /** Tên đầy đủ dùng trong tooltip và bảng, ví dụ "Năm 2026" */
  name: string;
  /** Số cá nhân 1–9 */
  number: number;
  title: string;
  value: number;
  /** Chuỗi thứ hai: năm thế giới cùng thời điểm */
  world?: { number: number; title: string; value: number };
  /** Mốc chuyển sang điểm kế tiếp: `short` vẽ trên đường cong ("1/10"), `long` dùng trong bảng */
  shift?: { short: string; long: string };
}

interface Props {
  points: EnergyPoint[];
  /** Điểm đang được chọn (có nhãn trực tiếp) */
  selectedKey?: number;
  /** Điểm hiện tại (năm nay, tháng này) */
  currentKey?: number;
  onSelect?: (key: number) => void;
  label: string;
  /** Tiêu đề cột đầu trong bảng, cũng dùng để đặt tên chuỗi: "Năm" → "Năm cá nhân", "Năm thế giới" */
  unit: string;
  height?: number;
}

const BANDS = [
  { value: 8, label: 'Cao' },
  { value: 5, label: 'Vừa' },
  { value: 2, label: 'Thấp' },
];

const bez = (p0: number, p1: number, p2: number, p3: number, t: number) => {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
};
const bezSlope = (p0: number, p1: number, p2: number, p3: number, t: number) => {
  const u = 1 - t;
  return 3 * u * u * (p1 - p0) + 6 * u * t * (p2 - p1) + 3 * t * t * (p3 - p2);
};

/**
 * Đường cong Catmull–Rom qua mọi điểm (cách đều theo trục ngang). Điểm điều khiển đặt ở 1/3 bước
 * nên hoành độ chạy tuyến tính theo t: tung độ và độ dốc tại phân số t của một đoạn tính trực tiếp.
 * Đường được phép vồng lên giữa hai điểm, giống hình đường cong năng lượng gốc.
 */
function smoothCurve(ys: number[], x: (i: number) => number, step: number) {
  const n = ys.length;
  if (n < 2) return { d: n ? `M${x(0)} ${ys[0]}` : '', at: () => ({ y: ys[0] ?? 0, slope: 0 }) };
  const m = ys.map((_, i) => (i === 0 ? ys[1] - ys[0] : i === n - 1 ? ys[n - 1] - ys[n - 2] : (ys[i + 1] - ys[i - 1]) / 2));
  const ctrl = (i: number) => [ys[i], ys[i] + m[i] / 3, ys[i + 1] - m[i + 1] / 3, ys[i + 1]] as const;
  let d = `M${x(0).toFixed(1)} ${ys[0].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const [, c1, c2, p3] = ctrl(i);
    d += `C${(x(i) + step / 3).toFixed(1)} ${c1.toFixed(1)} ${(x(i + 1) - step / 3).toFixed(1)} ${c2.toFixed(1)} ${x(i + 1).toFixed(1)} ${p3.toFixed(1)}`;
  }
  /** Điểm trên đoạn i→i+1 tại phân số t; slope là dy/dx */
  const at = (i: number, t: number) => {
    const c = ctrl(i);
    return { y: bez(...c, t), slope: bezSlope(...c, t) / (step || 1) };
  };
  return { d, at };
}

/** Biểu đồ đường: mức năng lượng theo năm hoặc theo tháng, có thể kèm đường năm thế giới */
export function EnergyChart({ points, selectedKey, currentKey, onSelect, label, unit, height: baseHeight = 240 }: Props) {
  const [wrapRef, width] = useElementWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  const tableId = useId();

  const n = points.length;
  const hasWorld = points.some((p) => p.world);
  const hasShift = points.some((p) => p.shift);
  const endLabels = hasWorld && width >= 560;
  const M = { top: 34, right: endLabels ? 70 : 18, bottom: hasWorld ? 62 : 46, left: hasWorld ? 72 : 50 };
  const height = baseHeight + (hasWorld ? 16 : 0);

  const plotW = Math.max(0, width - M.left - M.right);
  const plotH = height - M.top - M.bottom;
  const step = n > 1 ? plotW / (n - 1) : 0;
  const x = (i: number) => M.left + i * step;
  const y = (v: number) => M.top + plotH - (v / 10) * plotH;
  // Trục hẹp thì dùng nhãn ngắn; chỉ cách quãng khi ngay cả nhãn ngắn cũng không đủ chỗ
  const useShort = step < 38;
  const tickEvery = step >= 24 ? 1 : 2;

  const personal = smoothCurve(points.map((p) => y(p.value)), x, step);
  const world = hasWorld ? smoothCurve(points.map((p) => y(p.world?.value ?? 0)), x, step) : null;
  const area = n ? `${personal.d}L${x(n - 1).toFixed(1)} ${y(0)}L${x(0).toFixed(1)} ${y(0)}Z` : '';

  const indexOfKey = (k?: number) => (k === undefined ? -1 : points.findIndex((p) => p.key === k));
  const selectedIndex = indexOfKey(selectedKey);
  const activeIndex = hover ?? (selectedIndex >= 0 ? selectedIndex : null);
  const active = activeIndex !== null ? points[activeIndex] : null;

  // Nhãn trực tiếp của điểm đang chọn: dùng để tránh chồng nhãn mốc chuyển năng lượng
  const selLabel =
    selectedIndex >= 0
      ? (() => {
          const p = points[selectedIndex];
          const anchor = selectedIndex === 0 ? 'start' : selectedIndex === n - 1 ? 'end' : 'middle';
          const w = p.title.length * 7;
          const lx = x(selectedIndex);
          const left = anchor === 'start' ? lx : anchor === 'end' ? lx - w : lx - w / 2;
          return { anchor, x: lx, y: y(p.value) - 14, left, right: left + w } as const;
        })()
      : null;

  // Mốc chuyển năng lượng nằm giữa hai điểm; nhãn hiện hết khi đủ chỗ, nếu không chỉ quanh điểm đang chọn
  const showAllShiftLabels = step >= 44;
  const shifts = hasShift
    ? points.slice(0, -1).flatMap((p, i) => {
        if (!p.shift) return [];
        const { y: my, slope } = personal.at(i, 0.5);
        const mx = x(i) + step / 2;
        const showLabel = showAllShiftLabels || i === selectedIndex || i === selectedIndex - 1;
        let ly = my - 10;
        if (selLabel && Math.abs(ly - selLabel.y) < 16 && mx + 14 > selLabel.left && mx - 14 < selLabel.right) ly = my + 20;
        return [{ i, mx, my, slope, text: p.shift.short, showLabel, ly: Math.max(12, ly) }];
      })
    : [];

  // Nhãn tên chuỗi ở cuối đường, đẩy xa nhau nếu quá gần
  let endP = n ? y(points[n - 1].value) + 4 : 0;
  let endW = n && hasWorld ? y(points[n - 1].world?.value ?? 0) + 4 : 0;
  if (endLabels && Math.abs(endP - endW) < 15) {
    const mid = (endP + endW) / 2;
    const up = endP <= endW ? -1 : 1;
    endP = mid + up * 7.5;
    endW = mid - up * 7.5;
  }

  /** Điểm gần con trỏ nhất theo trục ngang (đường dò "bắt" vào năm/tháng gần nhất) */
  const nearest = (e: MouseEvent<SVGRectElement>) => {
    const svgLeft = e.currentTarget.ownerSVGElement!.getBoundingClientRect().left;
    const px = e.clientX - svgLeft;
    return Math.max(0, Math.min(n - 1, Math.round((px - M.left) / (step || 1))));
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!onSelect || !n) return;
    const base = selectedIndex >= 0 ? selectedIndex : 0;
    let next = base;
    if (e.key === 'ArrowRight') next = Math.min(n - 1, base + 1);
    else if (e.key === 'ArrowLeft') next = Math.max(0, base - 1);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    else return;
    e.preventDefault();
    setHover(null);
    onSelect(points[next].key);
  };

  // Tooltip đặt cạnh điểm, lật sang trái khi gần mép phải
  const tipLeft = activeIndex !== null ? x(activeIndex) : 0;
  const flip = tipLeft > width - 230;
  const tipTop = active ? Math.min(y(active.value), active.world ? y(active.world.value) : Infinity) : 0;
  const unitLower = unit.toLowerCase();

  return (
    <figure className="nm-energy">
      {(hasWorld || hasShift) && (
        <ul className="nm-energy-legend" aria-hidden="true">
          <li>
            <span className="nm-legend-line" />
            {unit} cá nhân
          </li>
          {hasWorld && (
            <li>
              <span className="nm-legend-line nm-legend-line--world" />
              {unit} thế giới
            </li>
          )}
          {hasShift && (
            <li>
              <svg width="16" height="12" className="nm-legend-shift">
                <line x1="5" y1="2" x2="5" y2="10" />
                <line x1="10" y1="2" x2="10" y2="10" />
              </svg>
              Mốc chuyển năng lượng
            </li>
          )}
        </ul>
      )}

      <div
        ref={wrapRef}
        className="nm-energy-plot"
        style={{ height }}
        tabIndex={0}
        role="group"
        aria-label={`${label}. Dùng phím mũi tên trái, phải để chọn.`}
        aria-describedby={showTable ? tableId : undefined}
        onKeyDown={onKey}
      >
        {width > 0 && (
          <svg width={width} height={height} aria-hidden="true">
            {BANDS.map((b) => (
              <g key={b.label}>
                <line x1={M.left} x2={width - M.right} y1={y(b.value)} y2={y(b.value)} className="nm-energy-grid" />
                <text x={M.left - 10} y={y(b.value) + 4} textAnchor="end" className="nm-energy-axis">
                  {b.label}
                </text>
              </g>
            ))}
            <line x1={M.left} x2={width - M.right} y1={y(0)} y2={y(0)} className="nm-energy-base" />

            <path d={area} className="nm-energy-area" />
            {world && <path d={world.d} className="nm-energy-line nm-energy-line--world" />}
            <path d={personal.d} className="nm-energy-line" />

            {activeIndex !== null && (
              <line x1={x(activeIndex)} x2={x(activeIndex)} y1={M.top - 8} y2={y(0)} className="nm-energy-cross" />
            )}

            {shifts.map((s) => {
              // Hai vạch vuông góc với đường cong, cách nhau vài px dọc theo đường; trục hẹp thì vạch nhỏ lại
              const half = step < 40 ? 4 : 6;
              const gap = step < 40 ? 2 : 2.5;
              const len = Math.hypot(1, s.slope);
              const tx = 1 / len;
              const ty = s.slope / len;
              return (
                <g key={`s${s.i}`} className="nm-energy-shift">
                  {[-gap, gap].map((o) => {
                    const cx = s.mx + tx * o;
                    const cy = s.my + ty * o;
                    return <line key={o} x1={cx + ty * half} y1={cy - tx * half} x2={cx - ty * half} y2={cy + tx * half} />;
                  })}
                  {s.showLabel && (
                    <text x={s.mx} y={s.ly} textAnchor="middle" className="nm-energy-shift-label">
                      {s.text}
                    </text>
                  )}
                </g>
              );
            })}

            {hasWorld &&
              points.map((p, i) =>
                p.world ? (
                  <circle
                    key={`w${p.key}`}
                    cx={x(i)}
                    cy={y(p.world.value)}
                    r={i === activeIndex ? 5 : 3.5}
                    className="nm-energy-dot nm-energy-dot--world"
                  />
                ) : null,
              )}

            {points.map((p, i) => {
              const isCurrent = p.key === currentKey;
              const isSelected = i === selectedIndex;
              const base = height - M.bottom;
              return (
                <g key={p.key}>
                  <circle cx={x(i)} cy={y(p.value)} r={isSelected ? 6.5 : 4.5} className={`nm-energy-dot${isSelected ? ' is-selected' : ''}`} />
                  {isCurrent && <circle cx={x(i)} cy={y(p.value)} r={isSelected ? 11 : 9} className="nm-energy-now" />}
                  <text x={x(i)} y={base + 18} textAnchor="middle" className={`nm-energy-tick${isSelected ? ' is-selected' : ''}`}>
                    {i % tickEvery === 0 || isSelected || isCurrent ? (useShort ? (p.short ?? p.tick) : p.tick) : ''}
                  </text>
                  <text x={x(i)} y={base + 34} textAnchor="middle" className="nm-energy-num">
                    {p.number}
                  </text>
                  {p.world && (
                    <text x={x(i)} y={base + 50} textAnchor="middle" className="nm-energy-num nm-energy-num--world">
                      {p.world.number}
                    </text>
                  )}
                </g>
              );
            })}

            {hasWorld && (
              <>
                <text x={M.left - 10} y={height - M.bottom + 34} textAnchor="end" className="nm-energy-axis">
                  Cá nhân
                </text>
                <text x={M.left - 10} y={height - M.bottom + 50} textAnchor="end" className="nm-energy-axis">
                  Thế giới
                </text>
              </>
            )}

            {endLabels && (
              <>
                <text x={x(n - 1) + 10} y={endP} className="nm-energy-end">
                  Cá nhân
                </text>
                <text x={x(n - 1) + 10} y={endW} className="nm-energy-end">
                  Thế giới
                </text>
              </>
            )}

            {selLabel && (
              <text x={selLabel.x} y={selLabel.y} textAnchor={selLabel.anchor} className="nm-energy-label">
                {points[selectedIndex].title}
              </text>
            )}

            <rect
              x={M.left - step / 2}
              y={0}
              width={plotW + step}
              height={height}
              fill="transparent"
              className="nm-energy-hit"
              onPointerMove={(e) => setHover(nearest(e))}
              onPointerLeave={() => setHover(null)}
              onClick={(e) => onSelect?.(points[nearest(e)].key)}
            />
          </svg>
        )}

        {active && hover !== null && (
          <div
            className={`nm-energy-tip${flip ? ' is-flipped' : ''}`}
            style={{ left: tipLeft, top: Math.max(4, tipTop - (active.world ? 40 : 70)) }}
            role="presentation"
          >
            {active.world ? (
              <>
                <p className="nm-energy-tip-head">{active.name}</p>
                <p className="nm-energy-tip-row">
                  <span className="nm-legend-line" />
                  <span>
                    Cá nhân {active.number}: {active.title}, {active.value}/10
                  </span>
                </p>
                <p className="nm-energy-tip-row">
                  <span className="nm-legend-line nm-legend-line--world" />
                  <span>
                    Thế giới {active.world.number}: {active.world.title}, {active.world.value}/10
                  </span>
                </p>
              </>
            ) : (
              <>
                <p className="nm-energy-tip-value">
                  Số {active.number}: {active.title}
                </p>
                <p className="nm-energy-tip-meta">
                  {active.name}, năng lượng {active.value}/10 ({energyLabel(active.value)})
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <figcaption className="nm-energy-caption">
        <span>
          {hasWorld
            ? `Hai hàng số dưới trục là số ${unitLower} cá nhân và ${unitLower} thế giới`
            : `Hàng số dưới trục là số ${unitLower} cá nhân`}
          ; vòng tròn rỗng đánh dấu {unit === 'Năm' ? 'năm nay' : 'tháng này'}.
          {hasShift ? ` Vạch đôi giữa hai ${unitLower} ghi ngày năng lượng ${unitLower} sau bắt đầu.` : ''}
          {onSelect ? ' Chạm vào một điểm để xem chi tiết.' : ''}
        </span>
        <button type="button" className="nm-link-btn" aria-expanded={showTable} aria-controls={tableId} onClick={() => setShowTable((v) => !v)}>
          {showTable ? 'Ẩn bảng' : 'Xem dạng bảng'}
        </button>
      </figcaption>

      {showTable && (
        <div className="nm-energy-table-wrap">
          <table id={tableId} className="nm-energy-table">
            <caption className="visually-hidden">{label}</caption>
            <thead>
              <tr>
                <th scope="col">{unit}</th>
                <th scope="col">Số</th>
                <th scope="col">Ý nghĩa</th>
                <th scope="col">Năng lượng</th>
                {hasWorld && <th scope="col">Thế giới</th>}
                {hasShift && <th scope="col">Năng lượng {unitLower} sau bắt đầu</th>}
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.key} className={p.key === currentKey ? 'is-current' : undefined}>
                  <th scope="row">{p.name}</th>
                  <td>{p.number}</td>
                  <td>{p.title}</td>
                  <td>
                    {p.value}/10, {energyLabel(p.value)}
                  </td>
                  {hasWorld && <td>{p.world ? `Số ${p.world.number}, ${p.world.value}/10` : ''}</td>}
                  {hasShift && <td>{p.shift?.long ?? ''}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </figure>
  );
}
