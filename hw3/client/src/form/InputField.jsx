import { useId } from 'react';
import { useFormContext } from './FormContext.js';
import styles from './InputField.module.css';

// type: 'text' | 'email' | 'url' | 'textarea' | 'select' | 'checkbox'
export default function InputField({
  name,
  label,
  type = 'text',
  required = false,
  hint,
  options = [],
  placeholder,
  counterMax,
  autoComplete,
  rows = 6,
}) {
  const { values, errors, setValue, markTouched, shouldShowError } = useFormContext();
  const id = useId();
  const inputId = `${id}-input`;
  const hintId = `${id}-hint`;
  const counterId = `${id}-counter`;
  const errorId = `${id}-error`;

  const value = values[name];
  const error = shouldShowError(name) ? errors[name] : null;
  const length = typeof value === 'string' ? value.length : 0;

  const describedBy =
    [hint && hintId, counterMax && counterId, error && errorId].filter(Boolean).join(' ') ||
    undefined;

  const common = {
    id: inputId,
    name,
    onBlur: () => markTouched(name),
    'aria-invalid': Boolean(error),
    'aria-describedby': describedBy,
    'aria-required': required || undefined,
  };

  function handleChange(event) {
    setValue(name, type === 'checkbox' ? event.target.checked : event.target.value);
  }

  const controlClass = error ? `${styles.control} ${styles.invalid}` : styles.control;

  let control;
  if (type === 'textarea') {
    control = (
      <textarea {...common} rows={rows} value={value ?? ''} onChange={handleChange} className={controlClass} />
    );
  } else if (type === 'select') {
    control = (
      <select {...common} value={value ?? ''} onChange={handleChange} className={controlClass}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  } else if (type === 'checkbox') {
    control = (
      <input
        {...common}
        type="checkbox"
        checked={Boolean(value)}
        onChange={handleChange}
        className={error ? `${styles.checkbox} ${styles.invalidCheckbox}` : styles.checkbox}
      />
    );
  } else {
    control = (
      <input
        {...common}
        type={type}
        value={value ?? ''}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={controlClass}
      />
    );
  }

  const labelElement = (
    <label htmlFor={inputId} className={styles.label}>
      {label}
      {required && (
        <span className={styles.required} aria-hidden="true">
          {' '}
          *
        </span>
      )}
    </label>
  );

  return (
    <div className={styles.field}>
      {type === 'checkbox' ? (
        <div className={styles.checkRow}>
          {control}
          {labelElement}
        </div>
      ) : (
        labelElement
      )}

      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}

      {type !== 'checkbox' && control}

      {counterMax && (
        <p id={counterId} className={length > counterMax ? `${styles.counter} ${styles.over}` : styles.counter}>
          {length}/{counterMax} ký tự
        </p>
      )}

      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
