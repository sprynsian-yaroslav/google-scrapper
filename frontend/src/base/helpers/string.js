import { isArray } from "lodash";

export const SPACE_SYMBOL = ' ';
export const MINUS_SYMBOL = '-';
export const EMPTY_STRING = '';
export const DOT_SYMBOL = '.';
export const COMMA_SYMBOL = ',';

export const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const integerOnly = (value) => {
  const NOT_INTEGER_REGEXP = /[^\d]/g;

  if (!value) {
    return value;
  }

  return value.toString().replace(NOT_INTEGER_REGEXP, EMPTY_STRING);
};

export const floatPositiveOnly = (value, toFixed = 8) => floatOnly(value, toFixed, false)

export const floatOnly = (value, toFixed = 8, canBeNegative = true) => {
  const COMMA_REGEXP = /,/g;
  const INT_WITH_DOTS_REGEXP = /[^\d.]/g;
  let hasMinus = canBeNegative;

  if (typeof value === "number") {
    value = value.toString();
  }

  if (!value) {
    return value;
  }

  value = value.toString();

  if (value[0] === MINUS_SYMBOL && canBeNegative) {
    hasMinus = true;
  }

  const [int, ...float] = value.toString()
    .trimLeft()
    .replace(COMMA_REGEXP, DOT_SYMBOL)
    .replace(INT_WITH_DOTS_REGEXP, EMPTY_STRING)
    .split(DOT_SYMBOL);

  return `${hasMinus ? MINUS_SYMBOL : EMPTY_STRING}${int}${float.length ? DOT_SYMBOL : EMPTY_STRING}${integerOnly(float.join(EMPTY_STRING)).slice(0, toFixed)}`;
};

export const isEmptyString = (value) => {
  return (value == null || (typeof value === "string" && value.trim().length === 0));
}
export const getErrorMessage = (errors) => {
  let errorMsg = "";

  if (errors && errors?.filters && isArray(errors.filters) && errors.filters.length > 0 && Object.keys(errors.filters.filter(Boolean)?.[0])) {
    errorMsg = `${Object.keys(errors.filters.filter(Boolean)[0])} is required`
  }

  return errorMsg;
}