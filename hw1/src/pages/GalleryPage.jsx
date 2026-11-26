import { Link, useSearchParams } from 'react-router';
import { CATEGORIES, photos } from '../data/photos.js';
import styles from './GalleryPage.module.css';

const FILTERS = [{ slug: null, label: 'Tất cả' }, ...CATEGORIES];
const EAGER_COUNT = 4;

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

  function photoLink(photoId) {
    const next = new URLSearchParams(searchParams);
    next.set('photoId', photoId);
    return { pathname: '/gallery', search: `?${next}` };
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

      <ul className={styles.grid}>
        {visiblePhotos.map((photo, position) => (
          <li key={photo.id}>
            <Link to={photoLink(photo.id)} className={styles.card}>
              <img
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading={position < EAGER_COUNT ? 'eager' : 'lazy'}
                decoding="async"
                className={styles.image}
              />
              <span className={styles.caption}>{photo.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
