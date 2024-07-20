import { DateTime } from "luxon";

const DEFAULT_DATE_FORMAT = "dd/LL/yyyy"
export const DATE_FULL_FORMAT_WITH_TIME = "dd LLL yyyy, HH:mm"
export const DEFAULT_DATE_FORMAT_FOR_BACKEND = "yyyy-MM-dd"
export const DATE_FORMAT_STORYBLOK = "yyyy-MM-dd HH:mm"
export const formatISODate = (date, format = DEFAULT_DATE_FORMAT) => {
  if(!date) return "-"
  return DateTime.fromISO(date).toFormat(format)
}

export const formatJSDateToIso = (date, endOfDay = false, startOfDay = false) => {
  const dateTimeISO = DateTime.fromJSDate(date);
  if(endOfDay){
    return dateTimeISO.endOf("day").toISO()
  }
  if (startOfDay) {
    return dateTimeISO.startOf("day").toISO()
  }
  return dateTimeISO.toISO()
}

export const formatJSDate = (date, format = DEFAULT_DATE_FORMAT) => {
  if(!date) return undefined;
  return DateTime.fromJSDate(date).toFormat(format)
}

export const formatFromISOToJSDate = (date = "") => {
  if(!date) return "";
  if(typeof date === "number"){
    return date;
  }
  return DateTime.fromISO(date).toJSDate()
}

export const formatDate = (date = "", fromFormat = DEFAULT_DATE_FORMAT_FOR_BACKEND, toFormat = DEFAULT_DATE_FORMAT) => {
  if(!date) return "-"
  return DateTime.fromFormat(date, fromFormat).toFormat(toFormat)
}

export const transformJsDateToIso = (date, keepLocalTime = false, endOfDay = false) => {
  if(!date) return;
  if(endOfDay){
    return DateTime.fromISO(date).setZone("utc").endOf("day").toISO()
  }
  return DateTime.fromISO(date).setZone("utc", { keepLocalTime }).toISO()
}

export const formatISODateWithZoneFromString = (date, format = DEFAULT_DATE_FORMAT) => {
  if(!date) return "-"
  return DateTime.fromISO(date, {setZone: true}).toFormat(format)
}
