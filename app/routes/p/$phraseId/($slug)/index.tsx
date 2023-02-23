import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, MetaFunction, redirect, SerializeFrom } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { deletePhrase, getPhrase } from "~/models/phrase.server";
import { getUserId, requireUserId } from "~/session.server";
import React from "react";
import PhraseContent from "~/components/PhraseContent";
import Card from "~/components/Card";
import NotFound from "~/components/NotFound";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.phraseId, "phraseId not found");

  const userId = await getUserId(request);
  const phrase = await getPhrase(params.phraseId, userId);
  if (!phrase) {
    throw new Response("Not Found", { status: 404 });
  }
  // TODO forbidden

  return json(phrase);
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.phraseId, "noteId not found");

  await deletePhrase({ userId, id: params.phraseId });

  return redirect("/p");
}

type LoaderData = SerializeFrom<typeof loader>;

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return {
    title: data?.title ?? data?.text ?? "Not found",
  };
};

export default function PhraseDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <main className="flex flex-col px-2 lg:px-0">
      <Card>
        <PhraseContent phrase={data} detail={true} />
      </Card>
    </main>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <NotFound title="Phrase not found, it might have been deleted" />;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
