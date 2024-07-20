import React from "react";
import { Button as ReactButton, Spinner } from "reactstrap";
import PropTypes from "prop-types"
import {BUTTON_COLORS} from "./appearance";

const Button = ({
  id,
  type = "button",
  color,
  onClick,
  ref,
  disabled,
  size = "",
  wavesEffect = "",
  wavesLight = "",
  block = "",
  rounded = "",
  children,
  className,
  loading = false,
}) => {
  const classes = `${block} ${wavesEffect} ${wavesLight} ${rounded} ${className}`;

  return (
    <ReactButton
      id={id}
      type={type}
      className={classes}
      color={color}
      onClick={onClick}
      innerRef={ref}
      disabled={disabled || loading}
      size={size}
      ref={ref}
    >
      {loading ? <Spinner className="button-spinner"/> : children}
    </ReactButton>
  );
};

Button.propTypes = {
  id: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit"]),
  color: PropTypes.oneOf(Object.values(BUTTON_COLORS)),
  block: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.string,
  onClick: PropTypes.func,
  ref: PropTypes.any,
  disabled: PropTypes.bool,
  children: PropTypes.any,
  rounded: PropTypes.string,
  wavesEffect: PropTypes.string,
  wavesLight: PropTypes.string,
  loading: PropTypes.bool,
};


export default Button
