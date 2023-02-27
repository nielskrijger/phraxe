import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { PhraseSearchResult } from "~/models/phrase.server";

interface SearchState {
  query: string;
  resultsQuery: string; // shown in "No results" message which query failed to yield anything
  results: PhraseSearchResult[] | null;
  selectedIndex: number | null;
  isOpen: boolean;

  openSearch: () => void;
  closeSearch: () => void;
  setQuery: (query: string) => void;
  setSelectedIndex: (index: number | null) => void;
  setResults: (results: PhraseSearchResult[] | null) => void;
  changeSelectedIndex: (increment: number) => void; // for arrow up/down behaviour
}

export default create<SearchState>()(
  devtools((set, get) => ({
    query: "",
    resultsQuery: "",
    results: null,
    selectedIndex: null,
    isOpen: false,

    openSearch: () => set((state) => ({ ...state, isOpen: true })),
    closeSearch: () => set((state) => ({ ...state, isOpen: false })),
    setQuery: (query: string) => {
      if (query !== get().query) {
        set((state) => ({
          ...state,
          query,
          selectedIndex: null, // reset any previous selection
          isOpen: true, // could be false if user used ESC to close
        }));
      }
    },
    setSelectedIndex: (index) =>
      set((state) => ({ ...state, selectedIndex: index })),
    changeSelectedIndex: (change) =>
      set((state) => {
        const nrOfResults = state.results?.length ?? 0;
        let newIndex: number;
        if (state.selectedIndex === null) {
          newIndex = (change - 1) % nrOfResults;
        } else {
          newIndex = (state.selectedIndex + change) % nrOfResults;
        }

        return {
          ...state,
          selectedIndex: newIndex < 0 ? nrOfResults - 1 : newIndex,
        };
      }),
    setResults: (results) =>
      set((state) => ({ ...state, results, resultsQuery: state.query })),
  }))
);
