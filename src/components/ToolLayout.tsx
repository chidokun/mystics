import { Suspense } from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import { accentStyle } from '../tools/accent';
import type { ToolDefinition } from '../tools/types';

export function ToolLayout({ tool }: { tool: ToolDefinition }) {
  const Icon = tool.icon;
  return (
    <div className="tool has-accent" style={accentStyle(tool)}>
      <header className="tool-head">
        <div className="container">
          <Link to="/" className="tool-back">
            Tất cả công cụ
          </Link>
          <div className="tool-title">
            <Icon className="tool-title-icon" />
            <h1>{tool.name}</h1>
          </div>
          <p className="tool-tagline">{tool.tagline}</p>
          <nav className="tabs" aria-label={`Các mục của ${tool.name}`}>
            {tool.sections.map((s) => (
              <NavLink key={s.path} to={`/${tool.slug}/${s.path}`} className="tab">
                {s.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <div className="container">
        <Suspense fallback={<p className="tool-loading muted">Đang mở…</p>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
