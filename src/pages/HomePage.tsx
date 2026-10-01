import { Link } from 'react-router';
import { DailyCard } from '../components/home/DailyCard';
import { LIVE_TOOLS, UPCOMING_TOOLS } from '../tools/registry';
import { accentStyle } from '../tools/accent';
import type { ToolDefinition } from '../tools/types';

export function HomePage() {
  return (
    <>
      <section className="home-hero container">
        <div className="home-hero-text">
          <h1>Hỏi lá bài, đọc con số.</h1>
          <p>
            Trải bài Lenormand và lập bảng thần số học Pythagoras ngay trên trình duyệt. Không cần tài khoản, dữ liệu của bạn không rời
            khỏi máy.
          </p>
        </div>
        <DailyCard />
      </section>

      <section className="home-tools container" aria-labelledby="home-tools-title">
        <h2 id="home-tools-title">Công cụ</h2>
        <ul className="tool-panels">
          {LIVE_TOOLS.map((tool) => (
            <ToolPanel key={tool.slug} tool={tool} />
          ))}
        </ul>
        {UPCOMING_TOOLS.length > 0 && (
          <div className="tool-upcoming">
            <h3>Đang chuẩn bị</h3>
            <ul>
              {UPCOMING_TOOLS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <li key={tool.slug} className="has-accent" style={accentStyle(tool)}>
                    <Icon className="tool-upcoming-icon" />
                    <span>
                      <strong>{tool.name}</strong>
                      <span className="muted">{tool.tagline}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}

function ToolPanel({ tool }: { tool: ToolDefinition }) {
  const Icon = tool.icon;
  return (
    <li className="tool-panel frame has-accent" style={accentStyle(tool)}>
      <Link to={`/${tool.slug}`} className="tool-panel-head">
        <Icon className="tool-panel-icon" />
        <h3>{tool.name}</h3>
      </Link>
      <p className="tool-panel-tagline">{tool.tagline}</p>
      <ul className="tool-panel-sections">
        {tool.sections.map((s) => (
          <li key={s.path}>
            <Link to={`/${tool.slug}/${s.path}`}>{s.label}</Link>
            <span>{s.summary}</span>
          </li>
        ))}
      </ul>
    </li>
  );
}
