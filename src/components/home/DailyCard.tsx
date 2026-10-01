import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { readStored, writeStored } from '../../lib/storage';
import { Card } from '../../tools/lenormand/components/Card';
import { getCard } from '../../tools/lenormand/data/cards';
import { drawCards } from '../../tools/lenormand/lib/shuffle';
import { LOOKUP_PATH } from '../../tools/lenormand/paths';
import '../../tools/lenormand/lenormand.css';

interface DailyState {
  date: string;
  id: number;
  flipped: boolean;
}

const KEY = 'daily-card';

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/** Mỗi người một lá mỗi ngày; lá được giữ nguyên tới hết ngày trên máy này. */
export function DailyCard() {
  const [state, setState] = useState<DailyState>(() => {
    const stored = readStored<DailyState | null>(KEY, null);
    const date = todayKey();
    return stored && stored.date === date ? stored : { date, id: drawCards(1)[0], flipped: false };
  });

  useEffect(() => writeStored(KEY, state), [state]);

  const card = getCard(state.id);

  return (
    <aside className="daily" aria-labelledby="daily-title">
      <Card
        id={state.id}
        faceUp={state.flipped}
        size="xl"
        onClick={state.flipped ? undefined : () => setState((s) => ({ ...s, flipped: true }))}
        label={state.flipped ? card.name : 'Lật lá bài hôm nay'}
        className="daily-card"
      />
      <div className="daily-text" aria-live="polite">
        <p id="daily-title" className="daily-label">
          Lá bài hôm nay
        </p>
        {state.flipped ? (
          <>
            <h2>{card.name}</h2>
            <p>{card.meanings.general}</p>
            <p className="daily-advice">{card.advice}</p>
            <Link to={`${LOOKUP_PATH}/${card.id}`}>Xem đầy đủ ý nghĩa lá {card.name}</Link>
          </>
        ) : (
          <p className="muted">Chạm vào lá bài để lật. Mỗi ngày bạn nhận một lá.</p>
        )}
      </div>
    </aside>
  );
}
