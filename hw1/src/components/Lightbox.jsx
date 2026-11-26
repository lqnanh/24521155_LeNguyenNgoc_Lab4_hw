import { useEffect, useId, useRef } from 'react';
import styles from './Lightbox.module.css';

export default function Lightbox({ photo = null, onClose }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (photo && !dialog.open) {
      dialog.showModal();
    } else if (!photo && dialog.open) {
      dialog.close();
    }
  }, [photo]);

  function handleCloseClick() {
    dialogRef.current?.close();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={photo ? titleId : undefined}
      onClose={onClose}
      className={styles.dialog}
    >
      {photo && (
        <>
          <div className={styles.header}>
            <h2 id={titleId} className={styles.title}>
              {photo.title}
            </h2>
            <button
              type="button"
              aria-label="Đóng ảnh"
              className={styles.closeButton}
              onClick={handleCloseClick}
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>
          <img
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className={styles.image}
          />
        </>
      )}
    </dialog>
  );
}
