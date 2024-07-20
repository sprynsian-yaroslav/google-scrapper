import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types'
import { useField } from 'formik';
import { FormGroup } from 'reactstrap';
import { capitalizeFirstLetter } from "../helpers/string";
import { useTranslate } from "../hooks/useTranslate";
import joinClassNames from "../helpers/joinClassNames";

const FormikTextarea = ({ label, containerClassName, ...props }) => {
  const [field, { error, touched }] = useField(props);
  const [translate] = useTranslate();
  const isError = error && touched;

  const textAreaRef = useRef(null);

  const resizeTextArea = () => {
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 2 + "px";
  };

  useEffect(resizeTextArea, [field.value]);

  return (
    <FormGroup className={joinClassNames(containerClassName)}>
      {label && (
        <label 
          htmlFor={props.name}
        >
          {label}
        </label>
      )}        
      <textarea
        className={joinClassNames("form-control", isError ? "is-invalid without-error-icon" : "")}
        {...field}
        {...props}
        ref={textAreaRef}
      />
      <span className="invalid-feedback">{capitalizeFirstLetter(translate(error, {
        label,
      }) ?? "")}</span>
    </FormGroup>
  )
};

FormikTextarea.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  rows: PropTypes.string,
  label: PropTypes.string
}

export default FormikTextarea;