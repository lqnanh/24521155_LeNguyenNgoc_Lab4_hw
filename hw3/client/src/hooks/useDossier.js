import { useEffect, useState } from 'react';
import { getDossier, isAbortError } from '../api.js';

// Lấy hồ sơ của một tuyển thủ.
// Kết quả được gắn với playerId đã yêu cầu: khi playerId đổi, kết quả cũ không còn khớp
// nên hook trả về loading ngay, không bao giờ hiện nhầm hồ sơ người trước.
export function useDossier(playerId) {
  const [result, setResult] = useState({
    playerId: null,
    dossier: null,
    error: null,
    notFound: false,
  });

  useEffect(() => {
    const controller = new AbortController();

    getDossier(playerId, { signal: controller.signal })
      .then((dossier) => {
        setResult({ playerId, dossier, error: null, notFound: false });
      })
      .catch((err) => {
        if (isAbortError(err)) return; // bị huỷ thì bỏ qua, không phải lỗi
        const notFound = err.status === 404;
        setResult({
          playerId,
          dossier: null,
          error: notFound ? null : err.message,
          notFound,
        });
      });

    // Đổi tuyển thủ hoặc rời trang thì huỷ yêu cầu cũ
    return () => controller.abort();
  }, [playerId]);

  const isCurrent = result.playerId === playerId;

  return {
    dossier: isCurrent ? result.dossier : null,
    loading: !isCurrent,
    error: isCurrent ? result.error : null,
    notFound: isCurrent && result.notFound,
  };
}
