import useProfiles from './hooks/useProfiles.js';
import SwipeDeck from './components/SwipeDeck.jsx';
import styles from './App.module.css';

export default function App() {
  const { profiles, loading, error } = useProfiles();

  return (
    <main className={styles.app}>
      <h1 className={styles.title}>Hẹn hò nhưng không yêu</h1>

      {loading && <p className={styles.message}>Đang tải...</p>}

      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      {!loading && !error && <SwipeDeck profiles={profiles} />}
    </main>
  );
}
