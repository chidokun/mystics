import { ELEMENTS } from '../data/elements';
import { BRANCHES, napAmOf, STEMS } from '../data/ganzhi';
import { TEN_GODS } from '../data/gods';
import type { Pillar } from '../lib/bazi';

/** Bảng tứ trụ: mỗi cột là một trụ, đọc từ trên xuống: thập thần, can, chi, tàng can, nạp âm */
export function PillarTable({ pillars, hasHour }: { pillars: Pillar[]; hasHour: boolean }) {
  return (
    <div className="bt-pillars-scroll">
      <table className="bt-pillars">
        <thead>
          <tr>
            <th scope="col">
              <span className="visually-hidden">Mục</span>
            </th>
            {pillars.map((p) => (
              <th key={p.key} scope="col" className={p.key === 'day' ? 'is-day' : undefined}>
                Trụ {p.label.toLowerCase()}
              </th>
            ))}
            {!hasHour && (
              <th scope="col" className="is-missing">
                Trụ giờ
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Thập thần</th>
            {pillars.map((p) => (
              <td key={p.key} className={p.key === 'day' ? 'is-day' : undefined}>
                {p.stemGod ? TEN_GODS[p.stemGod].name : <strong>Nhật chủ</strong>}
              </td>
            ))}
            {!hasHour && <td className="is-missing" rowSpan={5}>Không rõ giờ sinh</td>}
          </tr>
          <tr className="bt-row-char">
            <th scope="row">Thiên can</th>
            {pillars.map((p) => {
              const s = STEMS[p.stem];
              return (
                <td key={p.key} className={p.key === 'day' ? 'is-day' : undefined}>
                  <span className={`bt-big bt-el--${s.element}`}>{s.name}</span>
                  <span className="bt-sub">
                    {s.yang ? 'Dương' : 'Âm'} {ELEMENTS[s.element].name}
                  </span>
                </td>
              );
            })}
          </tr>
          <tr className="bt-row-char">
            <th scope="row">Địa chi</th>
            {pillars.map((p) => {
              const b = BRANCHES[p.branch];
              return (
                <td key={p.key} className={p.key === 'day' ? 'is-day' : undefined}>
                  <span className={`bt-big bt-el--${b.element}`}>{b.name}</span>
                  <span className="bt-sub">
                    {b.animal}, {ELEMENTS[b.element].name}
                  </span>
                </td>
              );
            })}
          </tr>
          <tr>
            <th scope="row">Tàng can</th>
            {pillars.map((p) => (
              <td key={p.key} className={p.key === 'day' ? 'is-day' : undefined}>
                <ul className="bt-hidden">
                  {p.hidden.map((h, i) => (
                    <li key={h.stem} className={i === 0 ? 'is-main' : undefined}>
                      <span className={`bt-el--${STEMS[h.stem].element}`}>{STEMS[h.stem].name}</span>
                      <span className="bt-hidden-god">{TEN_GODS[h.god].short}</span>
                    </li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
          <tr>
            <th scope="row">Nạp âm</th>
            {pillars.map((p) => {
              const n = napAmOf(p.ganzhi);
              return (
                <td key={p.key} className={p.key === 'day' ? 'is-day' : undefined}>
                  <span className={`bt-el--${n.element}`}>{n.name}</span>
                  <span className="bt-sub">{n.meaning}</span>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
