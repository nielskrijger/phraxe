import { useMemo, useState } from "react";
import { debounce } from "lodash";

export default function useDebounce<T>(
  obj: T,
  wait = 200
): [T, (prop: T) => void] {
  const [state, setState] = useState<T>(obj);
  const debouncedFunction = useMemo(() => debounce(setState, wait), [wait]);
  return [state, debouncedFunction];
}
