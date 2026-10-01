import { Link, NavLink } from 'react-router';
import { accentStyle } from '../tools/accent';
import { LIVE_TOOLS } from '../tools/registry';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link to="/" className="wordmark" aria-label="Huyền Cơ, về trang chủ">
          <svg viewBox="0 0 32 32" className="wordmark-mark" aria-hidden="true">
            <rect x="8.5" y="4.5" width="15" height="23" rx="1.5" fill="none" stroke="currentColor" />
            <path d="M16 10.5L19.5 16L16 21.5L12.5 16Z" fill="var(--son)" />
          </svg>
          <span>Huyền Cơ</span>
        </Link>
        <nav aria-label="Công cụ" className="site-nav">
          {LIVE_TOOLS.map((tool) => (
            <NavLink key={tool.slug} to={`/${tool.slug}`} className="has-accent" style={accentStyle(tool)}>
              {tool.navLabel ?? tool.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
