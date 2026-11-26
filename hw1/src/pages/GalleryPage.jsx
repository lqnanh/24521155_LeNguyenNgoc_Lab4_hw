import { useSearchParams } from 'react-router';
import { CATEGORIES, photos } from '../data/photos.js';
import styles from './GalleryPage.module.css';

const FILTERS = [{ slug: null, label: 'Tất cả' }, ...CATEGORIES];

export default function GalleryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawCategory = searchParams.get('category');
  const activeCategory = CATEGORIES.some((c) => c.slug === rawCategory)
    ? rawCategory
    : null;

  const visiblePhotos = activeCategory
    ? photos.filter((photo) => photo.category === activeCategory)
    : photos;

  function selectCategory(slug) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (slug) {
        next.set('category', slug);
      } else {
        next.delete('category');
      }
      return next;
    });
  }

  return (
    <>
      <h1 className={styles.title}>Thư viện ảnh</h1>

      <div role="group" aria-label="Lọc theo chủ đề" className={styles.filters}>
        {FILTERS.map((filter) => (
          <button
            key={filter.slug ?? 'all'}
            type="button"
            aria-pressed={activeCategory === filter.slug}
            className={styles.filterButton}
            onClick={() => selectCategory(filter.slug)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <p aria-live="polite" className={styles.count}>
        Đang hiện {visiblePhotos.length} ảnh
      </p>

      <ul className={styles.list}>
        {visiblePhotos.map((photo) => (
          <li key={photo.id}>{photo.title}</li>
        ))}
      </ul>
    </>
  );
}
