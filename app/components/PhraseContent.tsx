import type { ReactElement } from "react";
import React from "react";
import { DateTime } from "luxon";
import H3 from "~/components/H3";
import type { Phrase as PhraseType, Tag, User, Like } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import Link from "~/components/Link";
import clsx from "clsx";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { LikeObjectType } from "@prisma/client";
import LikeButton from "~/components/LikeButton";
import { PhraseShare } from ".prisma/client";
import { Lock } from "@mui/icons-material";
import Tippy from "@tippyjs/react";

type PhraseSourceProps = { source: string | null };

function PhraseSource({ source }: PhraseSourceProps): ReactElement | null {
  if (!source) {
    return null;
  }

  try {
    const url = new URL(source);
    return (
      <>
        &nbsp;| Source{" "}
        <Link to={source} isExternal>
          {url.hostname}
        </Link>
      </>
    );
  } catch (_) {
    return <>&nbsp;| Source {source}</>;
  }
}

export type PhraseContentType = SerializeFrom<PhraseType> & {
  tags: SerializeFrom<Tag>[];
  user: Pick<User, "username" | "usernameLower"> | null;
  likes: SerializeFrom<Like>[];
};

type Props = {
  detail?: boolean;
  phrase: PhraseContentType;
};

export default function PhraseContent({ phrase, detail = false }: Props) {
  return (
    <>
      {phrase.title && (
        <div className="flex flex-row gap-2">
          <H3>{phrase.title}</H3>
          {phrase.share === PhraseShare.RESTRICTED && (
            <Tippy content="Private" placement="right" delay={500}>
              <Lock className="text-slate-300" />
            </Tippy>
          )}
        </div>
      )}

      <p
        className={clsx("xl:text-lg", {
          "font-bold": detail,
          "mt-1": phrase.title && detail,
        })}
      >
        {phrase.text}
      </p>

      {detail && !!phrase.description && (
        <div className="mb-1">
          {/* @ts-ignore */}
          <ReactMarkdown remarkPlugins={[gfm]}>
            {phrase.description}
          </ReactMarkdown>
        </div>
      )}

      <div className="grid auto-cols-max grid-cols-1 items-end gap-x-4 gap-y-3 sm:grid-cols-2">
        <div className="text-sm text-gray-400">
          {DateTime.fromJSDate(new Date(phrase.createdAt)).toRelative()} by{" "}
          {phrase.user && (
            <Link to={`/user/${phrase.user.usernameLower}`}>
              {phrase.user.username}
            </Link>
          )}
          {phrase.attribution && (
            <>&nbsp;| Attributed to {phrase.attribution}</>
          )}
          <PhraseSource source={phrase.source} />
        </div>

        {phrase.tags && (
          <div className="row-span-2 flex grow gap-x-2 sm:justify-end">
            {phrase.tags.map(({ id, name }) => (
              <Link to="/" key={id}>
                <div className="rounded-xl bg-slate-200 px-3 py-1.5 text-sm text-black hover:bg-indigo-200 hover:text-indigo-600">
                  {name}
                </div>
              </Link>
            ))}
          </div>
        )}

        {phrase.share === PhraseShare.PUBLIC && (
          <LikeButton
            count={phrase.likesCount}
            sum={phrase.likesSum}
            objectId={phrase.id}
            objectType={LikeObjectType.PHRASE}
            like={phrase.likes?.[0]}
          />
        )}
      </div>
    </>
  );
}
