import { Link, NavLink, Outlet } from 'react-router';
import { useDossierList } from '../hooks/useDossierList.js';
import styles from './Layout.module.css';

function navClass({ isActive }) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link;
}

export default function Layout() {
  const { players } = useDossierList();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link to="/" className={styles.brand}>
            Tòa phúc thẩm Fair-Play Esports
          </Link>
          <nav aria-label="Điều hướng chính">
            <ul className={styles.nav}>
              <li>
                <NavLink to="/" end className={navClass}>
                  Danh sách hồ sơ
                </NavLink>
              </li>
              {players.map((p) => (
                <li key={p.playerId}>
                  <NavLink to={`/dossier/${p.playerId}`} className={navClass}>
                    {p.displayName}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}
