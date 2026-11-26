import { useState } from 'react';
import { useAppealSlaTimer } from '../hooks/useAppealSlaTimer.js';
import { formatCountdown } from '../format.js';
import styles from './AppealCountdown.module.css';

const ONE_HOUR = 60 * 60 * 1000;
const FIVE_MINUTES = 5 * 60 * 1000;

// Chỉ thông báo cho trình đọc màn hình khi chuyển sang các mốc này
const MESSAGES = {
  normal: '',
  oneHour: 'Còn 1 giờ là hết hạn kháng cáo.',
  fiveMinutes: 'Còn 5 phút là hết hạn kháng cáo.',
  expired: 'Đã hết hạn kháng cáo.',
};

function getStage(remainingMs, isExpired) {
  if (remainingMs === null) return 'normal';
  if (isExpired) return 'expired';
  if (remainingMs <= FIVE_MINUTES) return 'fiveMinutes';
  if (remainingMs <= ONE_HOUR) return 'oneHour';
  return 'normal';
}

export default function AppealCountdown({ deadline }) {
  const { remainingMs, isExpired } = useAppealSlaTimer(deadline);
  const stage = getStage(remainingMs, isExpired);

  // Chỉ đổi lời thông báo khi mốc thay đổi (không thông báo mốc có sẵn lúc vừa mở trang)
  const [prevStage, setPrevStage] = useState(stage);
  const [announcement, setAnnouncement] = useState('');
  if (stage !== prevStage) {
    setPrevStage(stage);
    setAnnouncement(MESSAGES[stage]);
  }

  return (
    <div>
      {isExpired ? (
        <p className={styles.expired}>Đã hết hạn kháng cáo</p>
      ) : (
        // role="timer" + aria-live="off": trình đọc màn hình không tự đọc mỗi giây
        <p className={styles.clock} role="timer" aria-live="off">
          <span className={styles.label}>Thời gian còn lại:</span>{' '}
          <span className={styles.digits}>{formatCountdown(remainingMs)}</span>
        </p>
      )}

      {/* Vùng thông báo ẩn, luôn có sẵn trong trang, chỉ đổi chữ ở các mốc */}
      <p role="status" className={styles.srOnly}>
        {announcement}
      </p>
    </div>
  );
}
