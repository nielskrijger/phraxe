import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { PhraseShare } from "@prisma/client";
import React from "react";
import { getPhrases } from "~/models/phrase.server";
import { getUserId } from "~/session.server";
import type { LoaderArgs } from "@remix-run/server-runtime";
import PhraseList from "~/components/PhraseList";
import getPageSkip from "~/utils/pagination";
import H2 from "~/components/H2";

const itemsPerPage = 12;

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  const [phrases, count] = await getPhrases(
    { share: PhraseShare.PUBLIC },
    "likesTotal",
    itemsPerPage,
    getPageSkip(request, itemsPerPage),
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
      <H2 className="pl-3">Most liked phrases</H2>

      <PhraseList
        phrases={data.phrases}
        count={data.count}
        skip={itemsPerPage}
      />
    </main>
  );
}
