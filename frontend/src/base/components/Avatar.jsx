import React from "react";
import joinClassNames from "../helpers/joinClassNames";

export default function Avatar({ avatar, firstName, className }) {
  return (
    <>
      {!avatar ? (
        <div
          className={joinClassNames("table-item-avatar-bg d-flex align-items-center justify-content-center", className)}>
          <span>{(firstName && firstName[0]) ?? "N"}</span>
        </div>
      ) : (
        <img className={joinClassNames("rounded-circle", className)} src={avatar} alt="user pick"/>
      )}
    </>
  )
}