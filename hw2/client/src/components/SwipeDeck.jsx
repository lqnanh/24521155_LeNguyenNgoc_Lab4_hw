import { useCallback, useEffect, useRef, useState } from 'react';
import Card from './Card.jsx';
import { createSwipe, deleteSwipe } from '../api.js';
import { calculateScore, formatPoints, getPoints } from '../scoring.js';
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
// serverId = null nghĩa là server chưa trả _id về.
function appendSwipe(prevSwipes, profiles, action, localId) {
  const [next] = getRemainingProfiles(profiles, prevSwipes);
  if (!next) return prevSwipes;
  return [...prevSwipes, { localId, profileId: next._id, action, serverId: null }];
}

function findEntry(state, localId) {
  return state.swipes.find((swipe) => swipe.localId === localId) ?? null;
}

// Đang gõ chữ trong ô nhập thì không bắt phím
function isTypingTarget(target) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  );
}

const initialState = {
  // Chồng đĩa: phần tử cuối là lần quẹt mới nhất.
  // Mỗi phần tử: { localId, profileId, action, serverId }
  swipes: [],
  undoneSwipe: null, // lần quẹt vừa được hoàn tác (để hiện thông báo)
};

function deckReducer(state, command) {
  switch (command.type) {
    case 'swipe': {
      const swipes = appendSwipe(state.swipes, command.profiles, command.action, command.localId);
      if (swipes === state.swipes) return state; // hết người
      return { swipes, undoneSwipe: null };
    }
    case 'saved': {
      // Server trả _id về: gắn vào đúng lần quẹt đó
      if (!findEntry(state, command.localId)) return state;
      const swipes = state.swipes.map((swipe) =>
        swipe.localId === command.localId ? { ...swipe, serverId: command.serverId } : swipe
      );
      return { ...state, swipes };
    }
    case 'remove': {
      // POST lỗi: bỏ lần quẹt đó ra, thẻ quay lại
      if (!findEntry(state, command.localId)) return state;
      const swipes = state.swipes.filter((swipe) => swipe.localId !== command.localId);
      return { swipes, undoneSwipe: null };
    }
    case 'undo': {
      if (state.swipes.length === 0) return state; // chưa quẹt gì
      const top = state.swipes.at(-1); // lấy đĩa trên cùng ra
      return { swipes: state.swipes.slice(0, -1), undoneSwipe: top };
    }
    case 'restore': {
      // DELETE lỗi: đặt lần quẹt trở lại đúng chỗ cũ trong chồng
      const { entry } = command;
      const alreadySwiped = state.swipes.some((swipe) => swipe.profileId === entry.profileId);
      if (alreadySwiped) return state;
      const swipes = [...state.swipes, entry].sort((a, b) => a.localId - b.localId);
      return { swipes, undoneSwipe: null };
    }
    default:
      return state;
  }
}

export default function SwipeDeck({ profiles = [] }) {
  // stateRef luôn giữ trạng thái mới nhất, đọc được ngay trong hàm xử lý.
  // state là bản sao để React vẽ lại màn hình.
  const stateRef = useRef(initialState);
  const [state, setState] = useState(initialState);
  const nextLocalIdRef = useRef(1);
  const [error, setError] = useState(null);

  const { swipes, undoneSwipe } = state;

  // Tất cả tính ra mỗi lần vẽ lại, không lưu thành state riêng
  const remainingProfiles = getRemainingProfiles(profiles, swipes);
  const currentProfile = remainingProfiles[0] ?? null;
  const score = calculateScore(swipes);

  const canSwipe = currentProfile !== null;
  const canUndo = swipes.length > 0;

  const lastSwipe = swipes.at(-1);
  const findName = (id) => profiles.find((profile) => profile._id === id)?.name ?? '';

  // Một dòng thông báo duy nhất cho trình đọc màn hình (gồm cả điểm),
  // nên không bị đọc 2 lần
  let statusText = '';
  if (undoneSwipe) {
    const points = -getPoints(undoneSwipe.action);
    statusText = `Đã hoàn tác: ${findName(undoneSwipe.profileId)} (${formatPoints(points)} điểm). Tổng: ${score} điểm.`;
  } else if (lastSwipe) {
    const points = getPoints(lastSwipe.action);
    statusText = `Vừa ${ACTION_LABEL[lastSwipe.action]}: ${findName(lastSwipe.profileId)} (${formatPoints(points)} điểm). Tổng: ${score} điểm.`;
  }

  // Chạy reducer ngay trên trạng thái mới nhất, rồi báo React vẽ lại
  const apply = useCallback((command) => {
    const next = deckReducer(stateRef.current, command);
    if (next !== stateRef.current) {
      stateRef.current = next;
      setState(next);
    }
    return next;
  }, []);

  // Xoá trên server. 404 = server đã không còn bản ghi, coi như xoá xong.
  const deleteOnServer = useCallback(
    async (entry) => {
      try {
        await deleteSwipe(entry.serverId);
      } catch (err) {
        if (err.status === 404) return;
        setError(`Không hoàn tác được. ${err.message}`);
        apply({ type: 'restore', entry });
      }
    },
    [apply]
  );

  // Cách quẹt dùng chung cho phím, kéo thẻ và nút bấm
  const swipe = useCallback(
    async (action) => {
      const localId = nextLocalIdRef.current++;
      const before = stateRef.current;
      const after = apply({ type: 'swipe', action, profiles, localId });
      if (after === before) return; // hết người

      setError(null); // quẹt tiếp thì ẩn lỗi cũ
      const entry = after.swipes.at(-1);

      try {
        const saved = await createSwipe({ profileId: entry.profileId, action });

        if (findEntry(stateRef.current, localId)) {
          apply({ type: 'saved', localId, serverId: saved._id });
        } else {
          // Đã bị hoàn tác trong lúc chờ server: giờ mới có _id thì xoá luôn
          deleteOnServer({ ...entry, serverId: saved._id });
        }
      } catch (err) {
        // Đã hoàn tác rồi thì lỗi này không còn quan trọng
        if (!findEntry(stateRef.current, localId)) return;
        apply({ type: 'remove', localId });
        setError(`Không lưu được lượt quẹt. ${err.message}`);
      }
    },
    [profiles, apply, deleteOnServer]
  );

  const undo = useCallback(() => {
    const top = stateRef.current.swipes.at(-1);
    if (!top) return;

    apply({ type: 'undo' }); // thẻ quay lại ngay

    // Có _id rồi thì xoá ngay. Chưa có thì swipe() sẽ tự xoá khi server trả về.
    if (top.serverId) deleteOnServer(top);
  }, [apply, deleteOnServer]);

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
      {/* Không đặt aria-live ở đây: dòng status bên dưới đã đọc điểm rồi */}
      <p className={styles.score}>
        Điểm: <span className={styles.scoreValue}>{score}</span>
      </p>

      <p className={styles.hint}>
        Kéo thẻ hoặc bấm phím: ← Bỏ qua · → Thích · ↑ Siêu thích · Backspace Hoàn tác
      </p>

      {error && (
        <div role="alert" className={styles.error}>
          <p className={styles.errorText}>{error}</p>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Đóng thông báo lỗi"
            onClick={() => setError(null)}
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>
      )}

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
        Còn {remainingProfiles.length}/{profiles.length}
      </p>
    </section>
  );
}
