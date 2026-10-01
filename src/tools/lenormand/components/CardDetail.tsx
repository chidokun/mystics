import { getCard, SUITS, TOPICS, type Topic } from '../data/cards';
import { combosFor } from '../data/combos';
import { Card, CardChip } from './Card';

interface Props {
  id: number;
  /** Chủ đề đang hỏi — được đưa lên đầu */
  topic?: Topic;
  headingId?: string;
  onSelectCard?: (id: number) => void;
}

const TONE_LABEL: Record<number, string> = {
  2: 'Rất thuận',
  1: 'Thuận',
  0: 'Trung tính',
  [-1]: 'Nghịch',
  [-2]: 'Rất nghịch',
};

export function CardDetail({ id, topic, headingId, onSelectCard }: Props) {
  const card = getCard(id);
  const suit = SUITS[card.suit];
  const topics = topic ? [...TOPICS.filter((t) => t.id === topic), ...TOPICS.filter((t) => t.id !== topic)] : TOPICS;
  const combos = combosFor(id);

  return (
    <article className="ln-detail">
      <div className="ln-detail-head">
        <Card id={id} size="lg" />
        <div className="ln-detail-title">
          <p className="ln-detail-num">Lá số {card.id}</p>
          <h2 id={headingId}>{card.name}</h2>
          <ul className="ln-keywords" aria-label="Từ khóa">
            {card.keywords.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
          <dl className="ln-facts">
            <div>
              <dt>Tên gốc</dt>
              <dd lang="en">{card.en}</dd>
            </div>
            <div>
              <dt>Quân bài</dt>
              <dd>
                {card.rank}
                {suit.symbol} chất {suit.name}
              </dd>
            </div>
            <div>
              <dt>Tính chất</dt>
              <dd data-tone={card.tone}>{TONE_LABEL[card.tone]}</dd>
            </div>
            <div>
              <dt>Thời gian</dt>
              <dd>{card.timing}</dd>
            </div>
          </dl>
        </div>
      </div>

      <dl className="ln-meanings">
        {topics.map((t) => (
          <div key={t.id} className={t.id === topic ? 'is-current' : undefined}>
            <dt>{t.label}</dt>
            <dd>{card.meanings[t.id]}</dd>
          </div>
        ))}
        <div>
          <dt>Khi là một người</dt>
          <dd>{card.person}</dd>
        </div>
        <div>
          <dt>Lời khuyên</dt>
          <dd>{card.advice}</dd>
        </div>
      </dl>

      <section className="ln-detail-pairs">
        <h3>Khi đứng cạnh lá khác</h3>
        <p className="muted">
          Đứng trước: {card.noun}. Đứng sau, bổ nghĩa: {card.mod}.
        </p>
        {combos.length > 0 && (
          <ul>
            {combos.map((c) => (
              <li key={`${c.other}-${c.first}`}>
                <span className="ln-pair-chips">
                  {c.first ? (
                    <>
                      <CardChip id={id} />
                      <CardChip id={c.other} onClick={onSelectCard} />
                    </>
                  ) : (
                    <>
                      <CardChip id={c.other} onClick={onSelectCard} />
                      <CardChip id={id} />
                    </>
                  )}
                </span>
                <span>{c.text}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
