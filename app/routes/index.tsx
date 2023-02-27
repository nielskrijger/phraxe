import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { PhraseShare } from "@prisma/client";
import React from "react";
import { getPhrasesAndCount } from "~/models/phrase.server";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { getUserId } from "~/session.server";
import PhraseList from "~/components/PhraseList";
import getPageSkip from "~/utils/pagination";
import H2 from "~/components/H2";
import { ITEMS_PER_PAGE } from "~/constants";
import { getPreferredLanguages } from "~/utils/language";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  const languages = getPreferredLanguages(request);
  const [phrases, count] = await getPhrasesAndCount(
    { share: PhraseShare.PUBLIC, language: { in: languages } },
    "createdAt",
    ITEMS_PER_PAGE,
    getPageSkip(request, ITEMS_PER_PAGE),
    userId
  );
  return json({ phrases, count });
}

export function shouldRevalidate({
  formAction,
}: Parameters<ShouldRevalidateFunction>[0]) {
  return formAction !== "/like"; // prevent likes from triggering a refetch
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <main className="flex h-full flex-col px-2 lg:px-0">
      <H2 className="pl-3">New phrases</H2>

      <PhraseList
        phrases={data.phrases}
        count={data.count}
        skip={ITEMS_PER_PAGE}
      />
    </main>
  );
}
