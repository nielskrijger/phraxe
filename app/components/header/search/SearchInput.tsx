import type { ComponentProps, ReactElement } from "react";
import { forwardRef } from "react";
import clsx from "clsx";
import { Form } from "@remix-run/react";
import useSearchStore from "../../../store/searchStore";
import type { PhraseSearchResult } from "~/models/phrase.server";

type Props = ComponentProps<"input"> & {
  isOpen: boolean;
  phrases: PhraseSearchResult[] | null;
};

const SearchInput = forwardRef<HTMLInputElement, Props>(
  ({ isOpen, className, phrases, ...props }: Props, ref): ReactElement => {
    const openSearch = useSearchStore((state) => state.openSearch);
    const closeSearch = useSearchStore((state) => state.closeSearch);

    const handleSubmit = () => {
      closeSearch();
      return true;
    };

    return (
      <Form action="/search" method="get" onSubmit={handleSubmit}>
        <input
          ref={ref}
          type="text"
          placeholder="Search..."
          name="q"
          className={clsx(
            "h-[36px] w-full rounded-xl pr-1 pl-10 outline-0",
            className,
            { "rounded-bl-none rounded-br-none": isOpen && !!phrases }
          )}
          autoComplete="off"
          onClick={openSearch}
          {...props}
        />
      </Form>
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
