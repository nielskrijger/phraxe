import type { ChangeEvent, ReactElement } from "react";
import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import SearchResults from "./SearchResults";
import SearchIcon from "./SearchIcon";
import SearchInput from "./SearchInput";
import SearchCloseIcon from "./SearchCloseIcon";
import useSearchStore from "../../../store/searchStore";
import useActiveElement from "~/utils/useActiveElement";
import useDebounce from "~/utils/useDebounce";
import useKeyDownListener from "~/utils/useKeyDownListener";
import useFocus from "~/utils/useFocus";
import useClickOutside from "~/utils/useClickOutside";
import { useFetcher, useLocation } from "@remix-run/react";
import useMount from "~/utils/useMount";

const MIN_SEARCH_LENGTH = 2;

export default function Search(): ReactElement {
  const fetcher = useFetcher();
  const location = useLocation();
  const query = useSearchStore((state) => state.query);
  const results = useSearchStore((state) => state.results);
  const isOpen = useSearchStore((state) => state.isOpen);
  const closeSearch = useSearchStore((state) => state.closeSearch);
  const openSearch = useSearchStore((state) => state.openSearch);
  const setQuery = useSearchStore((state) => state.setQuery);
  const setResults = useSearchStore((state) => state.setResults);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [searchInput, setInputFocus] = useFocus();
  const activeElement = useActiveElement();
  const [debouncedSearch, setDebouncedSearch] = useDebounce<string>("", 150);

  // Load search query from url if search mounts for the first time
  const params = new URLSearchParams(location.search);
  const q = params.get("q");
  useEffect(() => {
    if (q) {
      setQuery(q);
    }
  }, [q, setQuery]);

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
    setDebouncedSearch(event.currentTarget.value);
  };

  useKeyDownListener("Escape", closeSearch);

  const showLoader = fetcher.state === "loading";

  // Execute debounced search query
  useEffect(() => {
    if (debouncedSearch.length > MIN_SEARCH_LENGTH) {
      const params = new URLSearchParams();
      params.set("q", debouncedSearch);
      fetcher.load(`/search/quick?${params.toString()}`);
    }
    // Fetcher is unstable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Open search if input gets focus
  useEffect(() => {
    if (searchInput.current && activeElement === searchInput.current) {
      console.log("OPENING SEARCH");
      openSearch();
    }
  }, [activeElement, openSearch, searchInput]);

  // Close search whenever url changes
  useEffect(() => {
    closeSearch();
  }, [closeSearch, location]);

  // Update results when finishing loading quick search
  useEffect(() => {
    if (fetcher.state !== "loading") {
      setResults(fetcher.data?.phrases ?? null);
    }
  }, [fetcher.data, fetcher.state, setResults]);

  // Close search if user clicks anywhere outside the search wrapper
  useClickOutside(wrapperRef, closeSearch);

  return (
    <div
      className={clsx(
        { "relative top-[-19px] w-full max-w-3xl": !isOpen },
        {
          "absolute top-[10px] left-[10px] w-[calc(100%_-_20px)] sm:relative sm:top-[-19px] sm:left-0 sm:max-w-3xl":
            isOpen,
        }
      )}
    >
      <div
        ref={wrapperRef}
        className={clsx(
          "absolute z-10 w-full rounded-xl border border-slate-200 hover:bg-slate-300 hover:bg-slate-50",
          { "drop-shadow-md sm:block": isOpen }
        )}
      >
        <SearchIcon
          onClick={() => setInputFocus(true)}
          isLoading={showLoader}
        />

        {isOpen && <SearchCloseIcon onClick={closeSearch} />}

        <SearchInput
          ref={searchInput}
          onChange={handleChangeSearch}
          isOpen={isOpen}
          value={query}
          phrases={results}
        />

        {!!results && isOpen && (
          <SearchResults query={query} phrases={results} />
        )}
      </div>
    </div>
  );
}
