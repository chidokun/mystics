import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { normalizeSearch } from '../../../lib/text';
import { HexagramFigure } from '../components/HexagramFigure';
import { getHexagram, HEXAGRAMS, type Hexagram } from '../data/hexagrams';
import { getTrigram, TRIGRAMS } from '../data/trigrams';
import { inverseOf, lineTitle, linesOf, nuclearOf, oppositeOf } from '../lib/iching';
import { hexagramPath, LOOKUP_PATH } from '../paths';
import '../iching.css';

type View = 'list' | 'matrix';

export default function LookupPage() {
  const { '*': rest = '' } = useParams();
  const [section, arg] = rest.split('/');
  const n = Number(arg);

  if (section === 'que' && Number.isInteger(n) && n >= 1 && n <= 64) return <HexagramDetail hx={getHexagram(n)} />;

  return (
    <div className="ic-lookup">
      <nav className="ic-subnav" aria-label="Mục tra cứu">
        <Link to={LOOKUP_PATH} className="chip" aria-current={section !== 'bat-quai' ? 'page' : undefined}>
          64 quẻ
        </Link>
        <Link to={`${LOOKUP_PATH}/bat-quai`} className="chip" aria-current={section === 'bat-quai' ? 'page' : undefined}>
          Bát quái
        </Link>
      </nav>
      {section === 'bat-quai' ? <TrigramView /> : <HexagramList />}
    </div>
  );
}

