import { Link, useParams } from 'react-router';
import { ElementCycle } from '../components/ElementCycle';
import { ELEMENT_ORDER, ELEMENTS } from '../data/elements';
import { BRANCHES, ganzhiName, NAP_AM, STEMS } from '../data/ganzhi';
import { TEN_GODS, type TenGod } from '../data/gods';
import { LOOKUP_PATH } from '../paths';
import '../batu.css';

const VIEWS = [
  { path: 'can', label: 'Thiên can' },
  { path: 'chi', label: 'Địa chi' },
  { path: 'ngu-hanh', label: 'Ngũ hành' },
  { path: 'thap-than', label: 'Thập thần' },
  { path: 'hoa-giap', label: 'Sáu mươi hoa giáp' },
  { path: 'cach-tinh', label: 'Cách tính' },
] as const;

export default function LookupPage() {
  const { '*': rest = '' } = useParams();
  const view = VIEWS.some((v) => v.path === rest) ? rest : 'can';

  return (
    <div className="bt-lookup">
      <nav className="bt-subnav" aria-label="Mục tra cứu">
        {VIEWS.map((v) => (
          <Link key={v.path} to={`${LOOKUP_PATH}/${v.path}`} className="chip" aria-current={view === v.path ? 'page' : undefined}>
            {v.label}
          </Link>
        ))}
      </nav>
      {view === 'chi' ? (
        <BranchView />
      ) : view === 'ngu-hanh' ? (
        <ElementView />
      ) : view === 'thap-than' ? (
        <GodView />
      ) : view === 'hoa-giap' ? (
        <CycleView />
      ) : view === 'cach-tinh' ? (
        <MethodView />
      ) : (
        <StemView />
      )}
    </div>
  );
}

