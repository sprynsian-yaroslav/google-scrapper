import React from 'react';
import joinClassNames from "../../../../../base/helpers/joinClassNames";

export default function ValueWithLabel({
  label,
  value,
  className
}) {
  return (
    <section className={joinClassNames("d-flex flex-column", className)}>
      <label className="font-weight-semibold mb-1">{label}</label>
      <label className="text-secondary font-weight-normal mb-0 text-wrap word-break">{value ?? "-"}</label>
    </section>
  )
}