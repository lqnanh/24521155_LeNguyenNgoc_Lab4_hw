import { useRef, useState } from 'react';
import styles from './Card.module.css';

const SWIPE_THRESHOLD = 50; // kéo quá 50px mới tính là quẹt
const MAX_ROTATE = 15; // nghiêng tối đa 15 độ

export default function Card({ profile, onSwipe = () => {} }) {
  const { name, age, bio, avatar } = profile;

  const cardRef = useRef(null);
  // Thông tin lần kéo đang diễn ra: { pointerId, startX, startY, dx }
  const dragRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Đặt vị trí thẻ qua biến CSS (không dùng style={{...}} trong JSX)
  function setPosition(x, y) {
    const card = cardRef.current;
    if (!card) return;
    const rotate = Math.max(-MAX_ROTATE, Math.min(MAX_ROTATE, x / 15));
    card.style.setProperty('--drag-x', `${x}px`);
    card.style.setProperty('--drag-y', `${y}px`);
    card.style.setProperty('--drag-rotate', `${rotate}deg`);
  }

  function handlePointerDown(event) {
    if (dragRef.current) return; // đang kéo bằng một ngón khác
    if (event.pointerType === 'mouse' && event.button !== 0) return; // chỉ chuột trái

    // Giữ sự kiện cho thẻ, kể cả khi chuột/ngón tay ra ngoài thẻ
    event.currentTarget.setPointerCapture(event.pointerId);

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      dx: 0,
    };
    setIsDragging(true);
  }

  function handlePointerMove(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    drag.dx = event.clientX - drag.startX;
    setPosition(drag.dx, event.clientY - drag.startY);
  }

  function handlePointerUp(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startX;
    dragRef.current = null;
    setIsDragging(false);

    if (dx > SWIPE_THRESHOLD) {
      onSwipe('LIKE');
    } else if (dx < -SWIPE_THRESHOLD) {
      onSwipe('NOPE');
    } else {
      setPosition(0, 0); // chưa đủ xa thì quay về chỗ cũ
    }
  }

  // Trình duyệt huỷ thao tác giữa chừng (ví dụ có cuộc gọi đến): chỉ đưa thẻ về
  function handlePointerCancel(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    dragRef.current = null;
    setIsDragging(false);
    setPosition(0, 0);
  }

  const className = isDragging ? `${styles.card} ${styles.dragging}` : styles.card;

  return (
    <article
      ref={cardRef}
      className={className}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <span className={styles.avatar} role="img" aria-label={`Ảnh đại diện của ${name}`}>
        {avatar}
      </span>
      <h2 className={styles.name}>
        {name}, <span className={styles.age}>{age}</span>
      </h2>
      <p className={styles.bio}>{bio}</p>
    </article>
  );
}
