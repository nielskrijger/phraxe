import ReactPaginate from "react-paginate";
import React from "react";
import { useLocation, useNavigate } from "@remix-run/react";
import Phrase from "~/components/Phrase";
import type { PhraseContentType } from "~/components/PhraseContent";
import clsx from "clsx";
import NotFound from "~/components/NotFound";

type Props = {
  phrases: PhraseContentType[];
  count: number;
  skip: number;
  highlightWords?: string[];
};

// Use important due to https://github.com/AdeleD/react-paginate/issues/430
const activeClass = "font-bold bg-slate-200";
const inActiveClass =
  "border border-transparent hover:text-primary hover:bg-indigo-100 hover:text-primary py-1 px-2";

export default function PhraseList({
  phrases,
  count,
  skip,
  highlightWords,
}: Props) {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const handlePageChange = ({ selected }: { selected: number }) => {
    const query = new URLSearchParams(search);
    query.set("page", `${selected + 1}`);
    navigate({ pathname: pathname, search: query.toString() });
  };

  const query = new URLSearchParams(search);

  return (
    <div className="flex w-full max-w-6xl flex-row flex-col gap-2 place-self-start">
      {phrases.map((phrase) => (
        <Phrase
          phrase={phrase}
          key={phrase.id}
          highlightWords={highlightWords}
        />
      ))}

      {phrases.length === 0 && <NotFound title="No phrases found" />}
      {phrases.length > 0 && (
        <ReactPaginate
          initialPage={parseInt(`${query.get("page")}`) - 1 ?? 1}
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageChange}
          disableInitialCallback={true}
          renderOnZeroPageCount={() => null}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          pageCount={Math.ceil(count / skip)}
          previousLabel="Previous"
          pageLinkClassName={inActiveClass}
          activeLinkClassName={activeClass}
          nextLinkClassName={clsx(inActiveClass, "max-[500px]:hidden")}
          previousLinkClassName={clsx(inActiveClass, "max-[500px]:hidden")}
          containerClassName="flex justify-center my-6 align-center gap-x-1"
        />
      )}
    </div>
  );
}
