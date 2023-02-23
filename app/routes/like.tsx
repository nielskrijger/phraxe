import type { ActionArgs } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { deleteLike, upsertLike } from "~/models/like.server";
import { LikeObjectType } from "@prisma/client";
import { badRequest } from "~/utils/error";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const isDislike = formData.get("isDislike") as string;
  const objectId = formData.get("objectId") as string;
  const objectType = formData.get("objectType");

  if (!validateLikeObjectType(objectType)) {
    return badRequest({ objectType: "Invalid objectType" });
  }

  if (request.method === "DELETE") {
    await deleteLike(objectType, objectId, userId);
  } else {
    await upsertLike({
      userId,
      isDislike: isDislike === "true",
      objectId,
      objectType,
    });
  }

  return null;
}

function validateLikeObjectType(str: unknown): str is LikeObjectType {
  return (
    typeof str === "string" &&
    Object.keys(LikeObjectType)
      .map((key): string => LikeObjectType[key as keyof typeof LikeObjectType])
      .includes(str)
  );
}
