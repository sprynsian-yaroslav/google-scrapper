import { useEffect, useState } from 'react';
import { DEFAULT_DEBOUNCE_DELAY } from '../constants/shared';

export const MIN_LENGTH_FOR_SEARCH_REQUEST = 2;

export const useDebounce = (value, delay = DEFAULT_DEBOUNCE_DELAY, callback) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (value && value.toString().length < MIN_LENGTH_FOR_SEARCH_REQUEST) {
        return
      }

      if(value === undefined) return;

      setDebouncedValue(value);
      if(callback){
        callback();
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return [debouncedValue, () => setDebouncedValue(undefined)];
};
