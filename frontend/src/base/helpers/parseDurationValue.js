import { DEFAULT_TIME, DEFAULT_TIME_WITHOUT_HOURS, MAX_HOURS, MAX_MINUTES, MAX_SECONDS } from "../constants/duration";

export const parseDurationStringFormatToObjectValue = (durationStringFormat, withoutHours) => {
    const match = withoutHours
        ? durationStringFormat.match(/(\d{1,2})m (\d{1,2})s/)
        : durationStringFormat.match(/(\d{1,2})h (\d{1,2})m (\d{1,2})s/);

    if (!match) return withoutHours ? DEFAULT_TIME_WITHOUT_HOURS : DEFAULT_TIME;

    if (withoutHours) {
        return {
            minutes: Math.min(parseInt(match[1]), MAX_MINUTES).toString().padStart(2, '0'),
            seconds: Math.min(parseInt(match[2]), MAX_SECONDS).toString().padStart(2, '0')
        };
    }

    return {
        hours: Math.min(parseInt(match[1]), MAX_HOURS).toString().padStart(2, '0'),
        minutes: Math.min(parseInt(match[2]), MAX_MINUTES).toString().padStart(2, '0'),
        seconds: Math.min(parseInt(match[3]), MAX_SECONDS).toString().padStart(2, '0')
    };
}

export const parseDurationObjectValueToStringFormat = (durationObjectValue, withoutHours) => {
    if (withoutHours) {
        return `${durationObjectValue?.minutes || '00'}m ${durationObjectValue?.seconds || '00'}s`;
    }
    return `${durationObjectValue?.hours || '00'}h ${durationObjectValue?.minutes || '00'}m ${durationObjectValue?.seconds || '00'}s`;
}