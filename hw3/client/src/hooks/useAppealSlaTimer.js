import { useEffect, useRef, useState } from 'react';
import { getServerTime } from '../api.js';

const TICK_MS = 1000;

// Đếm ngược tới hạn kháng cáo.
// Mỗi lần tick đều tính lại: còn lại = hạn − (giờ máy + độ lệch so với server).
export function useAppealSlaTimer(deadline) {
  const deadlineMs = new Date(deadline).getTime();
  const offsetRef = useRef(0); // giờ server − giờ máy (mili giây)
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!Number.isFinite(deadlineMs)) return undefined;

    let controller = null;

    const tick = () => setNow(Date.now() + offsetRef.current);

    async function syncWithServer() {
      controller?.abort(); // huỷ lần hỏi trước nếu còn dở
      const current = new AbortController();
      controller = current;

      const startedAt = performance.now();
      try {
        const data = await getServerTime({ signal: current.signal });
        const roundTrip = performance.now() - startedAt;
        if (typeof data?.now === 'number') {
          // Server trả lời ở khoảng giữa thời gian chờ → cộng thêm nửa thời gian chờ
          offsetRef.current = data.now + roundTrip / 2 - Date.now();
        }
      } catch {
        // Không gọi được server (hoặc bị huỷ): giữ độ lệch cũ, đếm theo giờ máy, không báo lỗi
      }
      if (!current.signal.aborted) tick();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        tick(); // tính lại ngay
        syncWithServer(); // rồi hỏi lại giờ server
      }
    }

    syncWithServer();
    const intervalId = setInterval(tick, TICK_MS);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      controller?.abort();
    };
  }, [deadlineMs]);

  if (!Number.isFinite(deadlineMs)) {
    return { remainingMs: null, isExpired: false };
  }

  const remainingMs = Math.max(0, deadlineMs - now);
  return { remainingMs, isExpired: remainingMs <= 0 };
}
