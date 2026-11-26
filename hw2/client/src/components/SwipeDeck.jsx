import { useCallback, useEffect, useReducer } from 'react';
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

// Thêm một lần quẹt cho người tiếp theo. Hết người thì giữ nguyên.
function appendSwipe(prevSwipes, profiles, action) {
  const [next] = getRemainingProfiles(profiles, prevSwipes);
  if (!next) return prevSwipes;
  return [...prevSwipes, { profileId: next._id, action }];
}

// Đang gõ chữ trong ô nhập thì không bắt phím
function isTypingTarget(target) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  );
}

const initialState = {
  swipes: [], // chồng đĩa: phần tử cuối là lần quẹt mới nhất
  undoneProfileId: null, // người vừa được hoàn tác (để hiện thông báo)
};

function deckReducer(state, command) {
  switch (command.type) {
    case 'swipe': {
      const swipes = appendSwipe(state.swipes, command.profiles, command.action);
      if (swipes === state.swipes) return state; // hết người
      return { swipes, undoneProfileId: null };
    }
    case 'undo': {
      if (state.swipes.length === 0) return state; // chưa quẹt gì
      const top = state.swipes.at(-1); // lấy đĩa trên cùng ra
      return { swipes: state.swipes.slice(0, -1), undoneProfileId: top.profileId };
    }
    default:
      return state;
  }
}

export default function SwipeDeck({ profiles = [] }) {
  const [state, dispatch] = useReducer(deckReducer, initialState);
  const { swipes, undoneProfileId } = state;

  // Tính ra mỗi lần vẽ lại, không lưu thành state riêng
  const remainingProfiles = getRemainingProfiles(profiles, swipes);
  const currentProfile = remainingProfiles[0] ?? null;

  const canSwipe = currentProfile !== null;
  const canUndo = swipes.length > 0;

  const lastSwipe = swipes.at(-1);
  const findProfile = (id) => profiles.find((profile) => profile._id === id);

  let statusText = '';
  if (undoneProfileId) {
    statusText = `Đã hoàn tác: ${findProfile(undoneProfileId)?.name ?? ''}`;
  } else if (lastSwipe) {
    statusText = `Vừa ${ACTION_LABEL[lastSwipe.action]}: ${findProfile(lastSwipe.profileId)?.name ?? ''}`;
  }

  // Cách quẹt dùng chung cho phím, kéo thẻ và nút bấm
  const swipe = useCallback(
    (action) => dispatch({ type: 'swipe', action, profiles }),
    [profiles]
  );

  const undo = useCallback(() => dispatch({ type: 'undo' }), []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (isTypingTarget(event.target)) return;

      if (event.key === 'Backspace') {
        event.preventDefault();
        if (event.repeat) return; // giữ phím thì không hoàn tác liên tục
        undo();
        return;
      }

      const action = KEY_TO_ACTION[event.key];
      if (!action) return;

      // Chặn trang cuộn khi bấm mũi tên
      event.preventDefault();

      // Giữ phím thì không quẹt liên tục
      if (event.repeat) return;

      swipe(action);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [swipe, undo]);

  return (
    <section className={styles.deck} aria-label="Bộ thẻ">
      <p className={styles.hint}>
        Kéo thẻ hoặc bấm phím: ← Bỏ qua · → Thích · ↑ Siêu thích · Backspace Hoàn tác
      </p>

      {currentProfile ? (
        <Card key={currentProfile._id} profile={currentProfile} onSwipe={swipe} />
      ) : (
        <p className={styles.empty}>Hết người để quẹt rồi! 🎉</p>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.button} ${styles.nope}`}
          aria-label="Bỏ qua"
          disabled={!canSwipe}
          onClick={() => swipe('NOPE')}
        >
          <span aria-hidden="true">✕</span>
        </button>

        <button
          type="button"
          className={`${styles.button} ${styles.superlike}`}
          aria-label="Siêu thích"
          disabled={!canSwipe}
          onClick={() => swipe('SUPERLIKE')}
        >
          <span aria-hidden="true">★</span>
        </button>

        <button
          type="button"
          className={`${styles.button} ${styles.like}`}
          aria-label="Thích"
          disabled={!canSwipe}
          onClick={() => swipe('LIKE')}
        >
          <span aria-hidden="true">♥</span>
        </button>

        <button
          type="button"
          className={`${styles.button} ${styles.undo}`}
          aria-label="Hoàn tác"
          disabled={!canUndo}
          onClick={undo}
        >
          <span aria-hidden="true">↶</span>
        </button>
      </div>

      <p className={styles.status} aria-live="polite">
        {statusText}
      </p>

      <p className={styles.count}>
        Đã quẹt {swipes.length}/{profiles.length}
      </p>
    </section>
  );
}
