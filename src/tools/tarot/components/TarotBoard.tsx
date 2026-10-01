import type { TarotSpread } from '../data/spreads';
import type { Drawn } from '../lib/interpret';
import { TarotCard } from './TarotCard';
import { getTarotCard } from '../data/cards';

interface Props {
  spread: TarotSpread;
  cards: Drawn[];
  revealed: boolean[];
  onReveal: (index: number) => void;
  onOpen: (id: number) => void;
}

export function TarotBoard({ spread, cards, revealed, onReveal, onOpen }: Props) {
  return (
    <div className="tr-board-scroll">
      <ol
        className="tr-board"
        data-spread={spread.id}
        style={{ gridTemplateColumns: `repeat(${spread.cols}, auto)` }}
        aria-label={`Trải bài ${spread.name}`}
      >
        {spread.positions.map((pos, i) => {
          const d = cards[i];
          const up = revealed[i];
          const name = getTarotCard(d.id).name;
          return (
            <li
              key={i}
              className={`tr-slot${pos.crossing ? ' is-crossing' : ''}`}
              style={{
                gridColumn: `${pos.col} / span ${pos.colSpan ?? 1}`,
                gridRow: `${pos.row} / span ${pos.rowSpan ?? 1}`,
                animationDelay: `${i * 70}ms`,
              }}
            >
              <TarotCard
                id={d.id}
                reversed={d.reversed}
                faceUp={up}
                onClick={() => (up ? onOpen(d.id) : onReveal(i))}
                label={up ? `${i + 1}. ${pos.label}: ${name}${d.reversed ? ' (ngược)' : ''}. Xem ý nghĩa` : `${i + 1}. ${pos.label}: lật lá bài`}
              />
              <span className="tr-slot-label">
                <span className="tr-slot-n">{i + 1}</span> {pos.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function TarotDiagram({ spread }: { spread: TarotSpread }) {
  const w = 7;
  const h = 12;
  const gap = 2;
  const halfRows = spread.id === 'celtic';
  const colUnit = spread.cols === 6 ? w / 2 + gap / 2 : w + gap;
  const rowUnit = halfRows ? h / 2 + gap / 2 : h + gap;
  const width = Math.max(...spread.positions.map((p) => (p.col - 1) * colUnit + w));
  const height = Math.max(...spread.positions.map((p) => (p.row - 1) * rowUnit + h));
  return (
    <svg viewBox={`-1 -1 ${width + 2} ${height + 2}`} className="tr-diagram" aria-hidden="true">
      {spread.positions.map((p, i) => {
        const x = (p.col - 1) * colUnit;
        const y = (p.row - 1) * rowUnit;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={h}
            rx={1}
            transform={p.crossing ? `rotate(90 ${x + w / 2} ${y + h / 2})` : undefined}
          />
        );
      })}
    </svg>
  );
}
