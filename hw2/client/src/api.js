const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '');

// Thiếu biến môi trường thì dừng luôn, giống bên server
if (!API_URL) throw new Error('VITE_API_URL missing: thêm vào file client/.env');

// Lỗi khi gọi server. status = 0 nghĩa là không kết nối được.
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, options);
  } catch (err) {
    if (err.name === 'AbortError') throw err; // bị huỷ: để nơi gọi tự bỏ qua
    throw new ApiError('Không kết nối được server. Server đã bật chưa?', 0);
  }

  const body = await res.json().catch(() => null);

  // Mã không phải 2xx cũng tính là lỗi
  if (!res.ok) {
    throw new ApiError(`Lỗi ${res.status}: ${body?.error ?? 'Server trả về lỗi'}`, res.status);
  }

  return body;
}

export async function getProfiles({ signal } = {}) {
  const data = await request('/api/profiles', { signal });
  if (!Array.isArray(data)) {
    throw new ApiError('Dữ liệu server trả về không đúng dạng', 200);
  }
  return data;
}

export async function createSwipe({ profileId, action }) {
  const data = await request('/api/swipe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileId, action }),
  });
  if (typeof data?._id !== 'string') {
    throw new ApiError('Dữ liệu server trả về không đúng dạng', 201);
  }
  return data;
}

export async function deleteSwipe(id) {
  return request(`/api/swipe/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
