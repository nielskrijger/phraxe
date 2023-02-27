import { useCallback, useEffect } from "react";

export default function useKeyDownListener(
  code: string,
  fn: (event: KeyboardEvent) => void
): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === code) {
        fn(event);
      }
    },
    [code, fn]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, false);
    };
  }, [fn, handleKeyDown]);
}
