import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PhraseShare } from "@prisma/client";
import React from "react";
import { getPhrases } from "~/models/phrase.server";
import H4 from "~/components/H4";
import Phrase from "~/components/Phrase";

export async function loader() {
  const phrases = await getPhrases({ share: PhraseShare.PUBLIC }, "createdAt");
  return json({ phrases });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <main className="flex h-full flex-col px-2 lg:px-0">
      <H4 className="pl-3">Recent</H4>
      <div className="flex w-full max-w-6xl flex-row flex-col gap-2 place-self-start lg:gap-3">
        {data.phrases.map((phrase) => (
          <Phrase phrase={phrase} key={phrase.id} />
        ))}
      </div>
    </main>
  );
}
