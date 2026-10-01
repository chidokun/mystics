interface Props {
  /** true là mặt dương (3 điểm), false là mặt âm (2 điểm), undefined là chưa gieo */
  yang?: boolean;
  /** Đổi key để chạy lại hiệu ứng tung */
  spinKey?: number;
}

/** Đồng xu lỗ vuông. Mặt dương có bốn dấu chấm quanh lỗ, mặt âm để trơn. */
export function Coin({ yang, spinKey }: Props) {
  const label = yang === undefined ? 'Chưa gieo' : yang ? 'Mặt dương, 3 điểm' : 'Mặt âm, 2 điểm';
  return (
    <span key={spinKey} className={`ic-coin${yang === undefined ? ' is-blank' : yang ? ' is-yang' : ' is-yin'}`} role="img" aria-label={label}>
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="22" className="ic-coin-body" />
        <circle cx="24" cy="24" r="17.5" className="ic-coin-rim" />
        <rect x="18" y="18" width="12" height="12" rx="1" className="ic-coin-hole" />
        {yang && [
          [24, 11],
          [37, 24],
          [24, 37],
          [11, 24],
        ].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" className="ic-coin-dot" />)}
      </svg>
    </span>
  );
}
