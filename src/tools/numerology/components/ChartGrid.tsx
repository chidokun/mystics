import { useId } from 'react';
import { findArrows, gridPosition, type ArrowLine, type DigitCounts } from '../lib/calc';

interface Props {
  counts: DigitCounts;
  /** Mũi tên đang được chọn để làm nổi */
  activeArrow?: ArrowLine | null;
  /** Các số được tô nhấn (ví dụ: số tên bù vào chỗ trống của ngày sinh) */
  marked?: number[];
  label: string;
  /** Tắt để chỉ hiện vị trí các số, không vẽ mũi tên */
  showArrows?: boolean;
}

const ROWS = [
  [3, 6, 9],
  [2, 5, 8],
  [1, 4, 7],
];

/** Tên các tầng (hàng) và trục (cột) theo hệ thống Pythagoras */
const ROW_LABELS = ['Trí não', 'Tinh thần', 'Thể chất'];
const COL_LABELS = ['Tư duy', 'Ý chí', 'Hành động'];

const center = (digit: number) => {
  const { col, row } = gridPosition(digit);
  return { x: 50 + col * 100, y: 50 + row * 100 };
};

function arrowPath(line: ArrowLine) {
  const digits = line.split('').map(Number);
  const a = center(digits[0]);
  const b = center(digits[2]);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const ext = 38;
  const ux = dx / len;
  const uy = dy / len;
  return { x1: a.x - ux * ext, y1: a.y - uy * ext, x2: b.x + ux * ext, y2: b.y + uy * ext };
}

export function ChartGrid({ counts, activeArrow, marked = [], label, showArrows = true }: Props) {
  const uid = useId().replace(/:/g, '');
  const { full, empty } = findArrows(counts);
  const lines = !showArrows ? [] : [...full.map((l) => ({ l, kind: 'full' as const })), ...empty.map((l) => ({ l, kind: 'empty' as const }))];

  return (
    <figure className="nm-chart" aria-label={label}>
      <ul className="nm-axis nm-axis--rows" aria-hidden="true">
        {ROW_LABELS.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
      <div className="nm-chart-board">
        <div className="nm-grid" role="table" aria-label={label}>
          {ROWS.map((row, r) => (
            <div key={r} role="row" className="nm-grid-row">
              {row.map((d) => {
                const n = counts[d];
                return (
                  <div
                    key={d}
                    role="cell"
                    className={`nm-cell${n === 0 ? ' is-empty' : ''}${marked.includes(d) ? ' is-marked' : ''}`}
                    aria-label={n === 0 ? `Không có số ${d}` : `Số ${d} xuất hiện ${n} lần`}
                  >
                    <span className="nm-cell-digits" data-len={Math.min(n, 5)}>
                      {n === 0 ? d : String(d).repeat(n)}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <svg viewBox="0 0 300 300" className="nm-arrows" aria-hidden="true">
          <defs>
            <marker id={`${uid}-full`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M0 0L10 5L0 10Z" className="nm-head-full" />
            </marker>
            <marker id={`${uid}-empty`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M0 0L10 5L0 10Z" className="nm-head-empty" />
            </marker>
          </defs>
          {lines.map(({ l, kind }) => {
            const p = arrowPath(l);
            return (
              <line
                key={l}
                {...p}
                className={`nm-arrow nm-arrow--${kind}${activeArrow === l ? ' is-active' : ''}${activeArrow && activeArrow !== l ? ' is-dim' : ''}`}
                markerEnd={`url(#${uid}-${kind})`}
              />
            );
          })}
        </svg>
      </div>
      <ul className="nm-axis nm-axis--cols" aria-hidden="true">
        {COL_LABELS.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </figure>
  );
}
