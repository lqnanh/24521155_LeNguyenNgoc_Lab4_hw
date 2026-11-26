import styles from './GallerySkeleton.module.css';

const TILE_IDS = Array.from({ length: 12 }, (_, i) => `tile-${i}`);
const CHIP_IDS = ['chip-all', 'chip-1', 'chip-2', 'chip-3', 'chip-4'];

export default function GallerySkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" className={styles.wrapper}>
      <span className={styles.srOnly}>Đang tải thư viện ảnh…</span>

      <div className={styles.title} />
      <div className={styles.chips}>
        {CHIP_IDS.map((id) => (
          <div key={id} className={styles.chip} />
        ))}
      </div>
      <div className={styles.grid}>
        {TILE_IDS.map((id) => (
          <div key={id} className={styles.tile} />
        ))}
      </div>
    </div>
  );
}
