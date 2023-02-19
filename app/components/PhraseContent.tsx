import type { ReactElement } from "react";
import React from "react";
import { DateTime } from "luxon";
import H3 from "~/components/H3";
import type { Phrase as PhraseType, Tag, User } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import Link from "~/components/Link";
import clsx from "clsx";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import Like from "~/components/Like";

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

type Props = {
  detail?: boolean;
  phrase: SerializeFrom<PhraseType> & {
    tags: SerializeFrom<Tag>[];
    user: Pick<User, "username" | "usernameLower"> | null;
  };
};

export default function PhraseContent({ phrase, detail = false }: Props) {
  return (
    <>
      {phrase.title && <H3>{phrase.title}</H3>}

      <p
        className={clsx("xl:text-lg", {
          "font-bold": detail,
          "mt-1": phrase.title && detail,
        })}
      >
        {phrase.text}
      </p>

      {detail && !!phrase.description && (
        <div className="mt-3 mb-2">
          {/* @ts-ignore */}
          <ReactMarkdown remarkPlugins={[gfm]}>
            {phrase.description}
          </ReactMarkdown>
        </div>
      )}

      <div className="flex flex-row flex-wrap items-center gap-x-4 gap-x-4 gap-y-2 pt-1 pb-2">
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
          <div className="flex grow justify-end gap-2">
            {phrase.tags.map(({ id, name }) => (
              <Link to="/" key={id}>
                <span className="rounded-xl bg-slate-200 px-3 py-1 text-sm text-black hover:bg-indigo-200 hover:text-indigo-600">
                  {name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Like count={phrase.likesCount} sum={phrase.likessum} />
    </>
  );
}
