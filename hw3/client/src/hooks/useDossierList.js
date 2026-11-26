import { useEffect, useState } from 'react';
import { getDossiers, isAbortError } from '../api.js';

// Lấy danh sách tuyển thủ (tóm tắt)
export function useDossierList() {
  const [state, setState] = useState({ players: [], loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();

    getDossiers({ signal: controller.signal })
      .then((players) => {
        setState({ players: Array.isArray(players) ? players : [], loading: false, error: null });
      })
      .catch((err) => {
        if (isAbortError(err)) return;
        setState({ players: [], loading: false, error: err.message });
      });

    return () => controller.abort();
  }, []);

  return state;
}
