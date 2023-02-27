import type { ReactElement } from "react";
import useSearchStore from "../../../store/searchStore";

export default function SearchNoResults(): ReactElement {
  const resultsQuery = useSearchStore((state) => state.resultsQuery);

  return (
    <div className="py-2 px-4">
      No results for <strong>{resultsQuery}</strong>
    </div>
  );
}
