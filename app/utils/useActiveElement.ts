import { useEffect, useState } from "react";

export default function useActiveElement(): EventTarget | null {
  const [activeElement, setActiveElement] = useState<EventTarget | null>(null);

  useEffect(() => {
    const onFocus = (event: FocusEvent) => {
      setActiveElement(event.target);
    };
    const onBlur = () => {
      setActiveElement(null);
    };

    window.addEventListener("focus", onFocus, true);
    window.addEventListener("blur", onBlur, true);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return activeElement;
}
