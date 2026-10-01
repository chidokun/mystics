import { Link } from 'react-router';
import { getTrigram } from '../data/trigrams';
import type { Hexagram } from '../data/hexagrams';
import { isYang, lineTitle, linesOf, LINE_NAMES, type CastResult } from '../lib/iching';
import { hexagramPath } from '../paths';
import { HexagramFigure } from './HexagramFigure';

function trigramLine(hx: Hexagram) {
  const up = getTrigram(hx.upper);
  const low = getTrigram(hx.lower);
  return `Trên ${up.name} ${up.symbol} (${up.natureVi}), dưới ${low.name} ${low.symbol} (${low.natureVi})`;
}

/** Phần lời cần đọc trước tiên, theo số hào động */
export function focusText(r: CastResult): { rule: string; title: string; text: string } {
  const count = r.moving.length;
  const lines = r.values.map(isYang);
  switch (r.focus.kind) {
    case 'judgment':
      return {
        rule: 'Không có hào động: đọc lời của quẻ chủ.',
        title: `Lời quẻ ${r.primary.name}`,
        text: r.primary.judgment,
      };
    case 'line': {
      const i = r.focus.line;
      return {
        rule:
          count === 1
            ? 'Có một hào động: lời của hào này là trọng tâm.'
            : 'Có hai hào động: lấy hào ở trên làm trọng tâm, hào dưới để tham khảo.',
        title: `${lineTitle(i, lines[i])} của quẻ ${r.primary.short}`,
        text: r.primary.lines[i],
      };
    }
    case 'both-judgments':
      return {
        rule: 'Có ba hào động: đọc lời của cả quẻ chủ và quẻ biến, lấy quẻ chủ làm chính.',
        title: `Lời quẻ ${r.primary.short} và quẻ ${r.changed!.short}`,
        text: `${r.primary.judgment} Rồi chuyển sang: ${r.changed!.judgment}`,
      };
    case 'changed-line': {
      const i = r.focus.line;
      const changedLines = linesOf(r.changed!);
      return {
        rule:
          count === 4
            ? 'Có bốn hào động: đọc hào tĩnh phía dưới trong hai hào không động, theo lời của quẻ biến.'
            : 'Có năm hào động: đọc hào duy nhất không động, theo lời của quẻ biến.',
        title: `${lineTitle(i, changedLines[i])} của quẻ ${r.changed!.short}`,
        text: r.changed!.lines[i],
      };
    }
    case 'all-moving':
      return {
        rule: `Cả sáu hào đều động ở quẻ ${r.primary.short}: đọc lời dành riêng cho trường hợp này.`,
        title: `Sáu hào cùng động`,
        text: r.primary.allMoving!,
      };
    case 'changed-judgment':
      return {
        rule: 'Cả sáu hào đều động: tình thế đã chuyển hẳn, đọc lời của quẻ biến.',
        title: `Lời quẻ ${r.changed!.name}`,
        text: r.changed!.judgment,
      };
  }
}

export function castToText(question: string, r: CastResult): string {
  const f = focusText(r);
  const out: string[] = [];
  if (question.trim()) out.push(`Câu hỏi: ${question.trim()}`);
  out.push(`Quẻ chủ: ${r.primary.n}. ${r.primary.name} (${r.primary.theme})`);
  if (r.changed) out.push(`Quẻ biến: ${r.changed.n}. ${r.changed.name} (${r.changed.theme})`);
  out.push('', `Trọng tâm: ${f.title}`, f.text, '', `Lời quẻ: ${r.primary.judgment}`, `Lời tượng: ${r.primary.image}`, r.primary.meaning);
  if (r.moving.length) {
    out.push('', 'Hào động:');
    for (const i of r.moving) out.push(`- ${lineTitle(i, isYang(r.values[i]))}: ${r.primary.lines[i]}`);
  }
  if (r.changed) out.push('', `Quẻ biến ${r.changed.name}: ${r.changed.meaning}`);
  out.push('', `Quẻ hỗ ${r.nuclear.name}: ${r.nuclear.meaning}`);
  return out.join('\n');
}

