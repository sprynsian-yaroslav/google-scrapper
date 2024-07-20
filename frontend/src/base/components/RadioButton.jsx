import React, { useId } from 'react'
import joinClassNames from "../helpers/joinClassNames";

export default function RadioButton({
  checked,
  onChange,
  containerClassName,
  label,
  name
}){
  const id = useId();
  return (
    <section className={joinClassNames("d-flex align-items-center cursor-pointer form-check", containerClassName)}>
      <input id={id} type="radio" name={name} checked={checked} onChange={onChange} className="cursor-pointer form-check-input"/>
      <label htmlFor={id} className="mb-0 ms-2 cursor-pointer select-none">{label}</label>
    </section>
  )
}