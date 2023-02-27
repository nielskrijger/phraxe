import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import {
  getPhrases,
  searchPhrases,
  searchPhrasesCount,
} from "~/models/phrase.server";
import { getPreferredLanguages } from "~/utils/language";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useLoaderData, useLocation } from "@remix-run/react";
import H2 from "~/components/H2";
import PhraseList from "~/components/PhraseList";
import React from "react";
import { ITEMS_PER_PAGE } from "~/constants";
import getPageSkip from "~/utils/pagination";
import { getUserId } from "~/session.server";
import { words } from "lodash";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  if (!q) {
    return json({ phrases: [], count: 0 });
  }

  // To avoid creating an overly complicated SQL search query, we will use the
  // same logic as the quick search rather than attempting to load all details
  // at once when performing the search.
  const languages = getPreferredLanguages(request);
  const [quickSearch, count] = await Promise.all([
    searchPhrases(
      q,
      languages,
      ITEMS_PER_PAGE,
      getPageSkip(request, ITEMS_PER_PAGE)
    ),
    searchPhrasesCount(q, languages),
  ]);

  // Get full phrases and it's details
  let phrases: Awaited<ReturnType<typeof getPhrases>> = [];
  if (quickSearch.length > 0) {
    const userId = await getUserId(request);
    phrases = await getPhrases(
      { id: { in: quickSearch.map(({ id }) => id) } },
      "likesTotal",
      quickSearch.length,
      0,
      userId
    );
  }

  return json({ phrases, count });
}

export function shouldRevalidate({
  formAction,
}: Parameters<ShouldRevalidateFunction>[0]) {
  return formAction !== "/like"; // prevent likes from triggering a refetch
}

export default function Index() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const data = useLoaderData<typeof loader>();
  return (
    <main className="flex h-full flex-col px-2 lg:px-0">
      <H2 className="pl-3">Searching &quot;{params.get("q")}&quot;</H2>

      <PhraseList
        phrases={data.phrases}
        count={data.count}
        skip={ITEMS_PER_PAGE}
        highlightWords={words(params.get("q")!)}
      />
    </main>
  );
}
