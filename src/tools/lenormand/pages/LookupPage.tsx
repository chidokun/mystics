import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { normalizeSearch } from '../../../lib/text';
import { Card } from '../components/Card';
import { CardDetail } from '../components/CardDetail';
import { CARDS, getCard, SUITS, type Suit } from '../data/cards';
import { LOOKUP_PATH } from '../paths';
import '../lenormand.css';

type ToneFilter = 'all' | 'good' | 'neutral' | 'hard';

const TONE_FILTERS: { id: ToneFilter; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'good', label: 'Thuận' },
  { id: 'neutral', label: 'Trung tính' },
  { id: 'hard', label: 'Nghịch' },
];

export default function LookupPage() {
  const { '*': rest } = useParams();
  const id = Number(rest);
  if (rest && Number.isInteger(id) && id >= 1 && id <= 36) return <DetailView id={id} />;
  return <GridView />;
}

function GridView() {
  const [query, setQuery] = useState('');
  const [suit, setSuit] = useState<Suit | 'all'>('all');
  const [tone, setTone] = useState<ToneFilter>('all');

  const results = useMemo(() => {
    const q = normalizeSearch(query);
    return CARDS.filter((c) => {
      if (suit !== 'all' && c.suit !== suit) return false;
      if (tone === 'good' && c.tone <= 0) return false;
      if (tone === 'neutral' && c.tone !== 0) return false;
      if (tone === 'hard' && c.tone >= 0) return false;
      if (!q) return true;
      if (String(c.id) === q) return true;
      return normalizeSearch([c.name, c.en, ...c.keywords].join(' ')).includes(q);
    });
  }, [query, suit, tone]);

  return (
    <div className="ln-lookup">
      <div className="ln-filters">
        <div className="field ln-search">
          <label className="field-label" htmlFor="ln-search">
            Tìm lá bài
          </label>
          <input
            id="ln-search"
            className="input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tên, số thứ tự hoặc từ khóa: tình yêu, tiền, 24…"
          />
        </div>
        <fieldset className="ln-fieldset">
          <legend className="field-label">Chất bài</legend>
          <div className="chips">
            <button type="button" className="chip" aria-pressed={suit === 'all'} onClick={() => setSuit('all')}>
              Tất cả
            </button>
            {(Object.keys(SUITS) as Suit[]).map((s) => (
              <button key={s} type="button" className="chip" aria-pressed={suit === s} onClick={() => setSuit(s)}>
                {SUITS[s].symbol} {SUITS[s].name}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="ln-fieldset">
          <legend className="field-label">Tính chất</legend>
          <div className="chips">
            {TONE_FILTERS.map((t) => (
              <button key={t.id} type="button" className="chip" aria-pressed={tone === t.id} onClick={() => setTone(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <p className="muted ln-result-count" role="status">
        {results.length === 36 ? 'Đủ 36 lá' : `${results.length} lá phù hợp`}
      </p>

      {results.length === 0 ? (
        <div className="ln-empty">
          <p>Không có lá nào khớp với “{query}”.</p>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setQuery('');
              setSuit('all');
              setTone('all');
            }}
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <ul className="ln-grid">
          {results.map((c) => (
            <li key={c.id}>
              <Link to={`${LOOKUP_PATH}/${c.id}`} className="ln-grid-item">
                <Card id={c.id} size="sm" />
                <span className="ln-grid-keywords">{c.keywords.slice(0, 2).join(', ')}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DetailView({ id }: { id: number }) {
  const navigate = useNavigate();
  const prev = id === 1 ? 36 : id - 1;
  const next = id === 36 ? 1 : id + 1;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  return (
    <div className="ln-lookup-detail">
      <nav className="ln-detail-nav" aria-label="Chuyển lá">
        <Link to={LOOKUP_PATH}>Tất cả 36 lá</Link>
        <span className="ln-detail-step">
          <Link to={`${LOOKUP_PATH}/${prev}`} aria-label={`Lá trước: ${getCard(prev).name}`}>
            ‹ {getCard(prev).name}
          </Link>
          <Link to={`${LOOKUP_PATH}/${next}`} aria-label={`Lá sau: ${getCard(next).name}`}>
            {getCard(next).name} ›
          </Link>
        </span>
      </nav>
      <CardDetail id={id} onSelectCard={(other) => navigate(`${LOOKUP_PATH}/${other}`)} />
    </div>
  );
}
