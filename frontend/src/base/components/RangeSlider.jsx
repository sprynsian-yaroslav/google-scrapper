import React from 'react';
import Slider from "react-rangeslider";
import joinClassNames from "../helpers/joinClassNames";

const DEFAULT_MIN_RANGE_VALUE = -10;
const DEFAULT_MAX_RANGE_VALUE = 10;

export default function RangeSlider({
  value,
  onChange,
  label,
  min = DEFAULT_MIN_RANGE_VALUE,
  max = DEFAULT_MAX_RANGE_VALUE,
  containerClassName,
  disabled,
  labelClassName,
  displayedValue,
}) {
  return (
    <section className={joinClassNames(containerClassName, "")}>
      <section className="d-flex justify-content-between align-items-center">
        <label className={joinClassNames("mb-0", labelClassName)}>{label}</label>
        {displayedValue && displayedValue[value] && <label className="mb-0 font-weight-semibold">{displayedValue[value]}</label>}
      </section>
      <Slider
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={value => {
          onChange(value)
        }}
      />
      <div className="w-100 d-flex align-items-center justify-content-between">
        <label className="font-weight-normal mb-0">{min}</label>
        <label className="font-weight-normal mb-0">{max}</label>
      </div>
    </section>
  )
}