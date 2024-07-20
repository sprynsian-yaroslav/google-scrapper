import React, { useCallback } from 'react'

export const powerFormat = (unit = '') => {
  if (typeof unit !== 'string') return unit

  let [head, tail] = unit.split(" ");
  if (!head || !tail) {
    [head, tail] = unit.split("^");
  }

  if (!head || !tail) {
    return unit;
  }
  const [power, u] = tail.split("/");
  return (
    <>
      {head?.replace('x', '')}
      <sup>{power}</sup>/{u}
    </>
  );
}

export const usePowerUnitFormat = () => {
  const format = useCallback(powerFormat, [powerFormat])
  return {
    powerFormat: format
  }
};
