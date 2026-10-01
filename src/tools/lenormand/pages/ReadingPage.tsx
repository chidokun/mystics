import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Dialog } from '../../../components/Dialog';
import { readStored, writeStored } from '../../../lib/storage';
import { Card } from '../components/Card';
import { CardDetail } from '../components/CardDetail';
import { ReadingView } from '../components/ReadingView';
import { SpreadBoard, SpreadDiagram } from '../components/SpreadBoard';
import { TOPICS, type Topic } from '../data/cards';
import { getSpread, SPREADS, type SpreadId } from '../data/spreads';
import { interpret, readingToText } from '../lib/interpret';
import { drawCards } from '../lib/shuffle';
import '../lenormand.css';

type Phase = 'setup' | 'shuffling' | 'dealt';

interface Settings {
  topic: Topic;
  spreadId: SpreadId;
  significator: 28 | 29;
}

const SETTINGS_KEY = 'lenormand.settings';
const DEFAULT_SETTINGS: Settings = { topic: 'general', spreadId: 'three', significator: 29 };

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function ReadingPage() {
  const [question, setQuestion] = useState('');
  const [settings, setSettings] = useState<Settings>(() => ({
    ...DEFAULT_SETTINGS,
    ...readStored<Partial<Settings>>(SETTINGS_KEY, {}),
  }));
  const [phase, setPhase] = useState<Phase>('setup');
  const [cards, setCards] = useState<number[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [openCard, setOpenCard] = useState<number | null>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const readingRef = useRef<HTMLElement>(null);
  const boardRef = useRef<HTMLElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  const spread = getSpread(settings.spreadId);
  const count = spread.positions.length;
  const allRevealed = phase === 'dealt' && revealed.length > 0 && revealed.every(Boolean);

  useEffect(() => writeStored(SETTINGS_KEY, settings), [settings]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const reading = useMemo(
    () =>
      allRevealed
        ? interpret({ spread, cards, topic: settings.topic, significator: settings.significator })
        : null,
    [allRevealed, spread, cards, settings.topic, settings.significator],
  );

  const update = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));

  const deal = () => {
    setPhase('shuffling');
    setCopyStatus('');
    requestAnimationFrame(() => tableRef.current?.scrollIntoView({ block: 'start' }));
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(
      () => {
        setCards(drawCards(count));
        setRevealed(Array(count).fill(false));
        setPhase('dealt');
        boardRef.current?.focus({ preventScroll: true });
      },
      prefersReducedMotion() ? 0 : 1100,
    );
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    deal();
  };

  const revealOne = (i: number) => setRevealed((r) => r.map((v, j) => (j === i ? true : v)));
  const revealAll = () => setRevealed((r) => r.map(() => true));

  const copy = async () => {
    if (!reading) return;
    try {
      await navigator.clipboard.writeText(readingToText(question, spread, cards, reading));
      setCopyStatus('Đã sao chép kết quả.');
    } catch {
      setCopyStatus('Trình duyệt chặn sao chép. Hãy bôi đen phần diễn giải để sao chép thủ công.');
    }
  };

  if (phase === 'setup') {
    return (
      <form className="ln-setup" onSubmit={onSubmit}>
        <div className="field">
          <label className="field-label" htmlFor="ln-question">
            Câu hỏi của bạn
          </label>
          <textarea
            id="ln-question"
            className="input"
            rows={2}
            maxLength={300}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ví dụ: Mình có nên nhận lời mời làm việc mới không?"
          />
          <p className="ln-hint">Không bắt buộc. Câu hỏi càng cụ thể, bạn càng dễ đối chiếu lá bài với tình huống của mình.</p>
        </div>

        <fieldset className="ln-fieldset">
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

        <fieldset className="ln-fieldset">
          <legend className="field-label">Cách trải bài</legend>
          <div className="ln-spread-options">
            {SPREADS.map((s) => (
              <label key={s.id} className="ln-spread-option">
                <input
                  type="radio"
                  name="spread"
                  className="visually-hidden"
                  checked={settings.spreadId === s.id}
                  onChange={() => update({ spreadId: s.id })}
                />
                <SpreadDiagram spread={s} />
                <span className="ln-spread-name">{s.name}</span>
                <span className="ln-spread-count">{s.positions.length} lá</span>
                <span className="ln-spread-summary">{s.summary}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {spread.needsSignificator && (
          <fieldset className="ln-fieldset">
            <legend className="field-label">Lá đại diện cho bạn</legend>
            <div className="chips">
              {(
                [
                  [29, 'Người Phụ Nữ'],
                  [28, 'Người Đàn Ông'],
                ] as const
              ).map(([id, label]) => (
                <label key={id} className="chip">
                  <input
                    type="radio"
                    name="significator"
                    className="visually-hidden"
                    checked={settings.significator === id}
                    onChange={() => update({ significator: id })}
                  />
                  {label}
                </label>
              ))}
            </div>
            <p className="ln-hint">Vị trí của lá này trên bàn cho biết bạn đang đứng ở đâu giữa mọi chuyện.</p>
          </fieldset>
        )}

        <div>
          <button type="submit" className="btn btn-primary ln-deal">
            Xào bài và rút {count} lá
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="ln-table" ref={tableRef}>
      <header className="ln-table-head">
        <div>
          <p className="ln-table-spread">
            {spread.name}, chủ đề {TOPICS.find((t) => t.id === settings.topic)!.label.toLowerCase()}
          </p>
          <p className="ln-table-question">{question.trim() || 'Bạn không đặt câu hỏi cụ thể — hãy đọc bài như một thông điệp chung.'}</p>
        </div>
        <div className="ln-table-actions">
          <button type="button" className="btn btn-ghost" onClick={() => setPhase('setup')}>
            Đổi câu hỏi
          </button>
          <button type="button" className="btn btn-ghost" onClick={deal} disabled={phase === 'shuffling'}>
            Rút lại
          </button>
        </div>
      </header>

      {phase === 'shuffling' ? (
        <div className="ln-shuffle" role="status">
          <div className="ln-deck" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <Card key={i} faceUp={false} size="md" className={`ln-deck-card ln-deck-card-${i}`} />
            ))}
          </div>
          <p className="muted">Đang xào bài…</p>
        </div>
      ) : (
        <section ref={boardRef} tabIndex={-1} className="ln-board-wrap" aria-label="Bàn trải bài">
          <SpreadBoard
            spread={spread}
            cards={cards}
            revealed={revealed}
            onReveal={revealOne}
            onOpen={setOpenCard}
            highlight={spread.needsSignificator ? settings.significator : undefined}
          />
          {!allRevealed && (
            <div className="ln-board-foot">
              <p className="muted">Chạm vào từng lá để lật, hoặc lật tất cả cùng lúc.</p>
              <button type="button" className="btn btn-primary" onClick={revealAll}>
                Lật tất cả
              </button>
            </div>
          )}
        </section>
      )}

      {reading && (
        <section ref={readingRef} className="ln-reading-wrap" aria-labelledby="ln-reading-title">
          <h2 id="ln-reading-title">Diễn giải</h2>
          <ReadingView reading={reading} onOpen={setOpenCard} />
          <div className="ln-reading-actions">
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

      <Dialog open={openCard !== null} onClose={() => setOpenCard(null)}>
        {(headingId) =>
          openCard !== null && (
            <CardDetail id={openCard} topic={settings.topic} headingId={headingId} onSelectCard={setOpenCard} />
          )
        }
      </Dialog>
    </div>
  );
}
