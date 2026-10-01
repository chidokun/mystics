import type { LineValue } from '../lib/iching';

interface Props {
  /** Sáu hào từ dưới lên; true là dương. Có thể ít hơn sáu khi đang gieo. */
  lines: boolean[];
  /** Giá trị gieo được, để đánh dấu hào động */
  values?: LineValue[];
  /** Hào được làm nổi (0 là hào dưới cùng) */
  focusLine?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  label?: string;
}

const ROW = 16;
const BAR = 9;

/** Vẽ quẻ: hào dương là vạch liền, hào âm là vạch đứt; hào động tô đỏ son. */
export function HexagramFigure({ lines, values, focusLine, size = 'md', label }: Props) {
  const showMarks = Boolean(values);
  const width = showMarks ? 124 : 100;
  return (
    <svg
      viewBox={`0 0 ${width} ${ROW * 6 - (ROW - BAR)}`}
      className={`ic-figure ic-figure--${size}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {Array.from({ length: 6 }, (_, i) => {
        const y = (5 - i) * ROW;
        const yang = lines[i];
        const value = values?.[i];
        const moving = value === 6 || value === 9;
        const cls = `ic-bar${moving ? ' is-moving' : ''}${focusLine === i ? ' is-focus' : ''}`;
        if (yang === undefined) {
          return <rect key={i} x={0} y={y} width={100} height={BAR} rx={1.5} className="ic-bar is-pending" />;
        }
        return (
          <g key={i}>
            {yang ? (
              <rect x={0} y={y} width={100} height={BAR} rx={1.5} className={cls} />
            ) : (
              <>
                <rect x={0} y={y} width={43} height={BAR} rx={1.5} className={cls} />
                <rect x={57} y={y} width={43} height={BAR} rx={1.5} className={cls} />
              </>
            )}
            {showMarks && moving && (
              value === 9 ? (
                <circle cx={114} cy={y + BAR / 2} r={4.5} className="ic-mark" />
              ) : (
                <path d={`M110 ${y}L118 ${y + BAR}M118 ${y}L110 ${y + BAR}`} className="ic-mark" />
              )
            )}
          </g>
        );
      })}
    </svg>
  );
}