function HexagramList() {
  const [query, setQuery] = useState('');
  const [view, setView] = useState<View>('list');

  const results = useMemo(() => {
    const q = normalizeSearch(query);
    if (!q) return HEXAGRAMS;
    return HEXAGRAMS.filter((h) => String(h.n) === q || normalizeSearch(`${h.name} ${h.theme}`).includes(q));
  }, [query]);

  return (
    <>
      <div className="ic-filters">
        <div className="field ic-search">
          <label className="field-label" htmlFor="ic-search">
            Tìm quẻ
          </label>
          <input
            id="ic-search"
            className="input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Số thứ tự, tên quẻ hoặc chủ đề: 11, Thái, gia đình…"
          />
        </div>
        <div className="chips" role="group" aria-label="Cách sắp xếp">
          <button type="button" className="chip" aria-pressed={view === 'list'} onClick={() => setView('list')}>
            Theo thứ tự Văn Vương
          </button>
          <button type="button" className="chip" aria-pressed={view === 'matrix'} onClick={() => setView('matrix')}>
            Theo quái trên và dưới
          </button>
        </div>
      </div>

      {view === 'list' ? (
        results.length ? (
          <ul className="ic-grid">
            {results.map((h) => (
              <li key={h.n}>
                <Link to={hexagramPath(h.n)} className="ic-grid-item">
                  <HexagramFigure lines={linesOf(h)} size="sm" />
                  <span className="ic-grid-n">{h.n}</span>
                  <span className="ic-grid-name">{h.name}</span>
                  <span className="ic-grid-theme">{h.theme}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="ic-empty">
            <p>Không có quẻ nào khớp với “{query}”.</p>
            <button type="button" className="btn btn-ghost" onClick={() => setQuery('')}>
              Xóa tìm kiếm
            </button>
          </div>
        )
      ) : (
        <Matrix highlight={new Set(results.map((h) => h.n))} />
      )}
    </>
  );
}

/** Bảng 8×8: hàng là quái trên, cột là quái dưới */
function Matrix({ highlight }: { highlight: Set<number> }) {
  return (
    <div className="ic-matrix-scroll">
      <table className="ic-matrix">
        <thead>
          <tr>
            <th scope="col">
              <span className="visually-hidden">Quái trên \ quái dưới</span>
            </th>
            {TRIGRAMS.map((t) => (
              <th key={t.id} scope="col">
                <span className="ic-matrix-symbol">{t.symbol}</span>
                {t.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TRIGRAMS.map((up) => (
            <tr key={up.id}>
              <th scope="row">
                <span className="ic-matrix-symbol">{up.symbol}</span>
                {up.name}
              </th>
              {TRIGRAMS.map((low) => {
                const h = HEXAGRAMS.find((x) => x.upper === up.id && x.lower === low.id)!;
                return (
                  <td key={low.id} className={highlight.has(h.n) ? undefined : 'is-dim'}>
                    <Link to={hexagramPath(h.n)} aria-label={`Quẻ ${h.n}: ${h.name}`}>
                      <span className="ic-matrix-n">{h.n}</span>
                      <span className="ic-matrix-name">{h.short}</span>
                    </Link>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted ic-matrix-note">Hàng là quái trên, cột là quái dưới.</p>
    </div>
  );
}

function TrigramView() {
  return (
    <div className="ic-trigrams-view">
      <p className="prose muted">
        Mỗi quẻ gồm hai quái chồng lên nhau, mỗi quái có ba hào. Tám quái là tám hình ảnh cơ bản của tự nhiên; hiểu chúng giúp bạn đọc
        được tượng của từng quẻ.
      </p>
      <ul className="ic-trigram-list">
        {TRIGRAMS.map((t) => (
          <li key={t.id} className="frame">
            <div className="ic-trigram-head">
              <svg viewBox="0 0 100 41" className="ic-figure ic-figure--sm" aria-hidden="true">
                {[2, 1, 0].map((i, row) =>
                  t.lines[i] ? (
                    <rect key={i} x={0} y={row * 16} width={100} height={9} rx={1.5} className="ic-bar" />
                  ) : (
                    <g key={i}>
                      <rect x={0} y={row * 16} width={43} height={9} rx={1.5} className="ic-bar" />
                      <rect x={57} y={row * 16} width={43} height={9} rx={1.5} className="ic-bar" />
                    </g>
                  ),
                )}
              </svg>
              <div>
                <h3>
                  {t.name} {t.symbol}
                </h3>
                <p className="muted">
                  {t.nature}, tượng {t.natureVi.toLowerCase()}
                </p>
              </div>
            </div>
            <p>{t.quality}.</p>
            <dl className="ic-trigram-facts">
              <div>
                <dt>Gia đình</dt>
                <dd>{t.family}</dd>
              </div>
              <div>
                <dt>Hướng</dt>
                <dd>{t.direction}</dd>
              </div>
              <div>
                <dt>Ngũ hành</dt>
                <dd>{t.element}</dd>
              </div>
              <div>
                <dt>Cơ thể</dt>
                <dd>{t.body}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RelatedLink({ label, about, hx }: { label: string; about: string; hx: Hexagram }) {
  return (
    <li>
      <Link to={hexagramPath(hx.n)} className="ic-related">
        <HexagramFigure lines={linesOf(hx)} size="xs" />
        <span>
          <span className="ic-related-label">{label}</span>
          <span className="ic-related-name">
            {hx.n}. {hx.name}
          </span>
          <span className="ic-related-about">{about}</span>
        </span>
      </Link>
    </li>
  );
}

function HexagramDetail({ hx }: { hx: Hexagram }) {
  const lines = linesOf(hx);
  const up = getTrigram(hx.upper);
  const low = getTrigram(hx.lower);
  const prev = hx.n === 1 ? 64 : hx.n - 1;
  const next = hx.n === 64 ? 1 : hx.n + 1;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [hx.n]);

  return (
    <article className="ic-detail">
      <nav className="ic-detail-nav" aria-label="Chuyển quẻ">
        <Link to={LOOKUP_PATH}>Tất cả 64 quẻ</Link>
        <span className="ic-detail-step">
          <Link to={hexagramPath(prev)}>‹ {getHexagram(prev).short}</Link>
          <Link to={hexagramPath(next)}>{getHexagram(next).short} ›</Link>
        </span>
      </nav>

      <header className="ic-detail-head">
        <HexagramFigure lines={lines} size="lg" label={`Hình quẻ ${hx.name}`} />
        <div>
          <p className="ic-detail-n">Quẻ số {hx.n}</p>
          <h2>{hx.name}</h2>
          <p className="ic-detail-theme">{hx.theme}</p>
          <dl className="ic-detail-trigrams">
            <div>
              <dt>Quái trên</dt>
              <dd>
                {up.symbol} {up.name}, {up.natureVi.toLowerCase()}: {up.quality.toLowerCase()}
              </dd>
            </div>
            <div>
              <dt>Quái dưới</dt>
              <dd>
                {low.symbol} {low.name}, {low.natureVi.toLowerCase()}: {low.quality.toLowerCase()}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <dl className="ic-texts">
        <div>
          <dt>Lời quẻ</dt>
          <dd>{hx.judgment}</dd>
        </div>
        <div>
          <dt>Lời tượng</dt>
          <dd>{hx.image}</dd>
        </div>
        <div>
          <dt>Ý nghĩa</dt>
          <dd>{hx.meaning}</dd>
        </div>
      </dl>

      <section className="ic-section">
        <h3>Sáu hào</h3>
        <p className="ic-section-intro">Hào được đếm từ dưới lên: hào sơ là khởi đầu, hào thượng là lúc sự việc đã đi đến cùng.</p>
        <ol className="ic-lines">
          {hx.lines.map((text, i) => (
            <li key={i}>
              <span className="ic-line-title">{lineTitle(i, lines[i])}</span>
              <span>{text}</span>
            </li>
          ))}
          {hx.allMoving && (
            <li>
              <span className="ic-line-title">Dụng {hx.n === 1 ? 'cửu' : 'lục'}</span>
              <span>{hx.allMoving}</span>
            </li>
          )}
        </ol>
      </section>

      <section className="ic-section">
        <h3>Quẻ liên quan</h3>
        <ul className="ic-related-list">
          <RelatedLink label="Quẻ hỗ" about="Diễn biến bên trong" hx={nuclearOf(lines)} />
          <RelatedLink label="Quẻ tổng" about="Nhìn từ phía người kia" hx={inverseOf(lines)} />
          <RelatedLink label="Quẻ thác" about="Mặt đối lập" hx={oppositeOf(lines)} />
        </ul>
      </section>
    </article>
  );
}
