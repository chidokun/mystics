import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { normalizeSearch } from '../../../lib/text';
import { TarotCard } from '../components/TarotCard';
import { TarotDetail } from '../components/TarotDetail';
import { CARDS, getTarotCard, SUITS, type TarotSuit } from '../data/cards';
import { LOOKUP_PATH } from '../paths';
import '../tarot.css';

type Group = 'all' | 'major' | TarotSuit;

const GROUPS: { id: Group; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'major', label: 'Ẩn chính' },
  ...(Object.keys(SUITS) as TarotSuit[]).map((s) => ({ id: s as Group, label: `${SUITS[s].name} (${SUITS[s].element})` })),
];

export default function LookupPage() {
  const { '*': rest } = useParams();
  const id = Number(rest);
  if (rest && Number.isInteger(id) && id >= 0 && id <= 77) return <DetailView id={id} />;
  return <GridView />;
}

function GridView() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<Group>('all');

  const results = useMemo(() => {
    const q = normalizeSearch(query);
    return CARDS.filter((c) => {
      if (group === 'major' && c.arcana !== 'major') return false;
      if (group !== 'all' && group !== 'major' && c.suit !== group) return false;
      if (!q) return true;
      return normalizeSearch([c.name, c.en, ...c.keywords, ...c.reversedKeywords].join(' ')).includes(q);
    });
  }, [query, group]);

  return (
    <div className="tr-lookup">
      <div className="tr-filters">
        <div className="field tr-search">
          <label className="field-label" htmlFor="tr-search">
            Tìm lá bài
          </label>
          <input
            id="tr-search"
            className="input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tên lá hoặc từ khóa: Mặt Trời, tình yêu, Queen…"
          />
        </div>
        <div className="chips" role="group" aria-label="Nhóm lá">
          {GROUPS.map((g) => (
            <button key={g.id} type="button" className="chip" aria-pressed={group === g.id} onClick={() => setGroup(g.id)}>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <p className="muted tr-result-count" role="status">
        {results.length === 78 ? 'Đủ 78 lá' : `${results.length} lá phù hợp`}
      </p>

      {results.length === 0 ? (
        <div className="tr-empty">
          <p>Không có lá nào khớp với “{query}”.</p>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setQuery('');
              setGroup('all');
            }}
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <ul className="tr-grid">
          {results.map((c) => (
            <li key={c.id}>
              <Link to={`${LOOKUP_PATH}/${c.id}`} className="tr-grid-item">
                <TarotCard id={c.id} />
                <span className="tr-grid-keywords">{c.keywords.slice(0, 2).join(', ')}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DetailView({ id }: { id: number }) {
  const prev = id === 0 ? 77 : id - 1;
  const next = id === 77 ? 0 : id + 1;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  return (
    <div className="tr-lookup-detail">
      <nav className="tr-detail-nav" aria-label="Chuyển lá">
        <Link to={LOOKUP_PATH}>Tất cả 78 lá</Link>
        <span className="tr-detail-step">
          <Link to={`${LOOKUP_PATH}/${prev}`}>‹ {getTarotCard(prev).name}</Link>
          <Link to={`${LOOKUP_PATH}/${next}`}>{getTarotCard(next).name} ›</Link>
        </span>
      </nav>
      <TarotDetail id={id} />
    </div>
  );
}
