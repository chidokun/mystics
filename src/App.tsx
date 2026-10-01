import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { ToolLayout } from './components/ToolLayout';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LIVE_TOOLS } from './tools/registry';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      {/* HashRouter dùng phần # cho đường dẫn, nên bỏ qua tới nội dung bằng cách đặt focus */}
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        Bỏ qua tới nội dung
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route index element={<HomePage />} />
          {LIVE_TOOLS.map((tool) => (
            <Route key={tool.slug} path={tool.slug} element={<ToolLayout tool={tool} />}>
              <Route index element={<Navigate to={tool.sections[0].path} replace />} />
              {tool.sections.map((section) => (
                <Route key={section.path} path={`${section.path}/*`} element={<section.component />} />
              ))}
            </Route>
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </HashRouter>
  );
}
