import { getCard } from '../data/cards';
import type { Spread } from '../data/spreads';
import { Card } from './Card';

interface BoardProps {
  spread: Spread;
  cards: number[];
  revealed: boolean[];
  onReveal: (index: number) => void;
  onOpen: (id: number) => void;
  /** Lá đại diện được làm nổi trong Đại Trải Bài */
  highlight?: number;
}

export function SpreadBoard({ spread, cards, revealed, onReveal, onOpen, highlight }: BoardProps) {
  return (
    <div className="ln-board-scroll">
      <ol
        className="ln-board"
        data-spread={spread.id}
        style={{ gridTemplateColumns: `repeat(${spread.cols}, auto)` }}
        aria-label={`Trải bài ${spread.name}`}
      >
        {spread.positions.map((pos, i) => {
          const id = cards[i];
          const up = revealed[i];
          const card = getCard(id);
          return (
            <li
              key={i}
              className={`ln-slot${highlight === id && up ? ' is-highlight' : ''}`}
              style={{ gridColumn: pos.col, gridRow: pos.row, animationDelay: `${Math.min(i, 12) * 60}ms` }}
            >
              <Card
                id={id}
                faceUp={up}
                onClick={() => (up ? onOpen(id) : onReveal(i))}
                label={up ? `${pos.label}: ${card.name}. Xem ý nghĩa` : `${pos.label}: lật lá bài`}
              />
              <span className="ln-slot-label">{pos.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function SpreadDiagram({ spread }: { spread: Spread }) {
  const cell = spread.id === 'grand' ? 6 : 10;
  const gap = spread.id === 'grand' ? 2 : 3;
  const w = spread.cols * cell + (spread.cols - 1) * gap;
  const h = spread.rows * cell * 1.4 + (spread.rows - 1) * gap;
  return (
    <svg viewBox={`-1 -1 ${w + 2} ${h + 2}`} className="ln-diagram" aria-hidden="true">
      {spread.positions.map((p, i) => (
        <rect
          key={i}
          x={(p.col - 1) * (cell + gap)}
          y={(p.row - 1) * (cell * 1.4 + gap)}
          width={cell}
          height={cell * 1.4}
          rx={1}
        />
      ))}
    </svg>
  );
}
