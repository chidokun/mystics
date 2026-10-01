import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { CastReading, castToText } from '../components/CastReading';
import { Coin } from '../components/Coin';
import { HexagramFigure } from '../components/HexagramFigure';
import { trigramFromNumber } from '../data/trigrams';
import { readCast, tossCoins, tossValue, valuesFromNumbers, type CoinToss, type LineValue } from '../lib/iching';
import '../iching.css';

type Method = 'coins' | 'numbers';

const VALUE_NAMES: Record<LineValue, string> = {
  6: 'lão âm, hào động',
  7: 'thiếu dương',
  8: 'thiếu âm',
  9: 'lão dương, hào động',
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function CastPage() {
  const [question, setQuestion] = useState('');
  const [method, setMethod] = useState<Method>('coins');
  const [tosses, setTosses] = useState<CoinToss[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [numbers, setNumbers] = useState({ a: '', b: '' });
  const [numberError, setNumberError] = useState('');
  const [numberValues, setNumberValues] = useState<LineValue[] | null>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const timer = useRef<number | undefined>(undefined);
  const resultRef = useRef<HTMLElement>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const values: LineValue[] | null = method === 'coins' ? tosses.map(tossValue) : numberValues;
  const result = useMemo(() => (values && values.length === 6 ? readCast(values) : null), [values]);
  const lastToss = tosses[tosses.length - 1];

  const reset = () => {
    window.clearTimeout(timer.current);
    setTosses([]);
    setSpinning(false);
    setNumberValues(null);
    setCopyStatus('');
  };

  const tossOne = () => {
    if (spinning || tosses.length >= 6) return;
    setSpinning(true);
    timer.current = window.setTimeout(
      () => {
        setTosses((t) => (t.length < 6 ? [...t, tossCoins()] : t));
        setSpinning(false);
      },
      prefersReducedMotion() ? 0 : 650,
    );
  };

  const tossRest = () => {
    window.clearTimeout(timer.current);
    setSpinning(false);
    setTosses((t) => [...t, ...Array.from({ length: 6 - t.length }, () => tossCoins())]);
  };

  const castNumbers = (e: FormEvent) => {
    e.preventDefault();
    const a = Number(numbers.a);
    const b = Number(numbers.b);
    if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b < 1) {
      setNumberError('Nhập hai số nguyên dương, ví dụ 27 và 6.');
      return;
    }
    setNumberError('');
    setNumberValues(valuesFromNumbers(a, b));
  };

  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }, [result]);

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(castToText(question, result));
      setCopyStatus('Đã sao chép kết quả.');
    } catch {
      setCopyStatus('Trình duyệt chặn sao chép. Hãy bôi đen phần diễn giải để sao chép thủ công.');
    }
  };

  const a = Number(numbers.a);
  const b = Number(numbers.b);
  const preview = a > 0 && b > 0 ? `Quái trên: ${trigramFromNumber(a).name}, quái dưới: ${trigramFromNumber(b).name}, hào động thứ ${(a + b) % 6 || 6}.` : '';

  return (
    <div className="ic-page">
      <div className="ic-setup">
        <div className="field">
          <label className="field-label" htmlFor="ic-question">
            Điều bạn muốn hỏi
          </label>
          <textarea
            id="ic-question"
            className="input"
            rows={2}
            maxLength={300}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ví dụ: Mình nên ứng xử thế nào với thay đổi sắp tới ở công ty?"
          />
          <p className="ic-hint">Kinh Dịch trả lời tốt nhất cho câu hỏi "nên làm thế nào", hơn là câu hỏi có hoặc không.</p>
        </div>
        <fieldset className="ic-fieldset">
          <legend className="field-label">Cách lập quẻ</legend>
          <div className="chips">
            {(
              [
                ['coins', 'Gieo ba đồng xu'],
                ['numbers', 'Từ hai con số (Mai Hoa)'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className="chip"
                aria-pressed={method === id}
                onClick={() => {
                  setMethod(id);
                  reset();
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {method === 'coins' ? (
        <section className="ic-stage" aria-label="Gieo đồng xu">
          <div className="ic-stage-coins">
            <div className={`ic-coins${spinning ? ' is-spinning' : ''}`} aria-live="polite">
              {[0, 1, 2].map((i) => (
                <Coin key={i} yang={spinning ? undefined : lastToss?.[i]} spinKey={tosses.length} />
              ))}
            </div>
            <p className="ic-stage-status" role="status">
              {tosses.length === 0
                ? 'Tĩnh tâm nghĩ về câu hỏi, rồi gieo sáu lần. Mỗi lần gieo tạo một hào, từ dưới lên.'
                : tosses.length < 6
                  ? `Đã có ${tosses.length}/6 hào. Lần vừa rồi được ${tossValue(lastToss)}: ${VALUE_NAMES[tossValue(lastToss)]}.`
                  : 'Đã đủ sáu hào.'}
            </p>
            <div className="ic-stage-actions">
              {tosses.length < 6 ? (
                <>
                  <button type="button" className="btn btn-primary" onClick={tossOne} disabled={spinning}>
                    Gieo hào thứ {tosses.length + 1}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={tossRest}>
                    Gieo nhanh {tosses.length ? 'các hào còn lại' : 'cả sáu hào'}
                  </button>
                </>
              ) : (
                <button type="button" className="btn btn-ghost" onClick={reset}>
                  Gieo lại từ đầu
                </button>
              )}
            </div>
          </div>
          <div className="ic-stage-build">
            <HexagramFigure lines={tosses.map((t) => tossValue(t) % 2 === 1)} values={tosses.map(tossValue)} size="lg" />
            <ol className="ic-log" reversed>
              {[...tosses].reverse().map((t, idx) => {
                const v = tossValue(t);
                const n = tosses.length - idx;
                return (
                  <li key={n}>
                    <span>Hào {n}</span>
                    <span>
                      {t.map((y) => (y ? 'dương' : 'âm')).join(', ')} = {v}, {VALUE_NAMES[v]}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      ) : (
        <form className="ic-numbers" onSubmit={castNumbers}>
          <p className="ic-hint">
            Nghĩ về câu hỏi rồi chọn hai con số bất kỳ hiện ra trong đầu. Số thứ nhất chia 8 lấy quái trên, số thứ hai lấy quái dưới, tổng hai số
            chia 6 lấy hào động.
          </p>
          <div className="ic-numbers-row">
            <div className="field">
              <label className="field-label" htmlFor="ic-a">
                Số thứ nhất
              </label>
              <input
                id="ic-a"
                className="input"
                inputMode="numeric"
                maxLength={6}
                value={numbers.a}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '');
                  setNumbers((n) => ({ ...n, a: v }));
                }}
              />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="ic-b">
                Số thứ hai
              </label>
              <input
                id="ic-b"
                className="input"
                inputMode="numeric"
                maxLength={6}
                value={numbers.b}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '');
                  setNumbers((n) => ({ ...n, b: v }));
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Lập quẻ
            </button>
          </div>
          {numberError ? <p className="field-error">{numberError}</p> : preview && <p className="ic-hint">{preview}</p>}
        </form>
      )}

      {result && (
        <section ref={resultRef} className="ic-result" aria-labelledby="ic-result-title">
          <h2 id="ic-result-title">Lời giải</h2>
          {question.trim() && <p className="ic-question">{question.trim()}</p>}
          <CastReading result={result} />
          <div className="ic-actions">
            <button type="button" className="btn btn-ghost" onClick={copy}>
              Sao chép kết quả
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                reset();
                window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
              }}
            >
              Gieo quẻ mới
            </button>
            <p role="status" className="muted">
              {copyStatus}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
