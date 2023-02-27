import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { badRequest } from "~/utils/error";
import { searchPhrases } from "~/models/phrase.server";
import { getPreferredLanguages } from "~/utils/language";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  if (!q) {
    return badRequest({ objectType: "Query parameter 'q' is required" });
  }

  const languages = getPreferredLanguages(request);
  const phrases = await searchPhrases(q, languages, 5, 0);
  return json({ phrases });
}

export function shouldRevalidate() {
  return false;
}
