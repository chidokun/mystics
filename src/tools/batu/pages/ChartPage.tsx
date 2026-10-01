import { useState, type ChangeEvent, type FormEvent } from 'react';
import { BranchText, Ganzhi, StemText } from '../components/GanzhiChar';
import { ElementBars } from '../components/ElementBars';
import { PillarTable } from '../components/PillarTable';
import { ELEMENTS, type Element } from '../data/elements';
import { BRANCHES, ganzhiName, napAmOf, STEMS } from '../data/ganzhi';
import { GOD_GROUP, SHEN_SHA, TEN_GODS, type TenGod } from '../data/gods';
import { annualPillars, BirthError, buildChart, PILLAR_LABELS, type BaziChart, type Gender } from '../lib/bazi';
import { leapMonthOf } from '../lib/calendar';
import { formatAge, formatLunar, pad2 } from '../lib/format';
import '../batu.css';

interface FormState {
  name: string;
  gender: Gender;
  calendar: 'solar' | 'lunar';
  day: string;
  month: string;
  year: string;
  leap: boolean;
  hour: string;
  minute: string;
  unknownHour: boolean;
}

const EMPTY: FormState = {
  name: '',
  gender: 'female',
  calendar: 'solar',
  day: '',
  month: '',
  year: '',
  leap: false,
  hour: '',
  minute: '',
  unknownHour: false,
};

/** Giữ lại lần nhập gần nhất khi chuyển tab, không lưu xuống máy */
let lastForm: FormState | null = null;
let lastChart: BaziChart | null = null;

