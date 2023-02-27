import { RefObject, useCallback, useRef } from "react";

export default function useFocus(): [
  RefObject<HTMLInputElement>,
  (focus: boolean) => void
] {
  const htmlElRef = useRef<HTMLInputElement>(null);

  const setFocus = useCallback((focus: boolean) => {
    if (htmlElRef.current) {
      if (focus) {
        htmlElRef.current.focus();
      } else {
        htmlElRef.current.blur();
      }
    }
  }, []);

  return [htmlElRef, setFocus];
}
