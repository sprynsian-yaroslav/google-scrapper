import React from "react";
import logo from "../../../base/assets/logo.svg";

export default function Logo() {
  return (
    <div className="auth-logo-light">
      <div className="avatar-md profile-user-wid mb-3">
        <span className="avatar-title rounded-circle logo-bg">
          <img alt="logo" src={logo} style={{maxHeight: '80px'}}/>
        </span>
      </div>
    </div>
  );
}
