import type { ReactElement } from "react";
import React, { useCallback } from "react";
import { words } from "lodash";
import SearchResult from "./SearchResult";
import SearchNoResults from "./SearchNoResults";
import useSearchStore from "../../../store/searchStore";
import useKeyDownListener from "~/utils/useKeyDownListener";
import { slugify } from "~/utils/slugify";
import { useNavigate } from "@remix-run/react";
import type { PhraseSearchResult } from "~/models/phrase.server";

type Props = {
  query: string; // search query used to highlight words
  phrases: PhraseSearchResult[];
};

export default function SearchResults({
  query,
  phrases,
}: Props): ReactElement | null {
  const navigate = useNavigate();

  const selectedIndex = useSearchStore((state) => state.selectedIndex);
  const closeSearch = useSearchStore((state) => state.closeSearch);
  const changeSelectedIndex = useSearchStore(
    (state) => state.changeSelectedIndex
  );

  const handleClick = useCallback(
    (phrase: PhraseSearchResult) => {
      closeSearch();
      navigate(
        `/p/${phrase.id}/${
          phrase.title ? slugify(phrase.title) : slugify(phrase.text)
        }`
      );
    },
    [closeSearch, navigate]
  );

  const arrowUpFunction = useCallback(() => {
    changeSelectedIndex(-1);
  }, [changeSelectedIndex]);

  useKeyDownListener("ArrowUp", arrowUpFunction);

  const arrowDownFunction = useCallback(() => {
    changeSelectedIndex(1);
  }, [changeSelectedIndex]);

  useKeyDownListener("ArrowDown", arrowDownFunction);

  const enterFunction = useCallback(() => {
    if (selectedIndex !== null && !!phrases) {
      handleClick(phrases[selectedIndex]);
    }
  }, [handleClick, phrases, selectedIndex]);

  useKeyDownListener("Enter", enterFunction);

  return (
    <div className="flex w-full flex-col rounded-bl-xl rounded-br-xl bg-white pb-0.5">
      {phrases.length === 0 && <SearchNoResults />}
      {phrases.map((phrase, index) => (
        <SearchResult
          highlightWords={words(query)}
          phrase={phrase}
          key={phrase.id}
          index={index}
          onClick={() => handleClick(phrase)}
        />
      ))}
    </div>
  );
}
