import { getTarotCard, ROMAN, SUITS, TOPICS, type TarotTopic } from '../data/cards';
import { TarotCard } from './TarotCard';

interface Props {
  id: number;
  /** Lá đang ở chiều ngược trong trải bài — đưa nghĩa ngược lên trước */
  reversed?: boolean;
  topic?: TarotTopic;
  headingId?: string;
}

const YES_LABEL = { 1: 'Nghiêng về có', 0: 'Trung tính', [-1]: 'Nghiêng về không' } as const;

export function TarotDetail({ id, reversed, topic, headingId }: Props) {
  const c = getTarotCard(id);
  const topics = topic ? [...TOPICS.filter((t) => t.id === topic), ...TOPICS.filter((t) => t.id !== topic)] : TOPICS;
  const blocks = [
    { key: 'up', title: 'Chiều xuôi', keywords: c.keywords, meanings: c.up },
    { key: 'rev', title: 'Chiều ngược', keywords: c.reversedKeywords, meanings: c.rev },
  ];
  if (reversed) blocks.reverse();

  return (
    <article className="tr-detail">
      <div className="tr-detail-head">
        <TarotCard id={id} reversed={reversed} className="tr-card--lg" />
        <div>
          <p className="tr-detail-kind">
            {c.arcana === 'major' ? `Ẩn chính, lá số ${ROMAN[c.rank]}` : `Ẩn phụ, chất ${SUITS[c.suit!].name} (nguyên tố ${SUITS[c.suit!].element})`}
          </p>
          <h2 id={headingId}>{c.name}</h2>
          <p className="tr-detail-en" lang="en">
            {c.en}
          </p>
          <dl className="tr-facts">
            <div>
              <dt>Khi hỏi có hay không</dt>
              <dd data-yes={c.yes}>{YES_LABEL[c.yes]}</dd>
            </div>
            <div>
              <dt>Lời khuyên</dt>
              <dd>{c.advice}</dd>
            </div>
          </dl>
        </div>
      </div>

      {blocks.map((b) => (
        <section
          key={b.key}
          className={`tr-detail-block${reversed !== undefined && (b.key === 'rev') === reversed ? ' is-current' : ''}`}
        >
          <h3>
            {b.title}
            {reversed !== undefined && (b.key === 'rev') === reversed && <span className="tr-badge">chiều lá của bạn</span>}
          </h3>
          <ul className="tr-keywords" aria-label="Từ khóa">
            {b.keywords.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
          <dl className="tr-meanings">
            {topics.map((t) => (
              <div key={t.id}>
                <dt>{t.label}</dt>
                <dd>{b.meanings[t.id]}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </article>
  );
}
