import { getTarotCard } from '../data/cards';
import type { TarotReading } from '../lib/interpret';
import { TarotChip } from './TarotCard';

export function TarotReadingView({ reading, onOpen }: { reading: TarotReading; onOpen: (id: number) => void }) {
  const adviceCard = getTarotCard(reading.advice.card.id);
  return (
    <div className="tr-reading">
      {reading.verdict && (
        <div className="tr-verdict" data-tone={reading.verdict.tone}>
          <p className="tr-verdict-label">{reading.verdict.label}</p>
          <p>{reading.verdict.detail}</p>
        </div>
      )}

      <section className="tr-overview">
        <h3>Tổng quan</h3>
        {reading.overview.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </section>

      {reading.sections.map((s) => (
        <section key={s.title} className="tr-section">
          <h3>{s.title}</h3>
          {s.intro && <p className="tr-section-intro">{s.intro}</p>}
          <ul>
            {s.items.map((it, i) => (
              <li key={i}>
                {(it.label || it.cards.length > 0) && (
                  <div className="tr-item-meta">
                    {it.label && it.label !== s.title && <span className="tr-item-label">{it.label}</span>}
                    <span className="tr-chips">
                      {it.cards.map((d, j) => (
                        <TarotChip key={`${d.id}-${j}`} id={d.id} reversed={d.reversed} onClick={onOpen} />
                      ))}
                    </span>
                  </div>
                )}
                <p>{it.text}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="tr-advice frame">
        <h3>Lời khuyên</h3>
        <p className="tr-advice-text">{reading.advice.text}</p>
        <p className="muted">
          Từ lá {adviceCard.name}
          {reading.advice.card.reversed ? ' (ngược)' : ''}.
        </p>
      </section>
    </div>
  );
}
