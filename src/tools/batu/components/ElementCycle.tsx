import { ELEMENT_ORDER, ELEMENTS } from '../data/elements';

/** Vòng ngũ hành: mũi tên ngoài là tương sinh, ngôi sao trong là tương khắc */
export function ElementCycle() {
  const R = 100;
  const cx = 140;
  const cy = 130;
  const pts = ELEMENT_ORDER.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
  });
  const shorten = (a: { x: number; y: number }, b: { x: number; y: number }, by: number) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    return { x1: a.x + (dx / len) * by, y1: a.y + (dy / len) * by, x2: b.x - (dx / len) * by, y2: b.y - (dy / len) * by };
  };
  return (
    <figure className="bt-cycle">
      <svg viewBox="0 0 280 260" role="img" aria-label="Vòng tương sinh và tương khắc của ngũ hành">
        <defs>
          <marker id="bt-sinh" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0L10 5L0 10Z" className="bt-cycle-head-sinh" />
          </marker>
          <marker id="bt-khac" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0L10 5L0 10Z" className="bt-cycle-head-khac" />
          </marker>
        </defs>
        {pts.map((p, i) => {
          const q = pts[(i + 1) % 5];
          return <line key={`s${i}`} {...shorten(p, q, 30)} className="bt-cycle-sinh" markerEnd="url(#bt-sinh)" />;
        })}
        {pts.map((p, i) => {
          const q = pts[(i + 2) % 5];
          return <line key={`k${i}`} {...shorten(p, q, 30)} className="bt-cycle-khac" markerEnd="url(#bt-khac)" />;
        })}
        {pts.map((p, i) => {
          const e = ELEMENT_ORDER[i];
          return (
            <g key={e}>
              <circle cx={p.x} cy={p.y} r={24} className={`bt-cycle-node bt-cycle-node--${e}`} />
              <text x={p.x} y={p.y + 5} textAnchor="middle" className="bt-cycle-label">
                {ELEMENTS[e].name}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption>
        <span className="bt-legend bt-legend--sinh">Tương sinh</span> Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim, Kim sinh Thủy, Thủy sinh Mộc.
        <br />
        <span className="bt-legend bt-legend--khac">Tương khắc</span> Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim, Kim khắc Mộc.
      </figcaption>
    </figure>
  );
}
