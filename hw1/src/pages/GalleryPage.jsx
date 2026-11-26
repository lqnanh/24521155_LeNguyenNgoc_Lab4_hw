import { useRef } from 'react';
import { Link, useSearchParams } from 'react-router';
import { CATEGORIES, photos } from '../data/photos.js';
import Lightbox from '../components/Lightbox.jsx';
import styles from './GalleryPage.module.css';

const FILTERS = [{ slug: null, label: 'Tất cả' }, ...CATEGORIES];
const EAGER_COUNT = 4;

export default function GalleryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const linkRefs = useRef(new Map());

  const rawCategory = searchParams.get('category');
  const activeCategory = CATEGORIES.some((c) => c.slug === rawCategory)
    ? rawCategory
    : null;

  const visiblePhotos = activeCategory
    ? photos.filter((photo) => photo.category === activeCategory)
    : photos;

  const photoId = searchParams.get('photoId');
  const activePhoto = photoId
    ? photos.find((photo) => photo.id === photoId) ?? null
    : null;
  const isInvalidPhotoId = photoId !== null && activePhoto === null;

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

  function photoLink(id) {
    const next = new URLSearchParams(searchParams);
    next.set('photoId', id);
    return { pathname: '/gallery', search: `?${next}` };
  }

  function removePhotoId() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('photoId');
      return next;
    });
  }

  function closePhoto() {
    if (!photoId) return;
    const closedId = photoId;
    removePhotoId();
    linkRefs.current.get(closedId)?.focus();
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

      {isInvalidPhotoId && (
        <div role="alert" className={styles.alert}>
          <p className={styles.alertText}>
            Không tìm thấy ảnh “{photoId}”. Có thể đường dẫn bị sai hoặc ảnh đã bị xoá.
          </p>
          <button
            type="button"
            className={styles.alertButton}
            onClick={removePhotoId}
          >
            Bỏ qua
          </button>
        </div>
      )}

      <p aria-live="polite" className={styles.count}>
        Đang hiện {visiblePhotos.length} ảnh
      </p>

      <ul className={styles.grid}>
        {visiblePhotos.map((photo, position) => (
          <li key={photo.id}>
            <Link
              to={photoLink(photo.id)}
              className={styles.card}
              ref={(node) => {
                linkRefs.current.set(photo.id, node);
                return () => linkRefs.current.delete(photo.id);
              }}
            >
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

      <Lightbox photo={activePhoto} onClose={closePhoto} />
    </>
  );
}
