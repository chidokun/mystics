import { getCard } from '../data/cards';
import type { Reading } from '../lib/interpret';
import { CardChip } from './Card';

interface Props {
  reading: Reading;
  onOpen: (id: number) => void;
}

export function ReadingView({ reading, onOpen }: Props) {
  return (
    <div className="ln-reading">
      {reading.verdict && (
        <div className="ln-verdict" data-tone={reading.verdict.tone}>
          <p className="ln-verdict-label">{reading.verdict.label}</p>
          <p>{reading.verdict.detail}</p>
        </div>
      )}

      <section className="ln-reading-overview">
        <h3>Tổng quan</h3>
        {reading.overview.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </section>

      {reading.sections.map((section) => (
        <section key={section.title} className="ln-reading-section">
          <h3>{section.title}</h3>
          {section.intro && <p className="ln-reading-intro">{section.intro}</p>}
          <ul>
            {section.items.map((item, i) => (
              <li key={i}>
                <div className="ln-reading-meta">
                  {item.label && item.label !== section.title && <span className="ln-reading-label">{item.label}</span>}
                  <span className="ln-pair-chips">
                    {item.cards.map((id, j) => (
                      <CardChip key={`${id}-${j}`} id={id} onClick={onOpen} />
                    ))}
                  </span>
                </div>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="ln-advice frame">
        <h3>Lời khuyên</h3>
        <p className="ln-advice-text">{reading.advice.text}</p>
        <p className="muted">
          Từ lá {getCard(reading.advice.card).name}
          {reading.timing && (
            <>
              . Thời điểm, theo lá {getCard(reading.timing.card).name}: {reading.timing.text.toLowerCase()}.
            </>
          )}
        </p>
      </section>
    </div>
  );
}