export default function ChartPage() {
  const [form, setForm] = useState<FormState>(lastForm ?? EMPTY);
  const [error, setError] = useState('');
  const [chart, setChart] = useState<BaziChart | null>(lastChart);

  const set = (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = key === 'name' ? e.target.value : e.target.value.replace(/\D/g, '');
    setForm((f) => ({ ...f, [key]: value }));
  };
  const patch = (p: Partial<FormState>) => setForm((f) => ({ ...f, ...p }));

  const yearNum = Number(form.year);
  const leapHint =
    form.calendar === 'lunar' && yearNum >= 1900 && yearNum <= 2100
      ? (() => {
          const lm = leapMonthOf(yearNum);
          return lm ? `Năm âm lịch ${yearNum} có tháng ${lm} nhuận.` : `Năm âm lịch ${yearNum} không có tháng nhuận.`;
        })()
      : '';

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const day = Number(form.day);
    const month = Number(form.month);
    const year = Number(form.year);
    if (!day || !month || !year || month > 12 || day > 31 || year < 1900 || year > 2100) {
      setError('Nhập ngày, tháng và năm sinh (năm từ 1900 đến 2100).');
      return;
    }
    let hour: number | undefined;
    let minute: number | undefined;
    if (!form.unknownHour) {
      hour = Number(form.hour);
      minute = Number(form.minute || 0);
      if (form.hour === '' || hour > 23 || minute > 59) {
        setError('Nhập giờ sinh từ 0 đến 23 và phút từ 0 đến 59, hoặc chọn "Không rõ giờ sinh".');
        return;
      }
    }
    try {
      const c = buildChart({ calendar: form.calendar, day, month, year, leap: form.leap, hour, minute, gender: form.gender });
      setError('');
      setChart(c);
      lastForm = form;
      lastChart = c;
      requestAnimationFrame(() => document.getElementById('bt-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch (err) {
      setError(err instanceof BirthError ? err.message : 'Không lập được lá số với thông tin này.');
    }
  };

  return (
    <div className="bt-page">
      <form className="bt-form" onSubmit={onSubmit} noValidate>
        <div className="field bt-field-name">
          <label className="field-label" htmlFor="bt-name">
            Tên (không bắt buộc)
          </label>
          <input id="bt-name" className="input" value={form.name} onChange={set('name')} autoComplete="name" />
        </div>

        <fieldset className="bt-fieldset">
          <legend className="field-label">Giới tính</legend>
          <div className="chips">
            {(
              [
                ['female', 'Nữ'],
                ['male', 'Nam'],
              ] as const
            ).map(([id, label]) => (
              <button key={id} type="button" className="chip" aria-pressed={form.gender === id} onClick={() => patch({ gender: id })}>
                {label}
              </button>
            ))}
          </div>
          <p className="bt-hint">Dùng để xác định chiều đại vận (thuận hay nghịch).</p>
        </fieldset>

        <fieldset className="bt-fieldset bt-fieldset--date">
          <legend className="field-label">Ngày sinh</legend>
          <div className="chips">
            {(
              [
                ['solar', 'Dương lịch'],
                ['lunar', 'Âm lịch'],
              ] as const
            ).map(([id, label]) => (
              <button key={id} type="button" className="chip" aria-pressed={form.calendar === id} onClick={() => patch({ calendar: id })}>
                {label}
              </button>
            ))}
          </div>
          <div className="bt-date">
            <input className="input" inputMode="numeric" maxLength={2} aria-label="Ngày" placeholder="Ngày" value={form.day} onChange={set('day')} />
            <input className="input" inputMode="numeric" maxLength={2} aria-label="Tháng" placeholder="Tháng" value={form.month} onChange={set('month')} />
            <input className="input" inputMode="numeric" maxLength={4} aria-label="Năm" placeholder="Năm" value={form.year} onChange={set('year')} />
          </div>
          {form.calendar === 'lunar' && (
            <label className="bt-check">
              <input type="checkbox" checked={form.leap} onChange={(e) => patch({ leap: e.target.checked })} />
              Tháng nhuận
              {leapHint && <span className="bt-hint">{leapHint}</span>}
            </label>
          )}
        </fieldset>

        <fieldset className="bt-fieldset">
          <legend className="field-label">Giờ sinh</legend>
          <div className="bt-time">
            <input
              className="input"
              inputMode="numeric"
              maxLength={2}
              aria-label="Giờ"
              placeholder="Giờ"
              value={form.hour}
              onChange={set('hour')}
              disabled={form.unknownHour}
            />
            <span aria-hidden="true">:</span>
            <input
              className="input"
              inputMode="numeric"
              maxLength={2}
              aria-label="Phút"
              placeholder="Phút"
              value={form.minute}
              onChange={set('minute')}
              disabled={form.unknownHour}
            />
          </div>
          <label className="bt-check">
            <input type="checkbox" checked={form.unknownHour} onChange={(e) => patch({ unknownHour: e.target.checked })} />
            Không rõ giờ sinh
          </label>
          <p className="bt-hint">
            Giờ đồng hồ tại Việt Nam (UTC+7). Nếu sinh ở miền Nam trong khoảng 1960–6/1975, đồng hồ khi đó chạy theo UTC+8: hãy trừ đi 1 giờ.
          </p>
        </fieldset>

        {error && (
          <p className="field-error bt-error" role="alert">
            {error}
          </p>
        )}
        <div>
          <button type="submit" className="btn btn-primary">
            Lập lá số
          </button>
        </div>
      </form>

      {chart ? (
        <Result chart={chart} name={lastForm?.name ?? ''} />
      ) : (
        <p className="bt-empty muted">
          Nhập ngày giờ sinh để xem bốn trụ can chi, nhật chủ, cân bằng ngũ hành, các vận mười năm và năm hiện tại.
        </p>
      )}
    </div>
  );
}

function Result({ chart, name }: { chart: BaziChart; name: string }) {
  const dm = STEMS[chart.dayMaster];
  const yearPillar = chart.pillars[0];
  const yearNapAm = napAmOf(yearPillar.ganzhi);
  const { solar, time } = chart;

  return (
    <div id="bt-result" className="bt-result">
      <header className="bt-result-head">
        <p className="bt-result-for">
          Lá số {name.trim() ? <strong>{name.trim()}</strong> : 'của bạn'}, {chart.gender === 'male' ? 'nam' : 'nữ'}
        </p>
        <p>
          Sinh {time ? `lúc ${pad2(time.hour)}:${pad2(time.minute)} ` : ''}ngày {pad2(solar.day)}/{pad2(solar.month)}/{solar.year} dương lịch,
          tức {formatLunar(chart.lunar)}.
        </p>
        <p className="muted">
          Tuổi {BRANCHES[yearPillar.branch].animal.toLowerCase()} (năm {ganzhiName(yearPillar.ganzhi)} theo tiết khí), mệnh {yearNapAm.name} — {yearNapAm.meaning.toLowerCase()}.
        </p>
      </header>

      {chart.warnings.map((w) => (
        <p key={w} className="bt-warning" role="note">
          {w}
        </p>
      ))}

      <section className="bt-section" aria-labelledby="bt-pillars-title">
        <h2 id="bt-pillars-title">Tứ trụ</h2>
        <PillarTable pillars={chart.pillars} hasHour={Boolean(chart.time)} />
      </section>

      <section className="bt-section bt-daymaster" aria-labelledby="bt-dm-title">
        <span className={`bt-dm-char bt-el--${dm.element}`} aria-hidden="true">
          {dm.name}
        </span>
        <div>
          <p className="bt-label">Nhật chủ</p>
          <h2 id="bt-dm-title">
            {dm.name} {ELEMENTS[dm.element].name}: {dm.image.toLowerCase()}
          </h2>
          <p className="bt-lead">{dm.nature}</p>
          <dl className="bt-list">
            <div>
              <dt>Điểm mạnh</dt>
              <dd>{dm.strengths}</dd>
            </div>
            <div>
              <dt>Cần lưu ý</dt>
              <dd>{dm.cautions}</dd>
            </div>
          </dl>
        </div>
      </section>

      <ElementSection chart={chart} />
      <GodSection gods={chart.gods} />

      <section className="bt-section" aria-labelledby="bt-rel-title">
        <h2 id="bt-rel-title">Hợp và xung</h2>
        {chart.relations.length === 0 ? (
          <p className="muted">Các trụ không có thế hợp hay xung rõ rệt; các mặt đời sống khá độc lập, ít va chạm.</p>
        ) : (
          <ul className="bt-relations">
            {chart.relations.map((r) => (
              <li key={r.text} data-kind={r.kind}>
                <span className="bt-rel-kind">{r.kind}</span>
                <span>{r.text}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bt-section" aria-labelledby="bt-sha-title">
        <h2 id="bt-sha-title">Thần sát</h2>
        {chart.shensha.length === 0 ? (
          <p className="muted">Không có thần sát nào trong năm sao phổ biến được xét.</p>
        ) : (
          <dl className="bt-list">
            {chart.shensha.map((s) => (
              <div key={s.id}>
                <dt>
                  {SHEN_SHA[s.id].name}
                  <span className="bt-sub">ở trụ {s.pillars.map((k) => PILLAR_LABELS[k].toLowerCase()).join(', ')}</span>
                </dt>
                <dd>{SHEN_SHA[s.id].meaning}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      <LuckSection chart={chart} />

      <p className="bt-disclaimer muted">
        Bát Tự là một hệ thống biểu tượng cổ để tự chiêm nghiệm. Phần đánh giá thân vượng, nhược và hành nên bổ sung ở đây dùng cách tính
        rút gọn; người luận lá số chuyên sâu còn xét nhiều yếu tố khác.
      </p>
    </div>
  );
}

const STRENGTH_TEXT: Record<BaziChart['strength']['label'], string> = {
  vượng: 'Thân vượng: nhật chủ được nhiều hành cùng loại và hành sinh ra mình nâng đỡ. Bạn có nội lực, tự tin; điều cần là nơi để phát huy năng lượng đó.',
  nhược: 'Thân nhược: nhật chủ chịu nhiều áp lực từ các hành tiêu hao hoặc khắc chế. Bạn cần được nâng đỡ, học hỏi và hợp tác để phát huy.',
  'trung hòa': 'Trung hòa: lực nâng đỡ và lực tiêu hao khá cân bằng. Nên bổ sung hành đang thiếu nhất để lá số thêm hài hòa.',
};

function ElementSection({ chart }: { chart: BaziChart }) {
  const dmElement = STEMS[chart.dayMaster].element;
  const missing = (Object.keys(chart.elements) as Element[]).filter((e) => chart.elements[e] < 0.005);
  return (
    <section className="bt-section" aria-labelledby="bt-el-title">
      <h2 id="bt-el-title">Ngũ hành</h2>
      <p className="bt-section-intro">
        Tính trên cả thiên can, địa chi và tàng can; chi tháng nặng hơn vì quyết định khí của mùa sinh.
      </p>
      <div className="bt-el-layout">
        <ElementBars values={chart.elements} dayElement={dmElement} favorable={chart.favorable} unfavorable={chart.unfavorable} />
        <div className="bt-strength">
          <p className="bt-strength-label">
            Thân {chart.strength.label}
            <span className="bt-sub">
              {Math.round(chart.strength.ratio * 100)}% lực nâng đỡ{chart.strength.seasonal ? ', được lệnh tháng' : ', không được lệnh tháng'}
            </span>
          </p>
          <p>{STRENGTH_TEXT[chart.strength.label]}</p>
          {missing.length > 0 && <p>Lá số thiếu hành {missing.map((e) => ELEMENTS[e].name).join(', ')}.</p>}
        </div>
      </div>
      <h3>Hành nên bổ sung</h3>
      <ul className="bt-favor">
        {chart.favorable.map((e) => (
          <li key={e} className={`bt-favor-item bt-favor-item--${e}`}>
            <span className="bt-favor-name">{ELEMENTS[e].name}</span>
            <dl>
              <div>
                <dt>Màu sắc</dt>
                <dd>{ELEMENTS[e].colors}</dd>
              </div>
              <div>
                <dt>Hướng</dt>
                <dd>{ELEMENTS[e].direction}</dd>
              </div>
              <div>
                <dt>Nghề nghiệp</dt>
                <dd>{ELEMENTS[e].careers}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
      <p className="muted">Nên tiết chế: {chart.unfavorable.map((e) => ELEMENTS[e].name).join(', ')}.</p>
    </section>
  );
}

const GROUP_NAMES = {
  self: 'Tỷ Kiếp (bản thân, bạn bè)',
  output: 'Thực Thương (tài năng, biểu đạt)',
  wealth: 'Tài tinh (tiền bạc)',
  power: 'Quan Sát (sự nghiệp, áp lực)',
  resource: 'Ấn tinh (học vấn, che chở)',
} as const;

function GodSection({ gods }: { gods: Record<TenGod, number> }) {
  const sorted = (Object.keys(gods) as TenGod[]).filter((g) => gods[g] > 0).sort((a, b) => gods[b] - gods[a]);
  const top = sorted.slice(0, 3);
  const groups = Object.keys(GROUP_NAMES) as (keyof typeof GROUP_NAMES)[];
  const missingGroups = groups.filter((g) => !sorted.some((s) => GOD_GROUP[s] === g));
  return (
    <section className="bt-section" aria-labelledby="bt-god-title">
      <h2 id="bt-god-title">Thập thần nổi bật</h2>
      <p className="bt-section-intro">Thập thần là quan hệ của mỗi can với nhật chủ, cho biết những mảng đời sống nào hiện rõ trong lá số.</p>
      <ol className="bt-gods">
        {top.map((g) => (
          <li key={g}>
            <span className="bt-god-name">{TEN_GODS[g].name}</span>
            <span>{TEN_GODS[g].strong}</span>
          </li>
        ))}
      </ol>
      {missingGroups.length > 0 && (
        <p className="muted">Vắng nhóm {missingGroups.map((g) => GROUP_NAMES[g]).join('; ')}: mảng này cần được chủ động bồi đắp.</p>
      )}
    </section>
  );
}

function LuckSection({ chart }: { chart: BaziChart }) {
  const now = new Date();
  const thisYear = now.getFullYear();
  const age = thisYear - chart.solar.year;
  const current = chart.luck.pillars.reduce((acc, p, i) => (age >= p.fromAge ? i : acc), -1);
  const annual = annualPillars(chart.dayMaster, thisYear, 5);
  return (
    <section className="bt-section" aria-labelledby="bt-luck-title">
      <h2 id="bt-luck-title">Đại vận và lưu niên</h2>
      <p className="bt-section-intro">
        Đại vận đi {chart.luck.forward ? 'thuận' : 'nghịch'} (tính từ tiết {chart.luck.term}), khởi vận lúc {formatAge(chart.luck.startAge)}. Mỗi vận
        kéo dài mười năm, mang năng lượng của một cặp can chi.
      </p>
      <ol className="bt-luck">
        {chart.luck.pillars.map((p, i) => (
          <li key={p.ganzhi} className={i === current ? 'is-now' : undefined} aria-current={i === current ? 'step' : undefined}>
            <span className="bt-luck-age">{Math.floor(p.fromAge)} tuổi</span>
            <span className="bt-luck-chars">
              <StemText stem={p.ganzhi % 10} />
              <BranchText branch={p.ganzhi % 12} />
            </span>
            <span className="bt-luck-god">{TEN_GODS[p.god].name}</span>
            <span className="bt-luck-year">từ {p.fromYear}</span>
          </li>
        ))}
      </ol>
      {current >= 0 && (
        <p className="bt-luck-now">
          Hiện bạn đang ở vận <Ganzhi ganzhi={chart.luck.pillars[current].ganzhi} />, mang tính chất{' '}
          {TEN_GODS[chart.luck.pillars[current].god].name}: {TEN_GODS[chart.luck.pillars[current].god].meaning.toLowerCase()}
        </p>
      )}

      <h3>Các năm tới</h3>
      <ul className="bt-annual">
        {annual.map((a) => (
          <li key={a.year} className={a.year === thisYear ? 'is-now' : undefined}>
            <span className="bt-annual-year">{a.year}</span>
            <Ganzhi ganzhi={a.ganzhi} />
            <span className="bt-annual-god">{TEN_GODS[a.god].name}</span>
            <span className="bt-annual-text">{TEN_GODS[a.god].meaning}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
