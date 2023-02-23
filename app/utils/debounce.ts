import { useEffect, useState } from "react";

/**
 * Based on https://gist.github.com/tomslutsky/f87a253a1dc43a1797306a79243a25ed
 */
export function useDebounce<T = any>(value: T, delay: number): [T, boolean] {
  const [debouncedValue, setDebouncedValue] = useState(value);
  let [isDebouncing, setDebouncing] = useState(false);

  useEffect(
    () => {
      // Update debounced value after delay
      setDebouncing(true);
      const handler = setTimeout(() => {
        setDebouncing(false);

        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return [debouncedValue, isDebouncing];
}
