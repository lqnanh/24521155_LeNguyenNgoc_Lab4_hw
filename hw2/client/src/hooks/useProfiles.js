import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '');

// Thiếu biến môi trường thì dừng luôn, giống bên server
if (!API_URL) throw new Error('VITE_API_URL missing: thêm vào file client/.env');

export default function useProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProfiles() {
      try {
        const res = await fetch(`${API_URL}/api/profiles`, {
          signal: controller.signal,
        });

        // Mã không phải 2xx cũng tính là lỗi
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(`Lỗi ${res.status}: ${body?.error ?? 'Server trả về lỗi'}`);
        }

        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error('Dữ liệu server trả về không đúng dạng');
        }

        setProfiles(data);
      } catch (err) {
        // Bị huỷ (rời trang, tải lại) thì không coi là lỗi
        if (err.name === 'AbortError') return;

        // fetch ném TypeError khi không kết nối được server
        setError(
          err instanceof TypeError
            ? 'Không kết nối được server. Server đã bật chưa?'
            : err.message
        );
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
