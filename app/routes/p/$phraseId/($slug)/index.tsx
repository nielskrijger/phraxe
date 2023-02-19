import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { deletePhrase, getPhrase } from "~/models/phrase.server";
import { requireUserId } from "~/session.server";
import React from "react";
import PhraseContent from "~/components/PhraseContent";
import Card from "~/components/Card";

export async function loader({ params }: LoaderArgs) {
  invariant(params.phraseId, "phraseId not found");

  const phrase = await getPhrase(params.phraseId);
  if (!phrase) {
    throw new Response("Not Found", { status: 404 });
  }
  // TODO forbidden
  return json({ phrase });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.phraseId, "noteId not found");

  await deletePhrase({ userId, id: params.phraseId });

  return redirect("/p");
}

export default function PhraseDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <main className="flex flex-col px-2 lg:px-0">
      <Card>
        <PhraseContent phrase={data.phrase} detail={true} />
      </Card>
    </main>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
