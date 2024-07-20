import React from "react";
import Icon from "../../../base/components/Icon";

export default function Logo() {
  return (
    <div className="auth-logo-light">
      <div className="avatar-md profile-user-wid mb-3">
        <span className="avatar-title rounded-circle logo-bg">
          <Icon icon="logo" className="rounded-circle" height="34" />
        </span>
      </div>
    </div>
  );
}
