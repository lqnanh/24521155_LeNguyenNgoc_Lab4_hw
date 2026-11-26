import { useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { useDossier } from '../hooks/useDossier.js';
import { computeMatrix } from '../computeMatrix.js';
import { formatDate, formatDateTime, formatMoney } from '../format.js';
import DisproportionMatrix from '../components/DisproportionMatrix.jsx';
import AppealCountdown from '../components/AppealCountdown.jsx';
import AppealForm from '../components/AppealForm.jsx';
import styles from './DossierPage.module.css';

function Row({ label, children }) {
  return (
    <div className={styles.row}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default function DossierPage() {
  const { playerId } = useParams();
  const { dossier, loading, error, notFound } = useDossier(playerId);

  // Hook phải gọi trước mọi lệnh return sớm
  const matrix = useMemo(
    () => (dossier ? computeMatrix(dossier.violations, dossier.penalty?.level) : null),
    [dossier]
  );

  if (loading) {
    return <p role="status">Đang tải hồ sơ…</p>;
  }

  if (notFound) {
    return (
      <div role="alert" className={styles.alert}>
        <title>Không tìm thấy hồ sơ | Fair-Play Esports</title>
        <h1 className={styles.alertTitle}>Không tìm thấy hồ sơ</h1>
        <p>
          Không có tuyển thủ với mã “{playerId}”. <Link to="/">Về danh sách hồ sơ</Link>
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className={styles.alert}>
        <p>{error}</p>
        <p>
          <Link to="/">Về danh sách hồ sơ</Link>
        </p>
      </div>
    );
  }

  const { violations = [], penalty } = dossier;

  return (
    <article className={styles.page}>
      <title>{`Hồ sơ ${dossier.displayName} | Fair-Play Esports`}</title>
      <h1 className={styles.title}>Hồ sơ kỷ luật: {dossier.displayName}</h1>

      <section className={styles.section} aria-labelledby="countdown-heading">
        <h2 id="countdown-heading">Hạn kháng cáo</h2>
        <AppealCountdown key={dossier.playerId} deadline={dossier.appealDeadline} />
      </section>

      <section className={styles.section} aria-labelledby="info-heading">
        <h2 id="info-heading">Thông tin tuyển thủ</h2>
        <dl className={styles.list}>
          <Row label="Mã tuyển thủ">{dossier.playerId}</Row>
          <Row label="Tên hiển thị">{dossier.displayName}</Row>
          <Row label="Đội">{dossier.team}</Row>
          <Row label="Vai trò">{dossier.role}</Row>
        </dl>
      </section>

      <section className={styles.section} aria-labelledby="violations-heading">
        <h2 id="violations-heading">Các lần vi phạm ({violations.length})</h2>
        {violations.length === 0 ? (
          <p>Không có vi phạm nào.</p>
        ) : (
          <ol className={styles.violations}>
            {violations.map((v) => (
              <li key={v._id} className={styles.violation}>
                <dl className={styles.list}>
                  <Row label="Loại vi phạm">{v.type}</Row>
                  <Row label="Mức độ">{v.severity}/5</Row>
                  <Row label="Bằng chứng">{v.evidence}</Row>
                  <Row label="Ngày xảy ra">
                    <time dateTime={v.occurredAt}>{formatDate(v.occurredAt)}</time>
                  </Row>
                </dl>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className={styles.section} aria-labelledby="penalty-heading">
        <h2 id="penalty-heading">Án phạt</h2>
        <dl className={styles.list}>
          <Row label="Số trận bị cấm">{penalty?.matchBan ?? '—'} trận</Row>
          <Row label="Tiền phạt">{formatMoney(penalty?.fine)}</Row>
          <Row label="Mức án">{penalty?.level ?? '—'}/5</Row>
          <Row label="Thời điểm ra án">
            <time dateTime={dossier.sanctionedAt}>{formatDateTime(dossier.sanctionedAt)}</time>
          </Row>
          <Row label="Hạn kháng cáo">
            <time dateTime={dossier.appealDeadline}>{formatDateTime(dossier.appealDeadline)}</time>
          </Row>
        </dl>
      </section>

      <section className={styles.section} aria-labelledby="matrix-heading">
        <h2 id="matrix-heading">Ma trận bất cân xứng</h2>
        <DisproportionMatrix matrix={matrix} />
      </section>

      <section className={styles.section} aria-labelledby="appeal-heading">
        <h2 id="appeal-heading">Gửi đơn kháng cáo</h2>
        <AppealForm key={dossier.playerId} playerName={dossier.displayName} />
      </section>
    </article>
  );
}
