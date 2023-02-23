import { prisma } from "~/db.server";

export async function findTags(tags: string[], language: string) {
  return prisma.tag.findMany({
    where: { OR: tags.map((tag) => ({ name: tag, language })) },
  });
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
    .filter((tag) => {
      return !existingTags.some(
        (e) => e.language === language && tag === e.name
      );
    })
    .map((tag) => ({ name: tag, language }));

  return {
    create: newTags,
    connect: existingTags.map(({ id }) => ({ id })),
  };
}
