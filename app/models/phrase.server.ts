import { prisma } from "~/db.server";
import type { User, Phrase } from "@prisma/client";
import { Prisma } from "@prisma/client";
import PhraseWhereInput = Prisma.PhraseWhereInput;
import { customAlphabet } from "nanoid";
import { slugify } from "~/utils/slugify";
import { createOrConnectTagsQuery } from "~/models/tag.server";

export function getPhrase(id: string) {
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
    },
  });
}

export function getUserPhrases({ userId }: { userId: User["id"] }) {
  return prisma.phrase.findMany({
    where: { userId },
    select: { id: true, text: true },
    orderBy: { updatedAt: "desc" },
  });
}

const nanoid = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10
);

export async function createPhrase({
  text,
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

export function getPhrases(where: PhraseWhereInput, orderBy: "createdAt") {
  return prisma.phrase.findMany({
    take: 25,
    where,
    include: {
      user: {
        select: {
          username: true,
          usernameLower: true,
        },
      },
      tags: true,
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
