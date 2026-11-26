// Định dạng kiểu Việt Nam, luôn theo giờ Việt Nam

const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Ho_Chi_Minh',
});

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'Asia/Ho_Chi_Minh',
});

const moneyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

function toDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

// Ví dụ: "22:28 29/11/2026"
export function formatDateTime(value) {
  const date = toDate(value);
  return date ? dateTimeFormatter.format(date) : '—';
}

// Ví dụ: "16/11/2026"
export function formatDate(value) {
  const date = toDate(value);
  return date ? dateFormatter.format(date) : '—';
}

// Ví dụ: "15.000.000 ₫"
export function formatMoney(value) {
  return typeof value === 'number' ? moneyFormatter.format(value) : '—';
}

// Thời gian còn lại, ví dụ: "2 ngày 03:12:45" hoặc "00:01:59"
export function formatCountdown(ms) {
  if (typeof ms !== 'number' || !Number.isFinite(ms)) return '—';
  const total = Math.max(0, Math.ceil(ms / 1000)); // làm tròn lên: chỉ hiện 00:00:00 khi thật sự hết
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (n) => String(n).padStart(2, '0');
  const clock = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return days > 0 ? `${days} ngày ${clock}` : clock;
}
