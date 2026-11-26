import { useEffect, useState } from 'react';
import Card from './Card.jsx';
import styles from './SwipeDeck.module.css';

const KEY_TO_ACTION = {
  ArrowLeft: 'NOPE',
  ArrowRight: 'LIKE',
  ArrowUp: 'SUPERLIKE',
};

const ACTION_LABEL = {
  NOPE: 'bỏ qua',
  LIKE: 'thích',
  SUPERLIKE: 'siêu thích',
};

// Những người chưa bị quẹt, theo đúng thứ tự server trả về
function getRemainingProfiles(profiles, swipes) {
  const swipedIds = new Set(swipes.map((swipe) => swipe.profileId));
  return profiles.filter((profile) => !swipedIds.has(profile._id));
}

// Đang gõ chữ trong ô nhập thì không bắt phím mũi tên
function isTypingTarget(target) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  );
}

export default function SwipeDeck({ profiles = [] }) {
  // Mỗi phần tử: { profileId, action }
  const [swipes, setSwipes] = useState([]);

  // Tính ra mỗi lần vẽ lại, không lưu thành state riêng
  const remainingProfiles = getRemainingProfiles(profiles, swipes);
  const currentProfile = remainingProfiles[0] ?? null;

  const lastSwipe = swipes.at(-1);
  const lastProfile = lastSwipe
    ? profiles.find((profile) => profile._id === lastSwipe.profileId)
    : null;

  useEffect(() => {
    function handleKeyDown(event) {
      const action = KEY_TO_ACTION[event.key];
      if (!action) return;
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (isTypingTarget(event.target)) return;

      // Chặn trang cuộn khi bấm mũi tên
      event.preventDefault();

      // Giữ phím thì không quẹt liên tục
      if (event.repeat) return;

      // Tính người tiếp theo từ danh sách mới nhất (prev),
      // nên bấm nhanh cũng không quẹt trùng một người
      setSwipes((prev) => {
        const [next] = getRemainingProfiles(profiles, prev);
        if (!next) return prev;
        return [...prev, { profileId: next._id, action }];
      });
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [profiles]);

  return (
    <section className={styles.deck} aria-label="Bộ thẻ">
      <p className={styles.hint}>← Bỏ qua · → Thích · ↑ Siêu thích</p>

      {currentProfile ? (
        <Card key={currentProfile._id} profile={currentProfile} />
      ) : (
        <p className={styles.empty}>Hết người để quẹt rồi! 🎉</p>
      )}

      <p className={styles.status} aria-live="polite">
        {lastProfile ? `Vừa ${ACTION_LABEL[lastSwipe.action]}: ${lastProfile.name}` : ''}
      </p>

      <p className={styles.count}>
        Đã quẹt {swipes.length}/{profiles.length}
      </p>
    </section>
  );
}
