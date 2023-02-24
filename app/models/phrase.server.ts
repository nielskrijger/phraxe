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

export function getPhrases(
  where: PhraseWhereInput,
  orderBy: "createdAt" | "likesTotal",
  take: number,
  skip: number,
  userId?: string
) {
  return Promise.all([
    prisma.phrase.findMany({
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
    }),
    prisma.phrase.count({ where }),
    skip,
  ]);
}

export function deletePhrase({
  id,
  userId,
}: Pick<Phrase, "id"> & { userId: User["id"] }) {
  return prisma.phrase.deleteMany({
    where: { id, userId },
  });
}
