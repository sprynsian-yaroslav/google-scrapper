import React, { useMemo, useState } from 'react';
import { useField } from 'formik';
import CustomInput from './Input';
import PropTypes from 'prop-types'
import { useTranslate } from '../hooks/useTranslate';
import Icon from "./Icon";
import joinClassNames from "../helpers/joinClassNames";
import { capitalizeFirstLetter } from "../helpers/string";

const FormikInput = ({
  placeholder,
  name,
  type,
  maxLength,
  readOnly,
  label,
  containerClassName,
  min,
  max,
  disabled = false,
  withEyeOption = false,
  format = value => value,
  backendError,
  backendErrorText,
  afterOnChange = () => {},
  inputClassName,
  withoutErrorText = false,
  ...otherProps
}) => {
  const [field, meta, { setValue, setTouched }] = useField({ name, type, placeholder });
  const [eyeState, updateEyeState] = useState(false);
  const [translate] = useTranslate();
  const isError = meta.error && meta.touched || backendError;

  const inputType = useMemo(() => {
    if (type !== "password") return type;
    if (eyeState) return "text";
    return "password";
  }, [eyeState, type, name]);

  return (
    <section className={containerClassName}>
      {label &&  <label className={""}>{label}</label>}
      <CustomInput
        {...otherProps}
        {...field}
        type={inputType}
        onChange={(event) => {
          setTouched(true);
          setValue(format(event.target.value))
          afterOnChange();
        }}
        className={joinClassNames(isError ? "is-invalid without-error-icon" : "", withEyeOption && "pe-5", inputClassName)}
        maxLength={maxLength}
        readOnly={readOnly}
        placeholder={placeholder}
        min={min}
        max={max}
        disabled={disabled}
      />

      {!!withEyeOption &&
        <Icon
          icon="eye"
          onClick={() => updateEyeState(prevState => !prevState)}
          className={joinClassNames("input-eye-option")}
        />
      }

      {!withoutErrorText && <>
        <span className="invalid-feedback">{capitalizeFirstLetter(translate(meta.error, {
          label,
          min,
          max
        }) ?? "")}</span>

        {!meta.error && backendError && backendErrorText &&
          <span className="invalid-feedback select-none">
            {backendErrorText}
          </span>
      }
      </>}
    </section>
  )
};

FormikInput.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  maxLength: PropTypes.number,
  readOnly: PropTypes.bool,
  label: PropTypes.string,
  containerClassName: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
}

export default FormikInput;

export const FormikControlledInput = ({
  placeholder,
  name,
  type,
  maxLength,
  readOnly,
  label,
  containerClassName,
  onChange,
  formatValue = (value) => value,
  backendError,
}) => {
  const [field, { error, touched }] = useField({ name, type, placeholder });
  const [translate] = useTranslate();
  const isError = (error && touched) || backendError;

  return (
    <section
      className={joinClassNames(containerClassName)}>
      <label className={""}>{label}</label>
      <CustomInput
        {...field}
        type={type}
        onChange={(props) => {
          onChange(formatValue(props.target.value))
        }}
        className={joinClassNames(isError ? "is-invalid without-error-icon" : "")}
        maxLength={maxLength}
        readOnly={readOnly}
        placeholder={placeholder}
      />
      <span className="invalid-feedback">{capitalizeFirstLetter(translate(error, { label }) ?? "")}</span>
    </section>
  )
}