import React from 'react';
import Switch from "react-switch";
import { CIRCLE_DIAMETER, primaryColor, secondaryColor, SWITCH_HEIGHT } from "../constants/colorsAndSIzes";

const OnSymbol = () => {
  return (
    <div className="switch-on">
      On
    </div>
  );
};

export default function ReactSwitch({
  state,
  updateState
}) {
  return (
    <Switch
      uncheckedIcon={<></>}
      checkedIcon={<OnSymbol/>}
      onColor={primaryColor}
      offColor={secondaryColor}
      height={SWITCH_HEIGHT}
      handleDiameter={CIRCLE_DIAMETER}
      onChange={updateState}
      checked={state}
    />
  )
}