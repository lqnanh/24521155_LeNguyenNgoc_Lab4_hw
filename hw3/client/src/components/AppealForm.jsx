import { useId, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import SimpleForm from '../form/SimpleForm.jsx';
import InputField from '../form/InputField.jsx';
import { useFormContext } from '../form/FormContext.js';
import { validateAppeal } from '../validateAppeal.js';
import { REASON_OPTIONS } from '../appealReasons.js';
import ShowData from './ShowData.jsx';
import styles from './AppealForm.module.css';

const INITIAL_VALUES = {
  fullName: '',
  email: '',
  reason: '',
  statement: '',
  evidenceUrl: '',
  agreed: false,
};

function ResetButton() {
  const { reset } = useFormContext();
  return (
    <button type="button" onClick={reset} className={styles.secondary}>
      Làm lại
    </button>
  );
}

export default function AppealForm({ playerName }) {
  const [submittedData, setSubmittedData] = useState(null);
  const resultHeadingRef = useRef(null);
  const resultHeadingId = useId();

  function handleSubmit(values) {
    // Tạm thời chưa gửi lên server: chỉ hiện dữ liệu ra
    flushSync(() => setSubmittedData(values));
    resultHeadingRef.current?.focus();
  }

  return (
    <>
      <p className={styles.note}>Các ô có dấu * là bắt buộc.</p>

      <SimpleForm
        initialValues={INITIAL_VALUES}
        validate={validateAppeal}
        onSubmit={handleSubmit}
        onReset={() => setSubmittedData(null)}
        aria-label="Đơn kháng cáo"
      >
        <InputField name="fullName" label="Họ tên người gửi" required autoComplete="name" />
        <InputField name="email" label="Email" type="email" required autoComplete="email" />
        <InputField
          name="reason"
          label="Lý do kháng cáo"
          type="select"
          required
          placeholder="-- Chọn lý do --"
          options={REASON_OPTIONS}
        />
        <InputField
          name="statement"
          label="Nội dung trình bày"
          type="textarea"
          required
          hint="Từ 30 đến 2000 ký tự."
          counterMax={2000}
        />
        <InputField
          name="evidenceUrl"
          label="Link bằng chứng (không bắt buộc)"
          type="url"
          hint="Ví dụ: https://example.com/video"
        />
        <InputField
          name="agreed"
          label="Tôi cam kết thông tin trong đơn là đúng sự thật"
          type="checkbox"
          required
        />

        <div className={styles.actions}>
          <button type="submit" className={styles.primary}>
            Gửi đơn kháng cáo
          </button>
          <ResetButton />
        </div>
      </SimpleForm>

      {submittedData && (
        <section className={styles.result} aria-labelledby={resultHeadingId}>
          <h3 id={resultHeadingId} ref={resultHeadingRef} tabIndex={-1} className={styles.resultTitle}>
            Dữ liệu đơn kháng cáo (chưa gửi lên server)
          </h3>
          <ShowData data={submittedData} playerName={playerName} />
        </section>
      )}
    </>
  );
}
