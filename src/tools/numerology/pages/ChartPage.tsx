import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Dialog } from '../../../components/Dialog';
import { ChartGrid } from '../components/ChartGrid';
import { NumberDetail } from '../components/NumberDetail';
import { Numeral } from '../components/Numeral';
import { DIGITS, digitMeaning, getArrow } from '../data/chart';
import { getChallenge, getPersonalYear } from '../data/cycles';
import { INDICATORS } from '../data/indicators';
import { getNumber } from '../data/numbers';
import {
  buildProfile,
  findArrows,
  isValidDate,
  nameWords,
  type ArrowLine,
  type DigitCounts,
  type NumerologyProfile,
} from '../lib/calc';
import '../numerology.css';

interface FormState {
  name: string;
  day: string;
  month: string;
  year: string;
}

type ChartTab = 'birth' | 'name' | 'combined';

const CHART_TABS: { id: ChartTab; label: string; about: string }[] = [
  { id: 'birth', label: 'Ngày sinh', about: 'Các chữ số trong ngày, tháng, năm sinh (bỏ số 0).' },
  { id: 'name', label: 'Họ tên', about: 'Giá trị các chữ cái trong họ tên khai sinh.' },
  { id: 'combined', label: 'Tổng hợp', about: 'Gộp cả ngày sinh và họ tên — bức tranh đầy đủ nhất.' },
];

/** Giữ lại lần nhập gần nhất khi chuyển qua lại giữa các tab, không lưu xuống máy. */
let lastInput: FormState | null = null;

const EMPTY_FORM: FormState = { name: '', day: '', month: '', year: '' };

function toDate(f: FormState) {
  return { day: Number(f.day), month: Number(f.month), year: Number(f.year) };
}

