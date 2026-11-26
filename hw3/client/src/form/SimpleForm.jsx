import { useState } from 'react';
import { flushSync } from 'react-dom';
import { FormContext } from './FormContext.js';
import { validateAppeal } from '../validateAppeal.js';
import styles from './SimpleForm.module.css';

export default function SimpleForm({
  initialValues,
  validate = validateAppeal,
  onSubmit,
  onReset,
  children,
  className,
  ...formProps
}) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Tính lỗi ngay lúc render, không lưu vào state
  const errors = validate(values);

  function setValue(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function markTouched(name) {
    setTouched((prev) => (prev[name] ? prev : { ...prev, [name]: true }));
  }

  // Chỉ hiện lỗi khi ô đã rời khỏi hoặc đã bấm gửi
  function shouldShowError(name) {
    return Boolean(errors[name]) && (submitted || touched[name] === true);
  }

  function reset() {
    setValues(initialValues);
    setTouched({});
    setSubmitted(false);
    onReset?.();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (Object.keys(errors).length > 0) {
      // Vẽ lại ngay để mọi chỗ báo lỗi hiện ra, rồi mới đưa con trỏ tới ô sai đầu tiên
      flushSync(() => setSubmitted(true));
      const firstInvalid = Array.from(form.elements).find((el) => el.name && errors[el.name]);
      firstInvalid?.focus();
      return;
    }

    onSubmit?.(values);
  }

  const contextValue = { values, errors, touched, setValue, markTouched, shouldShowError, reset };

  return (
    <FormContext.Provider value={contextValue}>
      <form
        {...formProps}
        noValidate
        onSubmit={handleSubmit}
        className={className ? `${styles.form} ${className}` : styles.form}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}
