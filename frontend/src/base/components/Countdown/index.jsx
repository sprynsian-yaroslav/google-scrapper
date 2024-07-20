import React, { useEffect, useState } from 'react'
import { DateTime } from "luxon";

export const SEC_IN_MS = 1000;
export const FIVE_MIN_IN_SEC = 60 * 5;

export default function Countdown({
  secondsToCount = FIVE_MIN_IN_SEC,
  isTimerActive = false,
  updateIsTimerActive,
}){
  const [currentTime, updateCurrentTime] = useState(secondsToCount);

  useEffect(() => {
    if(!isTimerActive) {
      updateCurrentTime(0)
      return;
    }
    const dateTimeToCount = DateTime.now().plus({ seconds: secondsToCount });
    const interval = setInterval(() => {
      const timerDateTime = dateTimeToCount.diff(DateTime.now(), ["seconds"]);
      const inProgress = timerDateTime.toObject().seconds > 0;
      updateCurrentTime(Math.round(timerDateTime.toObject().seconds));

      if(!inProgress){
        clearInterval(interval);
        updateCurrentTime(0);
        updateIsTimerActive(false);
      }
    }, SEC_IN_MS);

    return () => {
      clearInterval(interval)
    }
  }, [secondsToCount, isTimerActive]);

  return (
    <label className="text-secondary font-weight-normal mb-0">
      {DateTime.fromSeconds(currentTime).setZone("utc").toFormat("mm:ss")}
    </label>
  )
}