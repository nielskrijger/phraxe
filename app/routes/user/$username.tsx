import type { LoaderArgs, MetaFunction, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useCatch, useLoaderData } from "@remix-run/react";
import React from "react";
import { getPhrasesAndCount } from "~/models/phrase.server";
import { getUserId, requireUser } from "~/session.server";
import { getUserByUsername } from "~/models/user.server";
import H1 from "~/components/H1";
import type { Prisma } from "@prisma/client";
import { PhraseShare } from "@prisma/client";
import getPageSkip from "~/utils/pagination";
import PhraseList from "~/components/PhraseList";
import { notFound } from "~/utils/error";
import NotFound from "~/components/NotFound";
import { ITEMS_PER_PAGE } from "~/constants";

export async function loader({ request, params }: LoaderArgs) {
  let username = params.username!.toLowerCase();
  let where: Prisma.PhraseWhereInput = {};

  if (username === "self") {
    const user = await requireUser(request);
    username = user.usernameLower;
  } else {
    where.share = PhraseShare.PUBLIC;
  }
  where.user = { usernameLower: username };

  const userPromise = getUserByUsername(username);
  const userId = await getUserId(request);
  const phrasePromise = getPhrasesAndCount(
    where,
    "createdAt",
    ITEMS_PER_PAGE,
    getPageSkip(request, ITEMS_PER_PAGE),
    userId
  );

  const [user, [phrases, count, skip]] = await Promise.all([
    userPromise,
    phrasePromise,
  ]);

  if (!user) {
    notFound();
  }
  return json({ username: user?.username, phrases, count, skip });
}

type LoaderData = SerializeFrom<typeof loader>;

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return {
    title: data?.username ?? "Not found",
  };
};

export function shouldRevalidate({
  formAction,
}: Parameters<ShouldRevalidateFunction>[0]) {
  return formAction !== "/like"; // prevent likes from triggering a refetch
}

export default function Index() {
  const data = useLoaderData<LoaderData>();
  return (
    <div className="px-3 lg:px-0">
      <H1 className="pl-3">{data.username}</H1>
      <PhraseList
        phrases={data.phrases}
        count={data.count}
        skip={ITEMS_PER_PAGE}
      />
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <NotFound title="User not found" />;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
