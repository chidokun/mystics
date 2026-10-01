import { cardNumeral, getTarotCard, SUITS } from '../data/cards';
import { TarotGlyph } from './TarotGlyph';

interface Props {
  id?: number;
  reversed?: boolean;
  faceUp?: boolean;
  onClick?: () => void;
  label?: string;
  className?: string;
}

export function TarotBack() {
  return (
    <svg viewBox="0 0 70 120" className="tr-back-art" aria-hidden="true">
      <rect x="4.5" y="4.5" width="61" height="111" rx="3" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <rect x="7.5" y="7.5" width="55" height="105" rx="2" fill="none" stroke="currentColor" strokeWidth="0.35" />
      <circle cx="35" cy="60" r="17" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="35" cy="60" r="12" fill="none" stroke="currentColor" strokeWidth="0.35" />
      <path
        d="M35 46L37.5 57.5L49 60L37.5 62.5L35 74L32.5 62.5L21 60L32.5 57.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      <circle cx="35" cy="60" r="2.6" className="tr-back-spark" />
      <circle cx="35" cy="24" r="5" fill="none" stroke="currentColor" strokeWidth="0.7" />
      <path d="M37 91A6 6 0 1 0 37 101A4.6 4.6 0 1 1 37 91Z" fill="none" stroke="currentColor" strokeWidth="0.7" />
      <path d="M35 29V43M35 77V90" stroke="currentColor" strokeWidth="0.35" />
    </svg>
  );
}

export function TarotFace({ id, reversed }: { id: number; reversed?: boolean }) {
  const card = getTarotCard(id);
  return (
    <span className={`tr-face-inner${reversed ? ' is-reversed' : ''}`}>
      <span className="tr-face-top">
        <span className="tr-face-numeral">{cardNumeral(card)}</span>
        {card.suit && <span className="tr-face-suit">{SUITS[card.suit].name}</span>}
      </span>
      <TarotGlyph id={id} className="tr-face-glyph" />
      <span className="tr-face-name">{card.name}</span>
    </span>
  );
}

export function TarotCard({ id, reversed, faceUp = true, onClick, label, className }: Props) {
  const showFace = faceUp && id !== undefined;
  const inner = (
    <span className="tr-card-inner" data-face-up={showFace}>
      <span className="tr-card-back">
        <TarotBack />
      </span>
      <span className="tr-card-face">{id !== undefined && <TarotFace id={id} reversed={reversed} />}</span>
    </span>
  );
  const classes = `tr-card${onClick ? ' is-interactive' : ''}${className ? ` ${className}` : ''}`;
  const name = id !== undefined ? `${getTarotCard(id).name}${reversed ? ', lá ngược' : ''}` : 'Lá bài úp';
  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick} aria-label={label ?? name}>
        {inner}
      </button>
    );
  }
  return (
    <span className={classes} role="img" aria-label={label ?? (showFace ? name : 'Lá bài úp')}>
      {inner}
    </span>
  );
}

/** Nhãn nhỏ nhắc tới một lá trong phần diễn giải */
export function TarotChip({ id, reversed, onClick }: { id: number; reversed?: boolean; onClick?: (id: number) => void }) {
  const card = getTarotCard(id);
  const content = (
    <>
      <TarotGlyph id={id} className={`tr-chip-glyph${reversed ? ' is-reversed' : ''}`} />
      <span>{card.name}</span>
      {reversed && <span className="tr-chip-rev">ngược</span>}
    </>
  );
  if (!onClick) return <span className="tr-chip">{content}</span>;
  return (
    <button type="button" className="tr-chip is-interactive" onClick={() => onClick(id)} aria-label={`Xem lá ${card.name}`}>
      {content}
    </button>
  );
}
