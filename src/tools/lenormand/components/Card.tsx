import type { CSSProperties } from 'react';
import { getCard, SUITS } from '../data/cards';
import { CardGlyph } from './CardGlyph';

export type CardSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs';

interface CardProps {
  id?: number;
  faceUp?: boolean;
  size?: CardSize;
  onClick?: () => void;
  /** Nhãn cho trình đọc màn hình khi lá là nút bấm */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export function CardBack() {
  return (
    <svg viewBox="0 0 100 150" className="ln-back-art" aria-hidden="true">
      <rect x="6" y="6" width="88" height="138" rx="3" fill="none" stroke="currentColor" strokeWidth="0.9" />
      <rect x="10" y="10" width="80" height="130" rx="2" fill="none" stroke="currentColor" strokeWidth="0.4" />
      <path d="M50 10V45M50 105V140M10 75H30M70 75H90" stroke="currentColor" strokeWidth="0.4" />
      <path d="M50 45L72 75L50 105L28 75Z" fill="none" stroke="currentColor" strokeWidth="0.9" />
      <path d="M50 56L63 75L50 94L37 75Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="50" cy="75" r="4.5" className="ln-back-spark" />
      {[
        [20, 22],
        [80, 22],
        [20, 128],
        [80, 128],
      ].map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x} ${y - 5}L${x + 3} ${y}L${x} ${y + 5}L${x - 3} ${y}Z`} className="ln-back-spark" />
      ))}
    </svg>
  );
}

export function CardFace({ id }: { id: number }) {
  const card = getCard(id);
  const suit = SUITS[card.suit];
  return (
    <>
      <span className="ln-face-num">{card.id}</span>
      <span className={`ln-face-inset${suit.red ? ' is-red' : ''}`} aria-label={`${card.rank} ${suit.name}`}>
        {card.rank}
        {suit.symbol}
      </span>
      <CardGlyph id={card.id} className="ln-face-glyph" />
      <span className="ln-face-name">{card.name}</span>
    </>
  );
}

export function Card({ id, faceUp = true, size = 'md', onClick, label, className, style }: CardProps) {
  const showFace = faceUp && id !== undefined;
  const inner = (
    <span className="ln-card-inner" data-face-up={showFace}>
      <span className="ln-card-back">
        <CardBack />
      </span>
      <span className="ln-card-face">{id !== undefined && <CardFace id={id} />}</span>
    </span>
  );
  const classes = `ln-card ln-card--${size}${onClick ? ' is-interactive' : ''}${className ? ` ${className}` : ''}`;

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick} aria-label={label} style={style}>
        {inner}
      </button>
    );
  }
  return (
    <span className={classes} role="img" aria-label={label ?? (showFace ? getCard(id!).name : 'Lá bài úp')} style={style}>
      {inner}
    </span>
  );
}

/** Nhãn nhỏ gọn để nhắc tới một lá bài trong phần diễn giải */
export function CardChip({ id, onClick }: { id: number; onClick?: (id: number) => void }) {
  const card = getCard(id);
  const content = (
    <>
      <CardGlyph id={id} className="ln-chip-glyph" />
      <span className="ln-chip-num">{id}</span>
      <span>{card.name}</span>
    </>
  );
  if (!onClick) return <span className="ln-chip">{content}</span>;
  return (
    <button type="button" className="ln-chip is-interactive" onClick={() => onClick(id)} aria-label={`Xem lá ${card.name}`}>
      {content}
    </button>
  );
}