function StemView() {
  return (
    <ul className="bt-cards">
      {STEMS.map((s) => (
        <li key={s.index} className="frame">
          <div className="bt-card-head">
            <span className={`bt-card-char bt-el--${s.element}`}>{s.name}</span>
            <span>
              <strong>
                {s.yang ? 'Dương' : 'Âm'} {ELEMENTS[s.element].name}
              </strong>
              <span className="bt-sub">{s.image}</span>
            </span>
          </div>
          <p>{s.nature}</p>
          <dl className="bt-mini">
            <div>
              <dt>Điểm mạnh</dt>
              <dd>{s.strengths}</dd>
            </div>
            <div>
              <dt>Cần lưu ý</dt>
              <dd>{s.cautions}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}

function BranchView() {
  return (
    <div className="bt-table-scroll">
      <table className="bt-table">
        <thead>
          <tr>
            <th scope="col">Địa chi</th>
            <th scope="col">Con giáp</th>
            <th scope="col">Ngũ hành</th>
            <th scope="col">Tàng can</th>
            <th scope="col">Giờ</th>
            <th scope="col">Tháng</th>
          </tr>
        </thead>
        <tbody>
          {BRANCHES.map((b) => (
            <tr key={b.index}>
              <th scope="row">
                <span className={`bt-el--${b.element}`}>{b.name}</span>
              </th>
              <td>{b.animal}</td>
              <td>
                {b.yang ? 'Dương' : 'Âm'} {ELEMENTS[b.element].name}
              </td>
              <td>
                {b.hidden.map((h, i) => (
                  <span key={h} className={`bt-el--${STEMS[h].element}${i === 0 ? ' bt-strong' : ''}`}>
                    {STEMS[h].name}
                    {i < b.hidden.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </td>
              <td>{b.hours}</td>
              <td>{b.month}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted bt-note">Tàng can in đậm là chủ khí, mạnh nhất trong chi; các can sau là trung khí và dư khí.</p>
    </div>
  );
}

function ElementView() {
  return (
    <div className="bt-element-view">
      <ElementCycle />
      <ul className="bt-cards">
        {ELEMENT_ORDER.map((e) => {
          const info = ELEMENTS[e];
          return (
            <li key={e} className="frame">
              <div className="bt-card-head">
                <span className={`bt-card-char bt-el--${e}`}>{info.name}</span>
                <span className="bt-sub">{info.nature}</span>
              </div>
              <p>{info.traits}</p>
              <dl className="bt-mini">
                <div>
                  <dt>Mùa</dt>
                  <dd>{info.season}</dd>
                </div>
                <div>
                  <dt>Hướng</dt>
                  <dd>{info.direction}</dd>
                </div>
                <div>
                  <dt>Màu sắc</dt>
                  <dd>{info.colors}</dd>
                </div>
                <div>
                  <dt>Tạng phủ</dt>
                  <dd>{info.organs}</dd>
                </div>
                <div>
                  <dt>Nghề nghiệp</dt>
                  <dd>{info.careers}</dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function GodView() {
  return (
    <dl className="bt-god-list">
      {(Object.keys(TEN_GODS) as TenGod[]).map((g) => {
        const info = TEN_GODS[g];
        return (
          <div key={g}>
            <dt>
              {info.name}
              <span className="bt-sub">{info.relation}</span>
            </dt>
            <dd>
              <p>{info.meaning}</p>
              <p className="muted">Khi nổi bật: {info.strong}</p>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

function CycleView() {
  return (
    <div className="bt-table-scroll">
      <table className="bt-table bt-table--cycle">
        <thead>
          <tr>
            <th scope="col">Cặp can chi</th>
            <th scope="col">Nạp âm</th>
            <th scope="col">Ý nghĩa</th>
            <th scope="col">Các năm gần đây</th>
          </tr>
        </thead>
        <tbody>
          {NAP_AM.map((n, i) => {
            // Mỗi cặp can chi lặp lại sau 60 năm
            const years = [i * 2, i * 2 + 1].map((g) => `${1924 + g}, ${1984 + g}`).join('; ');
            return (
              <tr key={n.name}>
                <th scope="row">
                  {ganzhiName(i * 2)}, {ganzhiName(i * 2 + 1)}
                </th>
                <td>
                  <span className={`bt-el--${n.element}`}>{n.name}</span>
                </td>
                <td>{n.meaning}</td>
                <td>{years}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MethodView() {
  return (
    <dl className="bt-god-list">
      <div>
        <dt>Trụ năm</dt>
        <dd>
          Năm Bát Tự bắt đầu ở tiết Lập Xuân (khoảng 4/2 dương lịch), không phải mùng 1 Tết. Người sinh giữa Tết và Lập Xuân, hay giữa Lập
          Xuân và Tết, có thể mang can chi năm khác với tuổi âm lịch thường gọi.
        </dd>
      </div>
      <div>
        <dt>Trụ tháng</dt>
        <dd>
          Tháng đổi ở 12 tiết: Lập Xuân, Kinh Trập, Thanh Minh, Lập Hạ, Mang Chủng, Tiểu Thử, Lập Thu, Bạch Lộ, Hàn Lộ, Lập Đông, Đại Tuyết,
          Tiểu Hàn. Công cụ tính vị trí mặt trời đúng lúc sinh, sai số chỉ vài phút. Can tháng suy ra từ can năm theo phép Ngũ Hổ Độn.
        </dd>
      </div>
      <div>
        <dt>Trụ ngày</dt>
        <dd>Đếm vòng 60 hoa giáp liên tục theo số ngày Julius. Giờ Tý bắt đầu lúc 23h, nên người sinh từ 23h được tính sang ngày hôm sau.</dd>
      </div>
      <div>
        <dt>Trụ giờ</dt>
        <dd>Mười hai canh giờ, mỗi canh hai tiếng, bắt đầu từ giờ Tý (23h–1h). Can giờ suy ra từ can ngày theo phép Ngũ Thử Độn.</dd>
      </div>
      <div>
        <dt>Âm lịch</dt>
        <dd>Đổi ngày âm dương lịch theo thuật toán của Hồ Ngọc Đức với múi giờ UTC+7, đúng với lịch Việt Nam hiện hành.</dd>
      </div>
      <div>
        <dt>Ngũ hành và thân vượng, nhược</dt>
        <dd>
          Mỗi thiên can tính 1 điểm; tàng can trong địa chi tính 1, 0,5 và 0,3 điểm theo chủ khí, trung khí, dư khí; chi tháng nhân 1,5.
          Nhật chủ vượng khi hành của mình cùng hành sinh ra mình chiếm từ 52% trở lên, nhược khi từ 40% trở xuống.
        </dd>
      </div>
      <div>
        <dt>Đại vận</dt>
        <dd>
          Nam sinh năm can dương và nữ sinh năm can âm đi vận thuận; ngược lại đi vận nghịch. Số ngày từ lúc sinh đến tiết gần nhất theo
          chiều vận, chia 3, ra tuổi khởi vận.
        </dd>
      </div>
    </dl>
  );
}
