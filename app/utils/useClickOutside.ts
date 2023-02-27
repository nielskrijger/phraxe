import type { RefObject } from "react";
import { useEffect } from "react";

/**
 * Executes callback when user clicks somewhere outside of passed element.
 */
export default function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  cb: () => void
): void {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        cb();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cb, ref]);
}
