import { useEffect, useState } from 'react';
import { getProfiles } from '../api.js';

export default function useProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProfiles() {
      try {
        const data = await getProfiles({ signal: controller.signal });
        setProfiles(data);
      } catch (err) {
        // Bị huỷ (rời trang, tải lại) thì không coi là lỗi
        if (err.name === 'AbortError') return;
        setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadProfiles();

    // Component bị gỡ hoặc effect chạy lại thì huỷ yêu cầu đang dở
    return () => controller.abort();
  }, []);

  return { profiles, loading, error };
}
