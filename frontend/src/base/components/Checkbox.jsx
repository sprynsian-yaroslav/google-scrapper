import React, { useId } from "react";
import PropTypes from 'prop-types';
import joinClassNames from "../helpers/joinClassNames";

export default function Checkbox({ text, value, onChange, className, disabled, labelClassName }) {
  const id = useId();
  return (
    <div className={joinClassNames(className, "form-check")}>
      <input
        type="checkbox"
        className="form-check-input custom-checkbox-white"
        id={id}
        onChange={onChange}
        checked={value}
        disabled={disabled}
      />
      <label className={joinClassNames("form-check-label custom-checkbox-label", labelClassName)} htmlFor={id}>
        {text}
      </label>
    </div>
  );
}

Checkbox.propTypes = {
  text: PropTypes.string,
  value: PropTypes.bool,
  onChange: PropTypes.func,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};