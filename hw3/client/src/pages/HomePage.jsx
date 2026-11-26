import { Link, useOutletContext } from 'react-router';
import { formatDateTime } from '../format.js';
import styles from './HomePage.module.css';

export default function HomePage() {
  // Dữ liệu do Layout tải sẵn (không gọi server lần nữa)
  const { players, loading, error } = useOutletContext();

  return (
    <section>
      <title>Danh sách hồ sơ | Fair-Play Esports</title>
      <h1 className={styles.title}>Danh sách hồ sơ kỷ luật</h1>

      {loading && <p role="status">Đang tải danh sách…</p>}

      {error && (
        <p role="alert" className={styles.alert}>
          {error}
        </p>
      )}

      {!loading && !error && players.length === 0 && <p>Chưa có hồ sơ nào.</p>}

      {players.length > 0 && (
        <ul className={styles.list}>
          {players.map((p) => (
            <li key={p.playerId}>
              <Link to={`/dossier/${p.playerId}`} className={styles.card}>
                <span className={styles.name}>{p.displayName}</span>
                <span className={styles.meta}>Đội: {p.team}</span>
                <span className={styles.meta}>
                  Hạn kháng cáo:{' '}
                  <time dateTime={p.appealDeadline}>{formatDateTime(p.appealDeadline)}</time>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
