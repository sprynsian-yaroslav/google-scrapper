
export function substring(value, start, end) {
  if (typeof value === 'string') {
    return value.substring(start, end);
  }
  return '';
}
