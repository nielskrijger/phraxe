import diacritics from "diacritics";
import { prisma } from "~/db.server";

function findTags(tags: string[], language: string) {
  return prisma.tag.findMany({
    where: {
      OR: tags.map((tag) => ({ nameNormalized: normalizeTag(tag), language })),
    },
  });
}

export function normalizeTag(name: string) {
  return diacritics.remove(name).toLowerCase();
}

/**
 * createOrConnectTagsQuery assembles a query to be used to create new tags or
 * connect to existing ones. We cannot use Prisma's connect or connectOrCreate
 * which only works for primary keys (not compound unique indexes).
 */
export async function createOrConnectTagsQuery(
  tags: string[],
  language: string
) {
  const existingTags = await findTags(tags, language);

  const newTags = tags
    .map((tag) => ({
      name: tag,
      nameNormalized: normalizeTag(tag),
      language,
    }))
    .filter((tag) => {
      return !existingTags.some(
        (e) =>
          e.language === language && tag.nameNormalized === e.nameNormalized
      );
    });

  return {
    create: newTags,
    connect: existingTags.map(({ id }) => ({ id })),
  };
}

export async function searchTagOptions(
  q: string,
  language: string,
  maxResults: number
) {
  const normalized = normalizeTag(q);

  // After testing with Trigram (similarity) indexes, it seems a basic LIKE is
  // slightly faster even in data sets of over 50.000 records (2-5ms).
  const tags = await prisma.$queryRaw<
    { name: string; name_normalized: string }[]
  >`
      SELECT "name", "name_normalized"
      FROM "tags"
      WHERE "name_normalized" LIKE ${`%${normalized}%`}
        AND "language" = ${language}
      ORDER BY CASE
         WHEN "name_normalized" LIKE ${normalized} THEN 1
         WHEN "name_normalized" LIKE ${`${normalized}%`} THEN 2
         ELSE length("name")
      END
      LIMIT ${maxResults};
  ;`;
  return tags.map((tag) => ({ label: tag.name, value: tag.name_normalized }));
}
