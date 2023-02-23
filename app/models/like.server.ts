import { prisma } from "~/db.server";
import type { Like } from "@prisma/client";
import { LikeObjectType } from ".prisma/client";
import { Prisma } from "@prisma/client";

export async function upsertLike(
  like: Pick<Like, "isDislike" | "userId" | "objectId" | "objectType">
) {
  try {
    return await prisma.$transaction(
      async (tx) => {
        // Find existing record
        const existing = await tx.like.findFirst({
          where: {
            objectId: like.objectId,
            objectType: like.objectType,
          },
          select: { id: true, isDislike: true },
        });

        // No changes
        if (existing && existing.isDislike === like.isDislike) {
          return;
        }

        // Update or create new like record
        if (existing) {
          await tx.like.update({
            where: { id: existing.id },
            data: { isDislike: like.isDislike },
          });
        } else {
          await tx.like.create({
            data: like,
          });
        }

        // Determine delta
        let sumDelta = like.isDislike ? 0 : 1;
        let countDelta = 1;
        let totalDelta = like.isDislike ? -1 : 1;
        if (existing) {
          countDelta = 0;
          sumDelta = like.isDislike ? -1 : 1;
          totalDelta = like.isDislike ? -2 : 2;
        }

        // Update object counters
        if (like.objectType === LikeObjectType.PHRASE) {
          await tx.phrase.update({
            where: {
              id: like.objectId,
            },
            data: {
              likesTotal: {
                increment: totalDelta,
              },
              likesSum: {
                increment: sumDelta,
              },
              likesCount: {
                increment: countDelta,
              },
            },
          });
        }
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    );
  } catch (err) {
    // Transaction is rolled back automatically, we just ignore the error.
    // These errors are likely due to spamming the like endpoint.
  }
}

export async function deleteLike(
  objectType: LikeObjectType,
  objectId: string,
  userId: string
) {
  try {
    return await prisma.$transaction(
      async (tx) => {
        const deleted = await tx.like.delete({
          where: {
            objectId_objectType_userId: { objectId, objectType, userId },
          },
        });

        // Update object counters
        if (deleted?.objectType === LikeObjectType.PHRASE) {
          await tx.phrase.update({
            where: {
              id: deleted.objectId,
            },
            data: {
              likesSum: {
                increment: deleted.isDislike ? 0 : -1,
              },
              likesCount: {
                increment: -1,
              },
            },
          });
        }
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    );
  } catch (err) {
    // Transaction is rolled back automatically, we just ignore the error.
    // These errors are likely due to spamming the like endpoint.
  }
}
