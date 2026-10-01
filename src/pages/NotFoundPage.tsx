import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <div className="container not-found">
      <h1>Không có trang này</h1>
      <p className="muted">Đường dẫn có thể đã gõ sai, hoặc công cụ này chưa mở.</p>
      <Link to="/" className="btn btn-ghost">
        Về trang chủ
      </Link>
    </div>
  );
}
