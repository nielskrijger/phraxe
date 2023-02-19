import type { ActionArgs } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { redirectBack } from "~/utils/routing";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  console.log("userId", userId);
  return redirectBack(request, { fallback: "/" });
}
