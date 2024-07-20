import React from 'react';
import Button from "./Button";
import { BUTTON_COLORS } from "./Button/appearance";
import joinClassNames from "../helpers/joinClassNames";
import { UncontrolledTooltip } from "reactstrap";

export default function PlusButtonWithTooltip({
  id,
  disabled,
  onClick,
  buttonText,
  tooltipText,
  containerClassName,
  buttonClassName,
  showTooltip = true,
}) {
  return (
    <>
      <section id={id} className={joinClassNames("w-fit-content", containerClassName)}>
        <Button
          color={BUTTON_COLORS.transparent}
          disabled={disabled}
          onClick={onClick}

          className={joinClassNames("mb-0 text-primary no-border d-flex align-items-center", buttonClassName)}
        >
          <i className="bx bx-plus me-2"/>{buttonText}
        </Button>
      </section>

      <UncontrolledTooltip
        popperClassName={joinClassNames(
          "tooltip-alternative-name",
          (!disabled || !showTooltip) && "visibility-hidden"
        )}
        placement="bottom"
        target={id}
      >
        {tooltipText}
      </UncontrolledTooltip>
    </>
  )
}