import React, { useState } from 'react';
import CustomInput from "./Input";
import Icon from "./Icon";
import joinClassNames from "../helpers/joinClassNames";

export default function InputWithDelete({
  onChange,
  name,
  className,
  value,
  placeholder,
  onDelete,
  inputClassName,
  maxLength,
  errorText = "",
  isBulletListTitle = false,
  errorClassName = ""
}) {
  const [isTouched, setIsTouched] = useState(false);
  const handleBlur = () => {
    setIsTouched(true)
  }

  return (
    <section>
      <div className={joinClassNames("d-flex", className)}>
        <CustomInput
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
          }}
          className={joinClassNames(inputClassName, isTouched ? errorClassName : "")}
          name={name}
          placeholder={placeholder}
          maxLength={maxLength}
          handleBlur={handleBlur}
        />
        <Icon
          className="align-self-end cursor-pointer mb-2 ms-3"
          icon="trashIcon"
          onClick={onDelete}
        />
      </div>
      {errorText && isBulletListTitle && isTouched && <p className="error">{errorText}</p>}
    </section>
  )
}
