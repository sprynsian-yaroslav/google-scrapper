import React from 'react';
import joinClassNames from "../helpers/joinClassNames";

export default function Divider({
  className
}){
  return (
    <div className={joinClassNames("w-100 divider", className)}/>
  )
}