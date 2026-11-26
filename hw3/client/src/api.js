// Các hàm gọi server. Hàm nào cũng nhận { signal } để có thể huỷ.

const BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

// Thiếu biến môi trường thì dừng luôn
if (!BASE_URL) throw new Error('VITE_API_URL missing: thêm vào file client/.env');

// Lỗi từ server, giữ lại mã lỗi (status) và dữ liệu server trả về (data)
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Yêu cầu bị huỷ bằng AbortController thì không coi là lỗi
export function isAbortError(err) {
  return err?.name === 'AbortError';
}

async function request(path, { signal, method = 'GET', body } = {}) {
  const options = { method, signal };
  if (body !== undefined) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, options);
  } catch (err) {
    if (isAbortError(err)) throw err;
    throw new ApiError('Không kết nối được máy chủ. Hãy kiểm tra server đã chạy chưa.', 0);
  }

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    throw new ApiError(data?.error || `Máy chủ báo lỗi (mã ${res.status})`, res.status, data);
  }
  return data;
}

export function getDossiers({ signal } = {}) {
  return request('/api/dossiers', { signal });
}

export function getDossier(playerId, { signal } = {}) {
  return request(`/api/dossiers/${encodeURIComponent(playerId)}`, { signal });
}

export function getServerTime({ signal } = {}) {
  return request('/api/time', { signal });
}

export function submitAppeal(playerId, appeal, { signal } = {}) {
  return request(`/api/dossiers/${encodeURIComponent(playerId)}/appeals`, {
    method: 'POST',
    body: appeal,
    signal,
  });
}
