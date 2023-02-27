import { prisma } from "~/db.server";
import type { User, Phrase } from "@prisma/client";
import { Prisma } from "@prisma/client";
import PhraseWhereInput = Prisma.PhraseWhereInput;
import { customAlphabet } from "nanoid";
import { slugify } from "~/utils/slugify";
import { createOrConnectTagsQuery } from "~/models/tag.server";

export async function getPhrase(id: string, userId?: string) {
  return prisma.phrase.findFirst({
    where: { id },
    include: {
      user: {
        select: {
          username: true,
          usernameLower: true,
        },
      },
      tags: true,
      likes: userId ? { where: { userId } } : false,
    },
  });
}

const nanoid = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10
);

export async function createPhrase({
  text,
  type,
  title,
  language,
  share,
  description,
  attribution,
  userId,
  source,
  tags,
}: Pick<
  Phrase,
  | "text"
  | "type"
  | "language"
  | "title"
  | "share"
  | "description"
  | "source"
  | "attribution"
> & { userId: string; tags: string[] }) {
  return prisma.phrase.create({
    data: {
      id: nanoid(),
      type,
      slug: title ? slugify(title) : slugify(text),
      text,
      title,
      language,
      share,
      description,
      attribution,
      source,
      tags: await createOrConnectTagsQuery(tags, language),
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function getPhrasesAndCount(
  where: PhraseWhereInput,
  orderBy: "createdAt" | "likesTotal",
  take: number,
  skip: number,
  userId?: string
) {
  return Promise.all([
    getPhrases(where, orderBy, take, skip, userId),
    prisma.phrase.count({ where }),
    skip,
  ]);
}

export function getPhrases(
  where: PhraseWhereInput,
  orderBy: "createdAt" | "likesTotal",
  take: number,
  skip: number,
  userId?: string
) {
  return prisma.phrase.findMany({
    take,
    skip,
    where,
    include: {
      user: {
        select: {
          username: true,
          usernameLower: true,
        },
      },
      tags: true,
      likes: userId ? { where: { userId } } : false,
    },
    orderBy: [{ [orderBy]: "desc" }],
  });
}

export function deletePhrase({
  id,
  userId,
}: Pick<Phrase, "id"> & { userId: User["id"] }) {
  return prisma.phrase.deleteMany({
    where: { id, userId },
  });
}

export type PhraseSearchResult = Pick<
  Phrase,
  "id" | "title" | "slug" | "text"
> & { rank: number };

/**
 * Applies a websearch query and treats the last word as a partial match.
 */
export async function searchPhrases(
  q: string,
  languages: string[],
  take: number,
  skip: number
) {
  // Based on https://stackoverflow.com/a/74255689/2044661
  return prisma.$queryRaw<PhraseSearchResult[]>`
      SELECT p.id, p.slug, p.title, p.text,
         ts_rank(p.searchable, to_tsquery(
             lang_to_regconfig(p."language"),
             websearch_to_tsquery(lang_to_regconfig(p."language"), ${q})::text || ':*'
         )) AS rank
      FROM "phrases" AS p
      WHERE p.language IN (${Prisma.join(languages)})
        AND p.share = 'PUBLIC'

        -- numnode prevents errors when websearch_to_tsquery removes all search 
        -- terms (like "in", "the", etc) resulting in an empty ":*"
        AND numnode(websearch_to_tsquery(lang_to_regconfig(p."language"), ${q})) > 0 
        AND p.searchable @@ to_tsquery(
            lang_to_regconfig(p."language"),
            websearch_to_tsquery(lang_to_regconfig(p."language"), ${q})::text || ':*'
        )
      ORDER BY rank DESC
      LIMIT ${take}
      OFFSET ${skip}`;
}

/**
 * Returns the number of records that match a search query.
 */
export async function searchPhrasesCount(q: string, languages: string[]) {
  const count = await prisma.$queryRaw<{ count: BigInteger }[]>`
      SELECT count(*) AS count
      FROM "phrases" AS p
      WHERE p.language IN (${Prisma.join(languages)})
        AND p.share = 'PUBLIC'
        AND numnode(websearch_to_tsquery(lang_to_regconfig(p."language"), ${q})) > 0
        AND p.searchable @@ to_tsquery(
              lang_to_regconfig(p."language"),
              websearch_to_tsquery(lang_to_regconfig(p."language"), ${q})::text || ':*'
          )`;

  // The count(*) function returns a BigInt, so we convert it to a Number data
  // type, which can be serialized over JSON.
  return Number(count[0].count);
}
