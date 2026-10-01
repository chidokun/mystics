import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Dialog } from '../../../components/Dialog';
import { readStored, writeStored } from '../../../lib/storage';
import { TarotBoard, TarotDiagram } from '../components/TarotBoard';
import { TarotCard } from '../components/TarotCard';
import { TarotDetail } from '../components/TarotDetail';
import { TarotReadingView } from '../components/TarotReadingView';
import { TOPICS, type TarotTopic } from '../data/cards';
import { getTarotSpread, TAROT_SPREADS, type TarotSpreadId } from '../data/spreads';
import { drawTarot, readTarot, tarotToText, type Drawn } from '../lib/interpret';
import '../tarot.css';

type Phase = 'setup' | 'shuffling' | 'dealt';

interface Settings {
  topic: TarotTopic;
  spreadId: TarotSpreadId;
  reversals: boolean;
}

const SETTINGS_KEY = 'tarot.settings';
const DEFAULT_SETTINGS: Settings = { topic: 'general', spreadId: 'ppf', reversals: true };

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function ReadingPage() {
  const [question, setQuestion] = useState('');
  const [settings, setSettings] = useState<Settings>(() => ({
    ...DEFAULT_SETTINGS,
    ...readStored<Partial<Settings>>(SETTINGS_KEY, {}),
  }));
  const [phase, setPhase] = useState<Phase>('setup');
  const [cards, setCards] = useState<Drawn[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [open, setOpen] = useState<Drawn | null>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const timer = useRef<number | undefined>(undefined);
  const tableRef = useRef<HTMLDivElement>(null);

  const spread = getTarotSpread(settings.spreadId);
  const count = spread.positions.length;
  const allRevealed = phase === 'dealt' && revealed.length > 0 && revealed.every(Boolean);

  useEffect(() => writeStored(SETTINGS_KEY, settings), [settings]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const reading = useMemo(
    () => (allRevealed ? readTarot({ spread, cards, topic: settings.topic }) : null),
    [allRevealed, spread, cards, settings.topic],
  );

  const update = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));

  const deal = () => {
    setPhase('shuffling');
    setCopyStatus('');
    requestAnimationFrame(() => tableRef.current?.scrollIntoView({ block: 'start' }));
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(
      () => {
        setCards(drawTarot(count, settings.reversals));
        setRevealed(Array(count).fill(false));
        setPhase('dealt');
      },
      prefersReducedMotion() ? 0 : 1100,
    );
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    deal();
  };

  const openCard = (id: number) => setOpen(cards.find((c) => c.id === id) ?? { id, reversed: false });

  const copy = async () => {
    if (!reading) return;
    try {
      await navigator.clipboard.writeText(tarotToText(question, spread, cards, reading));
      setCopyStatus('Đã sao chép kết quả.');
    } catch {
      setCopyStatus('Trình duyệt chặn sao chép. Hãy bôi đen phần diễn giải để sao chép thủ công.');
    }
  };

  if (phase === 'setup') {
    return (
      <form className="tr-setup" onSubmit={onSubmit}>
        <div className="field">
          <label className="field-label" htmlFor="tr-question">
            Câu hỏi của bạn
          </label>
          <textarea
            id="tr-question"
            className="input"
            rows={2}
            maxLength={300}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ví dụ: Điều gì đang cản mình phát triển trong công việc?"
          />
          <p className="tr-hint">Câu hỏi mở kiểu "điều gì", "làm thế nào" thường cho câu trả lời hữu ích hơn câu hỏi có hoặc không.</p>
        </div>

        <fieldset className="tr-fieldset">
          <legend className="field-label">Chủ đề</legend>
          <div className="chips">
            {TOPICS.map((t) => (
              <label key={t.id} className="chip">
                <input
                  type="radio"
                  name="topic"
                  className="visually-hidden"
                  checked={settings.topic === t.id}
                  onChange={() => update({ topic: t.id })}
                />
                {t.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="tr-fieldset">
          <legend className="field-label">Cách trải bài</legend>
          <div className="tr-spread-options">
            {TAROT_SPREADS.map((s) => (
              <label key={s.id} className="tr-spread-option">
                <input
                  type="radio"
                  name="spread"
                  className="visually-hidden"
                  checked={settings.spreadId === s.id}
                  onChange={() => update({ spreadId: s.id })}
                />
                <TarotDiagram spread={s} />
                <span className="tr-spread-name">{s.name}</span>
                <span className="tr-spread-count">{s.positions.length} lá</span>
                <span className="tr-spread-summary">{s.summary}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="tr-toggle">
          <input type="checkbox" checked={settings.reversals} onChange={(e) => update({ reversals: e.target.checked })} />
          <span>
            Dùng lá ngược
            <span className="tr-hint">Lá rút ra có thể nằm ngược, mang nghĩa năng lượng bị chặn hoặc hướng vào trong.</span>
          </span>
        </label>

        <div>
          <button type="submit" className="btn btn-primary tr-deal">
            Xào bài và rút {count} lá
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="tr-table" ref={tableRef}>
      <header className="tr-table-head">
        <div>
          <p className="tr-table-spread">
            {spread.name}, chủ đề {TOPICS.find((t) => t.id === settings.topic)!.label.toLowerCase()}
          </p>
          <p className="tr-table-question">{question.trim() || 'Bạn không đặt câu hỏi cụ thể — hãy đọc bài như một thông điệp chung.'}</p>
        </div>
        <div className="tr-table-actions">
          <button type="button" className="btn btn-ghost" onClick={() => setPhase('setup')}>
            Đổi câu hỏi
          </button>
          <button type="button" className="btn btn-ghost" onClick={deal} disabled={phase === 'shuffling'}>
            Rút lại
          </button>
        </div>
      </header>

      {phase === 'shuffling' ? (
        <div className="tr-shuffle" role="status">
          <div className="tr-deck" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <TarotCard key={i} faceUp={false} className={`tr-deck-card tr-deck-card-${i}`} />
            ))}
          </div>
          <p className="muted">Đang xào bài…</p>
        </div>
      ) : (
        <section className="tr-board-wrap" aria-label="Bàn trải bài">
          <TarotBoard
            spread={spread}
            cards={cards}
            revealed={revealed}
            onReveal={(i) => setRevealed((r) => r.map((v, j) => (j === i ? true : v)))}
            onOpen={openCard}
          />
          {!allRevealed && (
            <div className="tr-board-foot">
              <p className="muted">Chạm vào từng lá để lật, hoặc lật tất cả cùng lúc.</p>
              <button type="button" className="btn btn-primary" onClick={() => setRevealed((r) => r.map(() => true))}>
                Lật tất cả
              </button>
            </div>
          )}
        </section>
      )}

      {reading && (
        <section className="tr-reading-wrap" aria-labelledby="tr-reading-title">
          <h2 id="tr-reading-title">Diễn giải</h2>
          <TarotReadingView reading={reading} onOpen={openCard} />
          <div className="tr-actions">
            <button type="button" className="btn btn-ghost" onClick={copy}>
              Sao chép kết quả
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setPhase('setup')}>
              Trải bài mới
            </button>
            <p role="status" className="muted">
              {copyStatus}
            </p>
          </div>
        </section>
      )}

      <Dialog open={open !== null} onClose={() => setOpen(null)}>
        {(headingId) =>
          open && <TarotDetail id={open.id} reversed={open.reversed} topic={settings.topic} headingId={headingId} />
        }
      </Dialog>
    </div>
  );
}
