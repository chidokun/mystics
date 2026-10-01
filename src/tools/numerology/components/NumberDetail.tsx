import { getNumber } from '../data/numbers';
import { Numeral } from './Numeral';

interface Props {
  n: number;
  /** Tên chỉ số đang xem, ví dụ "Số chủ đạo" */
  context?: string;
  headingId?: string;
  /** Hiện thêm phần "khi là số sứ mệnh / linh hồn…" */
  showContexts?: boolean;
}

export function NumberDetail({ n, context, headingId, showContexts }: Props) {
  const m = getNumber(n);
  return (
    <article className="nm-detail">
      <header className="nm-detail-head">
        <Numeral n={n} size="lg" />
        <div>
          {context && <p className="nm-detail-context">{context}</p>}
          <h2 id={headingId}>{m.title}</h2>
          <p className="nm-keywords">{m.keywords.join(', ')}</p>
        </div>
      </header>

      <p className="nm-detail-essence">{m.essence}</p>

      <div className="nm-detail-cols">
        <section>
          <h3>Điểm mạnh</h3>
          <ul>
            {m.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3>Điều cần lưu ý</h3>
          <ul>
            {m.challenges.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      </div>

      <dl className="nm-detail-list">
        <div>
          <dt>Nghề nghiệp phù hợp</dt>
          <dd>{m.careers}</dd>
        </div>
        <div>
          <dt>Tình cảm</dt>
          <dd>{m.love}</dd>
        </div>
        <div>
          <dt>Lời khuyên</dt>
          <dd>{m.advice}</dd>
        </div>
        {showContexts && (
          <>
            <div>
              <dt>Là số sứ mệnh</dt>
              <dd>{m.mission}</dd>
            </div>
            <div>
              <dt>Là số linh hồn</dt>
              <dd>{m.soul}</dd>
            </div>
            <div>
              <dt>Là số nhân cách</dt>
              <dd>{m.persona}</dd>
            </div>
            <div>
              <dt>Là số đỉnh cao</dt>
              <dd>{m.pinnacle}</dd>
            </div>
          </>
        )}
      </dl>
    </article>
  );
}
