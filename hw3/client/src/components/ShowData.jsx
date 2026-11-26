import { reasonLabel } from '../appealReasons.js';
import styles from './ShowData.module.css';

function Row({ label, children }) {
  return (
    <div className={styles.row}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

// Hiện dữ liệu đơn kháng cáo bằng <dl>, không dùng JSON.stringify
export default function ShowData({ data, playerName }) {
  const evidenceUrl = (data.evidenceUrl ?? '').trim();

  return (
    <dl className={styles.list}>
      {playerName && <Row label="Kháng cáo cho">{playerName}</Row>}
      <Row label="Họ tên">{data.fullName.trim()}</Row>
      <Row label="Email">{data.email.trim().toLowerCase()}</Row>
      <Row label="Lý do kháng cáo">{reasonLabel(data.reason)}</Row>
      <Row label="Nội dung trình bày">
        <span className={styles.multiline}>{data.statement.trim()}</span>
      </Row>
      <Row label="Link bằng chứng">{evidenceUrl || 'Không có'}</Row>
      <Row label="Đã đồng ý cam kết">{data.agreed ? 'Có' : 'Không'}</Row>
    </dl>
  );
}
