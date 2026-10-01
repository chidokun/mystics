import { useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { ChartGrid } from '../components/ChartGrid';
import { NumberDetail } from '../components/NumberDetail';
import { Numeral } from '../components/Numeral';
import { ARROWS, DIGITS } from '../data/chart';
import { CHALLENGES, PERSONAL_YEARS } from '../data/cycles';
import { INDICATORS } from '../data/indicators';
import { NUMBERS } from '../data/numbers';
import { letterValue } from '../lib/calc';
import { LOOKUP_PATH } from '../paths';
import '../numerology.css';

const VIEWS = [
  { path: 'so', label: 'Con số' },
  { path: 'bieu-do', label: 'Biểu đồ và mũi tên' },
  { path: 'chu-ky', label: 'Chu kỳ và thử thách' },
  { path: 'cach-tinh', label: 'Cách tính' },
] as const;

export default function LookupPage() {
  const { '*': rest = '' } = useParams();
  const [view = 'so', arg] = rest.split('/');

  return (
    <div className="nm-lookup">
      <nav className="nm-subnav" aria-label="Mục tra cứu">
        {VIEWS.map((v) => (
          <Link
            key={v.path}
            to={`${LOOKUP_PATH}/${v.path}`}
            className="chip"
            aria-current={view === v.path ? 'page' : undefined}
          >
            {v.label}
          </Link>
        ))}
      </nav>
      {view === 'bieu-do' ? (
        <ChartView />
      ) : view === 'chu-ky' ? (
        <CycleView />
      ) : view === 'cach-tinh' ? (
        <MethodView />
      ) : (
        <NumberView n={Number(arg) || 1} />
      )}
    </div>
  );
}

function NumberView({ n }: { n: number }) {
  const valid = NUMBERS.some((x) => x.n === n) ? n : 1;
  useEffect(() => {
    document.getElementById('nm-number-detail')?.focus({ preventScroll: true });
  }, [valid]);

  return (
    <div className="nm-number-view">
      <ul className="nm-picker" aria-label="Chọn con số">
        {NUMBERS.map((x) => (
          <li key={x.n}>
            <Link
              to={`${LOOKUP_PATH}/so/${x.n}`}
              className="nm-picker-item"
              aria-current={x.n === valid ? 'page' : undefined}
              aria-label={`Số ${x.n}: ${x.title}`}
            >
              <Numeral n={x.n} size="sm" />
            </Link>
          </li>
        ))}
      </ul>
      <div id="nm-number-detail" tabIndex={-1} className="nm-number-detail">
        <NumberDetail n={valid} showContexts />
        {valid === 10 && (
          <p className="muted nm-note">Số 10 chỉ xuất hiện ở vị trí số chủ đạo. Ở các chỉ số khác, 10 được rút gọn thành 1.</p>
        )}
      </div>
    </div>
  );
}

const ALL_ONE = { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1 };
const COUNT_LABELS = ['Không có', 'Một lần', 'Hai lần', 'Ba lần', 'Từ bốn lần'];

function ChartView() {
  return (
    <div className="nm-ref">
      <section className="nm-ref-intro">
        <ChartGrid counts={ALL_ONE} label="Vị trí các số trong biểu đồ" showArrows={false} />
        <div className="prose">
          <h2>Biểu đồ Pythagoras</h2>
          <p>
            Các chữ số trong ngày sinh (bỏ số 0) được xếp vào lưới 3×3. Hàng trên là tầng trí não (3, 6, 9), hàng giữa là tầng tinh thần
            (2, 5, 8), hàng dưới là tầng thể chất (1, 4, 7).
          </p>
          <p>
            Khi một hàng, cột hoặc đường chéo có đủ cả ba số, ta có một <strong>mũi tên sức mạnh</strong>. Khi cả ba ô đều trống, đó là{' '}
            <strong>mũi tên trống</strong> — một điểm yếu cần rèn luyện. Họ tên cũng có biểu đồ riêng, có thể bù vào các ô còn trống.
          </p>
        </div>
      </section>

      <section className="nm-section">
        <h2>Mũi tên</h2>
        <ul className="nm-ref-arrows">
          {ARROWS.map((a) => (
            <li key={a.line}>
              <p className="nm-ref-line">{a.line.split('').join('-')}</p>
              <div>
                <h3 className="nm-ref-full">{a.fullName}</h3>
                <p>{a.full}</p>
              </div>
              <div>
                <h3 className="nm-ref-empty">{a.emptyName}</h3>
                <p>{a.empty}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="nm-section">
        <h2>Ý nghĩa từng ô số</h2>
        <div className="nm-ref-digits">
          {DIGITS.map((d) => (
            <article key={d.digit}>
              <h3>
                <span className="nm-digit-badge">{d.digit}</span> {d.theme}
              </h3>
              <dl>
                {d.byCount.map((text, i) => (
                  <div key={i}>
                    <dt>{COUNT_LABELS[i]}</dt>
                    <dd>{text}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function CycleView() {
  return (
    <div className="nm-ref">
      <section className="nm-section">
        <h2>Năm cá nhân</h2>
        <p className="muted nm-section-intro">
          Cuộc đời vận hành theo chu kỳ 9 năm. Năm cá nhân = ngày sinh + tháng sinh + năm hiện tại, rút gọn về 1–9.
        </p>
        <ol className="nm-ref-years">
          {PERSONAL_YEARS.map((y) => (
            <li key={y.n}>
              <Numeral n={y.n} size="sm" />
              <div>
                <h3>{y.title}</h3>
                <p>{y.text}</p>
                <p className="nm-focus">Nên tập trung: {y.focus}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="nm-section">
        <h2>Thử thách</h2>
        <p className="muted nm-section-intro">
          Mỗi đỉnh cao đi kèm một con số thử thách (0–8), tính bằng hiệu giữa các thành phần của ngày sinh.
        </p>
        <ul className="nm-ref-years">
          {CHALLENGES.map((c) => (
            <li key={c.n}>
              <Numeral n={c.n} size="sm" />
              <div>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function MethodView() {
  return (
    <div className="nm-ref">
      <section className="nm-section">
        <h2>Bảng quy đổi chữ cái</h2>
        <p className="muted nm-section-intro">
          Tên được bỏ dấu (Đ thành D) rồi quy đổi theo bảng dưới. Nguyên âm gồm A, E, I, O, U và Y.
        </p>
        <div className="nm-letters" role="table" aria-label="Bảng quy đổi chữ cái">
          <div role="row" className="nm-letters-row nm-letters-head">
            {Array.from({ length: 9 }, (_, i) => (
              <span role="columnheader" key={i}>
                {i + 1}
              </span>
            ))}
          </div>
          {[0, 1, 2].map((r) => (
            <div role="row" className="nm-letters-row" key={r}>
              {ALPHABET.slice(r * 9, r * 9 + 9).map((ch) => (
                <span role="cell" key={ch} aria-label={`${ch} bằng ${letterValue(ch)}`}>
                  {ch}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>
      <section className="nm-section">
        <h2>Các chỉ số được tính thế nào</h2>
        <dl className="nm-detail-list">
          <div>
            <dt>Số chủ đạo</dt>
            <dd>
              Cộng tất cả chữ số của ngày sinh, rút gọn cho tới khi còn từ 2 đến 11, hoặc bằng 22. Ví dụ 15/08/1996: 1+5+0+8+1+9+9+6 = 39,
              3+9 = 12, 1+2 = 3.
            </dd>
          </div>
          {INDICATORS.map((ind) => (
            <div key={ind.id}>
              <dt>{ind.name}</dt>
              <dd>
                {ind.how} {ind.about}
              </dd>
            </div>
          ))}
          <div>
            <dt>Đỉnh cao và thử thách</dt>
            <dd>
              Đỉnh 1 = ngày + tháng; đỉnh 2 = ngày + năm; đỉnh 3 = đỉnh 1 + đỉnh 2; đỉnh 4 = tháng + năm (mỗi phần rút gọn trước). Thử
              thách dùng hiệu thay cho tổng. Đỉnh đầu tiên đến ở tuổi 36 trừ số chủ đạo.
            </dd>
          </div>
        </dl>
        <p className="muted nm-note">
          Các chỉ số trong tên giữ nguyên số bậc thầy 11, 22, 33. Có nhiều trường phái tính khác nhau; công cụ này theo cách phổ biến tại
          Việt Nam, dựa trên hệ thống của David A. Phillips.
        </p>
      </section>
    </div>
  );
}
