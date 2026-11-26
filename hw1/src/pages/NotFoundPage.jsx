import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <>
      <h1>404 – Không tìm thấy trang</h1>
      <p>Trang bạn tìm không tồn tại hoặc đã bị di chuyển.</p>
      <Link to="/">Về trang chủ</Link>
    </>
  );
}
