import { json, LoaderArgs, MetaFunction, SerializeFrom } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import { getPhrases } from "~/models/phrase.server";
import { requireUser } from "~/session.server";
import { getUserByUsername } from "~/models/user.server";
import Phrase from "~/components/Phrase";
import H1 from "~/components/H1";
import type { Prisma } from "@prisma/client";
import { PhraseShare } from "@prisma/client";

export async function loader({ request, params }: LoaderArgs) {
  let username = params.username!.toLowerCase();
  let where: Prisma.PhraseWhereInput = {};

  if (username === "self") {
    const user = await requireUser(request);
    username = user.usernameLower;
  } else {
    where.share = { in: [PhraseShare.PUBLIC, PhraseShare.PUBLIC_OWNER] };
  }
  where.user = { usernameLower: username };

  const userPromise = getUserByUsername(username);
  const phrasePromise = getPhrases(where, "createdAt");

  const [user, phrases] = await Promise.all([userPromise, phrasePromise]);
  return json({ username: user?.username, phrases });
}

type LoaderData = SerializeFrom<typeof loader>;

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  console.log(data);
  return {
    title: data.username,
  };
};

export default function Index() {
  const data = useLoaderData<LoaderData>();
  return (
    <div className="px-3 lg:px-0">
      <H1 className="pl-3">{data.username}</H1>

      <div className="flex w-full max-w-6xl flex-row flex-col gap-4 place-self-start">
        {data.phrases.map((phrase) => (
          <Phrase phrase={phrase} key={phrase.id} />
        ))}
      </div>
    </div>
  );
}
