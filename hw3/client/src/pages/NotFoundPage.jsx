import { Link } from 'react-router';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <section className={styles.box}>
      <title>404 – Không tìm thấy trang | Fair-Play Esports</title>
      <h1 className={styles.code}>404</h1>
      <p className={styles.text}>Không tìm thấy trang bạn yêu cầu.</p>
      <Link to="/">Về danh sách hồ sơ</Link>
    </section>
  );
}