export function CastReading({ result: r }: { result: CastResult }) {
  const f = focusText(r);
  const lines = r.values.map(isYang);
  const focusLine = r.focus.kind === 'line' ? r.focus.line : undefined;

  return (
    <div className="ic-reading">
      <div className="ic-pair">
        <figure className="ic-hex">
          <HexagramFigure lines={lines} values={r.values} focusLine={focusLine} size="lg" label={`Quẻ chủ ${r.primary.name}`} />
          <figcaption>
            <span className="ic-hex-role">Quẻ chủ</span>
            <Link to={hexagramPath(r.primary.n)} className="ic-hex-name">
              {r.primary.n}. {r.primary.name}
            </Link>
            <span className="ic-hex-theme">{r.primary.theme}</span>
          </figcaption>
        </figure>
        {r.changed && (
          <>
            <span className="ic-arrow" aria-hidden="true">
              <svg viewBox="0 0 40 16">
                <path d="M2 8H36M30 2L37 8L30 14" />
              </svg>
            </span>
            <figure className="ic-hex">
              {/* Truyền giá trị tĩnh để chừa cột đánh dấu, giữ cùng tỉ lệ với quẻ chủ */}
              <HexagramFigure
                lines={linesOf(r.changed)}
                values={linesOf(r.changed).map((yang) => (yang ? 7 : 8))}
                size="lg"
                label={`Quẻ biến ${r.changed.name}`}
              />
              <figcaption>
                <span className="ic-hex-role">Quẻ biến</span>
                <Link to={hexagramPath(r.changed.n)} className="ic-hex-name">
                  {r.changed.n}. {r.changed.name}
                </Link>
                <span className="ic-hex-theme">{r.changed.theme}</span>
              </figcaption>
            </figure>
          </>
        )}
      </div>

      <section className="ic-focus frame">
        <p className="ic-focus-rule">{f.rule}</p>
        <h3>{f.title}</h3>
        <p className="ic-focus-text">{f.text}</p>
      </section>

      <section className="ic-section">
        <h3>Quẻ chủ: {r.primary.name}</h3>
        <p className="ic-trigrams">{trigramLine(r.primary)}</p>
        <dl className="ic-texts">
          <div>
            <dt>Lời quẻ</dt>
            <dd>{r.primary.judgment}</dd>
          </div>
          <div>
            <dt>Lời tượng</dt>
            <dd>{r.primary.image}</dd>
          </div>
          <div>
            <dt>Ý nghĩa</dt>
            <dd>{r.primary.meaning}</dd>
          </div>
        </dl>
      </section>

      {r.moving.length > 0 && (
        <section className="ic-section">
          <h3>Hào động</h3>
          <p className="ic-section-intro">Hào động là chỗ tình thế đang chuyển. Đọc từ dưới lên, như sự việc diễn ra theo thời gian.</p>
          <ol className="ic-lines">
            {r.moving.map((i) => (
              <li key={i} className={focusLine === i ? 'is-focus' : undefined}>
                <span className="ic-line-title">
                  {lineTitle(i, lines[i])}
                  <span className="ic-line-pos">{LINE_NAMES[i]}, {lines[i] ? 'dương động hóa âm' : 'âm động hóa dương'}</span>
                </span>
                <span>{r.primary.lines[i]}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {r.changed && (
        <section className="ic-section">
          <h3>Quẻ biến: {r.changed.name}</h3>
          <p className="ic-section-intro">Quẻ biến cho thấy tình thế sẽ chuyển thành gì nếu các hào động hoàn tất sự thay đổi.</p>
          <dl className="ic-texts">
            <div>
              <dt>Lời quẻ</dt>
              <dd>{r.changed.judgment}</dd>
            </div>
            <div>
              <dt>Ý nghĩa</dt>
              <dd>{r.changed.meaning}</dd>
            </div>
          </dl>
        </section>
      )}

      <section className="ic-section">
        <h3>Quẻ hỗ: {r.nuclear.name}</h3>
        <div className="ic-nuclear">
          <HexagramFigure lines={linesOf(r.nuclear)} size="sm" />
          <p>
            Quẻ hỗ ghép từ bốn hào giữa của quẻ chủ, cho thấy những gì đang âm thầm vận động bên trong sự việc. {r.nuclear.meaning}
          </p>
        </div>
      </section>
    </div>
  );
}
