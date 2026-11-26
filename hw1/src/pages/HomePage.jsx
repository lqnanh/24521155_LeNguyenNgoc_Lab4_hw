import { Link } from 'react-router';

export default function HomePage() {
  return (
    <>
      <h1>Chào mừng đến Photo Gallery</h1>
      <p>Xem bộ sưu tập ảnh theo từng chủ đề.</p>
      <Link to="/gallery">Vào thư viện ảnh</Link>
    </>
  );
}
