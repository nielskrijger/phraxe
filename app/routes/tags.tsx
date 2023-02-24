import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { searchTagOptions } from "~/models/tag.server";
import { badRequest } from "~/utils/error";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  if (!q) {
    return badRequest({ objectType: "Query parameter 'q' is required" });
  }

  const language = url.searchParams.get("language");
  if (!language) {
    return badRequest({ objectType: "Query parameter 'language' is required" });
  }

  const tags = await searchTagOptions(q, language, 5);
  return json({ tags });
}
