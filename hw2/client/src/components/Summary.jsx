import { useEffect, useId, useRef } from 'react';
import { getVerdict } from '../verdicts.js';
import styles from './Summary.module.css';

const ROWS = [
  { action: 'LIKE', icon: '♥', label: 'Thích' },
  { action: 'SUPERLIKE', icon: '★', label: 'Siêu thích' },
  { action: 'NOPE', icon: '✕', label: 'Bỏ qua' },
];

export default function Summary({
  score = 0,
  counts = { LIKE: 0, SUPERLIKE: 0, NOPE: 0 },
  onRestart = () => {},
}) {
  const titleId = useId();
  const headingRef = useRef(null);

  // Hiện màn tổng kết thì đưa focus vào tiêu đề,
  // để trình đọc màn hình đọc "Tổng kết" ngay
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section className={styles.summary} aria-labelledby={titleId}>
      <h2 id={titleId} ref={headingRef} tabIndex={-1} className={styles.title}>
        Tổng kết
      </h2>

      <p className={styles.total}>
        <span className={styles.totalValue}>{score}</span> điểm
      </p>

      <ul className={styles.counts}>
        {ROWS.map((row) => (
          <li key={row.action} className={`${styles.countItem} ${styles[row.action]}`}>
            <span className={styles.icon} aria-hidden="true">
              {row.icon}
            </span>
            <span className={styles.countLabel}>{row.label}</span>
            <span className={styles.countValue}>{counts[row.action] ?? 0}</span>
          </li>
        ))}
      </ul>

      <p className={styles.verdict}>{getVerdict(score)}</p>

      <button type="button" className={styles.restart} onClick={onRestart}>
        Chơi lại
      </button>
    </section>
  );
}
