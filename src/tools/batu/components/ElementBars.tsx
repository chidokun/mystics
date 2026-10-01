import { ELEMENT_ORDER, ELEMENTS, type Element } from '../data/elements';

interface Props {
  values: Record<Element, number>;
  dayElement: Element;
  favorable: Element[];
  unfavorable: Element[];
}

export function ElementBars({ values, dayElement, favorable, unfavorable }: Props) {
  const max = Math.max(...ELEMENT_ORDER.map((e) => values[e]));
  return (
    <ul className="bt-bars" aria-label="Tỉ trọng ngũ hành">
      {ELEMENT_ORDER.map((e) => {
        const pct = Math.round(values[e] * 100);
        const tag = favorable.includes(e) ? 'Nên bổ sung' : unfavorable.includes(e) ? 'Nên tiết chế' : '';
        return (
          <li key={e} className={`bt-bar bt-bar--${e}`}>
            <span className="bt-bar-name">
              {ELEMENTS[e].name}
              {e === dayElement && <span className="bt-bar-self">hành của bạn</span>}
            </span>
            <span className="bt-bar-track" aria-hidden="true">
              <span className="bt-bar-fill" style={{ width: `${max ? (values[e] / max) * 100 : 0}%` }} />
            </span>
            <span className="bt-bar-value">{pct === 0 ? 'thiếu' : `${pct}%`}</span>
            <span className={`bt-bar-tag${favorable.includes(e) ? ' is-good' : unfavorable.includes(e) ? ' is-bad' : ''}`}>{tag}</span>
          </li>
        );
      })}
    </ul>
  );
}