export default function ChartPage() {
  const [form, setForm] = useState<FormState>(lastInput ?? EMPTY_FORM);
  const [errors, setErrors] = useState<{ name?: string; date?: string }>({});
  const [profile, setProfile] = useState<NumerologyProfile | null>(() =>
    lastInput ? buildProfile(lastInput.name, toDate(lastInput)) : null,
  );
  const [open, setOpen] = useState<{ n: number; context: string } | null>(null);

  const set = (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
    // Đọc giá trị ngay trong sự kiện; hàm cập nhật state có thể chạy sau khi input đã đổi
    const value = key === 'name' ? e.target.value : e.target.value.replace(/\D/g, '');
    setForm((f) => ({ ...f, [key]: value }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    const letters = nameWords(form.name).join('');
    if (letters.length < 2) next.name = 'Nhập họ tên khai sinh, ít nhất hai chữ cái.';
    else if (!/[AEIOUY]/.test(letters) || !/[^AEIOUY]/.test(letters))
      next.name = 'Họ tên cần có cả nguyên âm và phụ âm để tính được các chỉ số.';
    if (!isValidDate(toDate(form))) next.date = 'Ngày sinh chưa hợp lệ. Kiểm tra lại ngày, tháng và năm (4 chữ số).';
    setErrors(next);
    if (next.name || next.date) return;
    lastInput = form;
    setProfile(buildProfile(form.name, toDate(form)));
    requestAnimationFrame(() => document.getElementById('nm-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <div className="nm-page">
      <form className="nm-form" onSubmit={onSubmit} noValidate>
        <div className="field nm-field-name">
          <label className="field-label" htmlFor="nm-name">
            Họ và tên khai sinh
          </label>
          <input
            id="nm-name"
            className="input"
            autoComplete="name"
            value={form.name}
            onChange={set('name')}
            placeholder="Nguyễn Thị Minh Anh"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'nm-name-err' : 'nm-name-hint'}
          />
          {errors.name ? (
            <p id="nm-name-err" className="field-error">
              {errors.name}
            </p>
          ) : (
            <p id="nm-name-hint" className="nm-hint">
              Có dấu hay không dấu đều được.
            </p>
          )}
        </div>
        <fieldset className="nm-date" aria-describedby={errors.date ? 'nm-date-err' : undefined}>
          <legend className="field-label">Ngày sinh dương lịch</legend>
          <div className="nm-date-inputs">
            <input
              className="input"
              inputMode="numeric"
              maxLength={2}
              aria-label="Ngày"
              placeholder="Ngày"
              value={form.day}
              onChange={set('day')}
              aria-invalid={!!errors.date}
            />
            <input
              className="input"
              inputMode="numeric"
              maxLength={2}
              aria-label="Tháng"
              placeholder="Tháng"
              value={form.month}
              onChange={set('month')}
              aria-invalid={!!errors.date}
            />
            <input
              className="input"
              inputMode="numeric"
              maxLength={4}
              aria-label="Năm"
              placeholder="Năm"
              value={form.year}
              onChange={set('year')}
              aria-invalid={!!errors.date}
            />
          </div>
          {errors.date && (
            <p id="nm-date-err" className="field-error">
              {errors.date}
            </p>
          )}
        </fieldset>
        <button type="submit" className="btn btn-primary nm-submit">
          Lập bảng thần số học
        </button>
      </form>

      {profile ? (
        <Result profile={profile} onOpen={(n, context) => setOpen({ n, context })} />
      ) : (
        <p className="nm-empty muted">
          Nhập họ tên và ngày sinh để xem số chủ đạo, các chỉ số trong tên, biểu đồ mũi tên và chu kỳ năm cá nhân.
        </p>
      )}

      <Dialog open={open !== null} onClose={() => setOpen(null)}>
        {(headingId) => open && <NumberDetail n={open.n} context={open.context} headingId={headingId} />}
      </Dialog>
    </div>
  );
}

function Result({ profile, onOpen }: { profile: NumerologyProfile; onOpen: (n: number, context: string) => void }) {
  const lp = getNumber(profile.lifePath);
  const { day, month, year } = profile.date;
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div id="nm-result" className="nm-result">
      <p className="nm-result-for">
        Bảng thần số học của <strong>{profile.name}</strong>, sinh ngày {pad(day)}/{pad(month)}/{year}
      </p>

      <section className="nm-hero" aria-labelledby="nm-lp-title">
        <Numeral n={profile.lifePath} size="xl" />
        <div className="nm-hero-body">
          <p className="nm-hero-label">Số chủ đạo</p>
          <h2 id="nm-lp-title">{lp.title}</h2>
          <p className="nm-keywords">{lp.keywords.join(', ')}</p>
          <p className="nm-hero-essence">{lp.essence}</p>
          <div className="nm-detail-cols">
            <section>
              <h3>Điểm mạnh</h3>
              <ul>
                {lp.strengths.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3>Điều cần lưu ý</h3>
              <ul>
                {lp.challenges.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </section>
          </div>
          <dl className="nm-detail-list">
            <div>
              <dt>Nghề nghiệp phù hợp</dt>
              <dd>{lp.careers}</dd>
            </div>
            <div>
              <dt>Tình cảm</dt>
              <dd>{lp.love}</dd>
            </div>
            <div>
              <dt>Lời khuyên</dt>
              <dd>{lp.advice}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="nm-section" aria-labelledby="nm-indicators">
        <h2 id="nm-indicators">Các chỉ số khác</h2>
        <ul className="nm-tiles">
          {INDICATORS.map((ind) => {
            const n = profile[ind.id];
            const m = getNumber(n);
            return (
              <li key={ind.id}>
                <button type="button" className="nm-tile" onClick={() => onOpen(n, ind.name)}>
                  <span className="nm-tile-head">
                    <span className="nm-tile-name">{ind.name}</span>
                    <Numeral n={n} size="sm" />
                  </span>
                  <span className="nm-tile-about">{ind.about}</span>
                  <span className="nm-tile-line">{ind.line(m)}</span>
                  <span className="nm-tile-more">Xem ý nghĩa số {n === 22 ? '22/4' : n}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <ChartSection profile={profile} />
      <YearSection profile={profile} />
      <PeakSection profile={profile} onOpen={onOpen} />
      <NameSection profile={profile} />

      <p className="nm-disclaimer muted">
        Thần số học là một hệ thống biểu tượng để tự chiêm nghiệm, không phải khoa học. Hãy đọc như một gợi ý về bản thân, không phải
        lời phán định.
      </p>
    </div>
  );
}

function ChartSection({ profile }: { profile: NumerologyProfile }) {
  const [tab, setTab] = useState<ChartTab>('birth');
  const [active, setActive] = useState<ArrowLine | null>(null);
  const counts: DigitCounts = profile.charts[tab];
  const { full, empty } = findArrows(counts);
  const filledByName = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => profile.charts.birth[d] === 0 && profile.charts.name[d] > 0);
  const current = CHART_TABS.find((t) => t.id === tab)!;

  return (
    <section className="nm-section" aria-labelledby="nm-chart-title">
      <h2 id="nm-chart-title">Biểu đồ và mũi tên</h2>
      <div className="chips" role="group" aria-label="Chọn biểu đồ">
        {CHART_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className="chip"
            aria-pressed={tab === t.id}
            onClick={() => {
              setTab(t.id);
              setActive(null);
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="muted nm-chart-about">{current.about}</p>

      <div className="nm-chart-layout">
        <ChartGrid
          counts={counts}
          activeArrow={active}
          marked={tab === 'name' ? filledByName : []}
          label={`Biểu đồ ${current.label.toLowerCase()}`}
        />

        <div className="nm-arrow-list">
          {full.length + empty.length === 0 && (
            <p className="muted">Biểu đồ này không có mũi tên nào — năng lượng phân bố khá đều, không có trục nào quá mạnh hay quá yếu.</p>
          )}
          {[...full.map((l) => ({ l, kind: 'full' as const })), ...empty.map((l) => ({ l, kind: 'empty' as const }))].map(
            ({ l, kind }) => {
              const a = getArrow(l);
              return (
                <button
                  key={l}
                  type="button"
                  className={`nm-arrow-item nm-arrow-item--${kind}`}
                  aria-pressed={active === l}
                  onMouseEnter={() => setActive(l)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(l)}
                  onBlur={() => setActive(null)}
                >
                  <span className="nm-arrow-name">
                    {kind === 'full' ? a.fullName : a.emptyName}
                    <span className="nm-arrow-digits">
                      {l.split('').join('-')} {kind === 'full' ? 'đầy đủ' : 'trống'}
                    </span>
                  </span>
                  <span>{kind === 'full' ? a.full : a.empty}</span>
                </button>
              );
            },
          )}
          {tab === 'name' && filledByName.length > 0 && (
            <p className="nm-fill-note">
              Tên của bạn bù vào {filledByName.length === 1 ? 'số' : 'các số'} {filledByName.join(', ')} còn trống trong ngày sinh
              (ô được viền vàng). Những phẩm chất ấy bạn có thể rèn luyện dễ dàng hơn.
            </p>
          )}
        </div>
      </div>

      <dl className="nm-digit-list">
        {DIGITS.map((d) => {
          const n = counts[d.digit];
          return (
            <div key={d.digit} className={n === 0 ? 'is-empty' : undefined}>
              <dt>
                <span className="nm-digit-badge">{n === 0 ? d.digit : String(d.digit).repeat(Math.min(n, 5))}</span>
                <span>
                  {d.theme}
                  <span className="nm-digit-count">{n === 0 ? 'không có' : `${n} lần`}</span>
                </span>
              </dt>
              <dd>{digitMeaning(d.digit, n)}</dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}

function YearSection({ profile }: { profile: NumerologyProfile }) {
  const now = new Date();
  const year = now.getFullYear();
  const py = getPersonalYear(profile.personalYear);
  const pm = getPersonalYear(profile.personalMonth);
  const cycleStart = year - (profile.personalYear - 1);

  return (
    <section className="nm-section" aria-labelledby="nm-year-title">
      <h2 id="nm-year-title">Năm cá nhân</h2>
      <ol className="nm-cycle" aria-label="Chu kỳ 9 năm hiện tại">
        {Array.from({ length: 9 }, (_, i) => {
          const y = cycleStart + i;
          const isNow = y === year;
          return (
            <li key={y} className={isNow ? 'is-now' : y < year ? 'is-past' : undefined} aria-current={isNow ? 'step' : undefined}>
              <span className="nm-cycle-n">{i + 1}</span>
              <span className="nm-cycle-year">{y}</span>
            </li>
          );
        })}
      </ol>
      <div className="nm-year-body">
        <div>
          <h3>
            Năm {year}: năm cá nhân số {profile.personalYear}, {py.title.toLowerCase()}
          </h3>
          <p>{py.text}</p>
          <p className="nm-focus">Nên tập trung: {py.focus}</p>
        </div>
        <div>
          <h3>
            Tháng {now.getMonth() + 1}: tháng cá nhân số {profile.personalMonth}
          </h3>
          <p>{pm.focus}</p>
        </div>
      </div>
    </section>
  );
}

function PeakSection({ profile, onOpen }: { profile: NumerologyProfile; onOpen: (n: number, context: string) => void }) {
  const currentIndex = profile.peaks.reduce((acc, p, i) => (profile.age >= p.age ? i : acc), -1);
  return (
    <section className="nm-section" aria-labelledby="nm-peak-title">
      <h2 id="nm-peak-title">Bốn đỉnh cao cuộc đời</h2>
      <p className="muted nm-section-intro">
        Mỗi đỉnh là một giai đoạn với bài học và cơ hội riêng. Đỉnh đầu tiên đến ở tuổi {profile.peaks[0].age} (36 trừ số chủ đạo), các
        đỉnh sau cách nhau 9 năm.{' '}
        {currentIndex === -1
          ? `Bạn ${profile.age} tuổi, đang trên đường tới đỉnh thứ nhất.`
          : `Bạn ${profile.age} tuổi, đang ở giai đoạn của đỉnh thứ ${currentIndex + 1}.`}
      </p>
      <ol className="nm-peaks">
        {profile.peaks.map((p, i) => {
          const challenge = getChallenge(p.challenge);
          const m = getNumber(p.pinnacle);
          return (
            <li key={i} className={i === currentIndex ? 'is-now' : undefined} aria-current={i === currentIndex ? 'step' : undefined}>
              <p className="nm-peak-when">
                Đỉnh {i + 1}: tuổi {p.age}, năm {p.year}
              </p>
              <button type="button" className="nm-peak-number" onClick={() => onOpen(p.pinnacle, `Đỉnh cao thứ ${i + 1}`)}>
                <Numeral n={p.pinnacle} size="md" />
                <span className="visually-hidden">Xem ý nghĩa số {p.pinnacle}</span>
              </button>
              <p>{m.pinnacle}</p>
              <p className="nm-peak-challenge">
                <span>Thử thách {p.challenge}: {challenge.title}.</span> {challenge.text}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function NameSection({ profile }: { profile: NumerologyProfile }) {
  return (
    <section className="nm-section" aria-labelledby="nm-name-title">
      <h2 id="nm-name-title">Năng lượng trong tên</h2>
      <dl className="nm-detail-list">
        <div>
          <dt>Số đam mê</dt>
          <dd>
            {profile.passion.length === 0
              ? 'Không xác định.'
              : `Số ${profile.passion.join(', ')} xuất hiện nhiều nhất trong tên. Năng lượng nổi trội: ${profile.passion
                  .map((d) => DIGITS[d - 1].theme.toLowerCase())
                  .join('; ')}.`}
          </dd>
        </div>
        <div>
          <dt>Số còn thiếu</dt>
          <dd>
            {profile.missingInName.length === 0
              ? 'Tên của bạn có đủ cả chín con số — một sự cân bằng hiếm có.'
              : `Tên không có số ${profile.missingInName.join(', ')}. Đây là những bài học cần chủ động rèn: ${profile.missingInName
                  .map((d) => DIGITS[d - 1].theme.toLowerCase())
                  .join('; ')}.`}
          </dd>
        </div>
      </dl>
    </section>
  );
}
