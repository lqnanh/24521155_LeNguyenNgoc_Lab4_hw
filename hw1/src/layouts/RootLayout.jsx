import { NavLink, Outlet } from 'react-router';
import styles from './RootLayout.module.css';

function navClass({ isActive }) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link;
}

export default function RootLayout() {
  return (
    <>
      <a href="#main-content" className={styles.skipLink}>
        Bỏ qua tới nội dung
      </a>

      <header className={styles.header}>
        <p className={styles.brand}>Photo Gallery</p>
        <nav aria-label="Điều hướng chính">
          <ul className={styles.navList}>
            <li>
              <NavLink to="/" end className={navClass}>
                Trang chủ
              </NavLink>
            </li>
            <li>
              <NavLink to="/gallery" className={navClass}>
                Thư viện ảnh
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1} className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}
