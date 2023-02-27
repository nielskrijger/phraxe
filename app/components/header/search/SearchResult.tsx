import type { ReactElement } from "react";
import React, { useCallback } from "react";
import Highlighter from "react-highlight-words";
import useSearchStore from "../../../store/searchStore";
import type { PhraseSearchResult } from "~/models/phrase.server";
import clsx from "clsx";

interface Props {
  highlightWords: string[];
  phrase: PhraseSearchResult;
  index: number;
  onClick(phrase: PhraseSearchResult): void;
}

export default function SearchResult({
  highlightWords,
  phrase,
  index,
  onClick,
}: Props): ReactElement {
  const selectedIndex = useSearchStore((state) => state.selectedIndex);
  const setSelectedIndex = useSearchStore((state) => state.setSelectedIndex);

  const handleMouseOver = useCallback(() => {
    // trigger action only when necessary to avoid spam
    if (selectedIndex !== index) {
      setSelectedIndex(index);
    }
  }, [index, selectedIndex, setSelectedIndex]);

  const handleMouseLeave = () => {
    setSelectedIndex(null);
  };

  return (
    <button
      onClick={() => onClick(phrase)}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      className={clsx("py-2 px-4 text-left", {
        "bg-slate-100": selectedIndex === index,
      })}
    >
      <Highlighter
        className="line-clamp-2"
        highlightClassName="font-bold bg-transparent"
        searchWords={highlightWords}
        textToHighlight={phrase.text}
      />
    </button>
  );
}
