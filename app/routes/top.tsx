import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PhraseShare } from "@prisma/client";
import React from "react";
import { getPhrases } from "~/models/phrase.server";
import { getUserId } from "~/session.server";
import type { LoaderArgs } from "@remix-run/server-runtime";
import PhraseList from "~/components/PhraseList";
import getPageSkip from "~/utils/pagination";
import H1 from "~/components/H1";

const itemsPerPage = 12;

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  const [phrases, count] = await getPhrases(
    { share: PhraseShare.PUBLIC },
    "likesSum",
    itemsPerPage,
    getPageSkip(request, itemsPerPage),
    userId
  );
  return json({ phrases, count });
}

export function shouldRevalidate() {
  return false; // disable refetching which is never what the user wants
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <main className="flex h-full flex-col px-2 lg:px-0">
      <H1 className="pl-3">Top</H1>
      <PhraseList
        phrases={data.phrases}
        count={data.count}
        skip={itemsPerPage}
      />
    </main>
  );
}
