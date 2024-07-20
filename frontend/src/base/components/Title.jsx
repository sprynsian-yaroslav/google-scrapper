import React from 'react'
import joinClassNames from "../../base/helpers/joinClassNames";

export default function Title({ title, className }){
  return (
    <label className={joinClassNames("font-weight-semibold font-size-15", className)}>{title}</label>
  )
}