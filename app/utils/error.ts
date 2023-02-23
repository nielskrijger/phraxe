import { json } from "@remix-run/node";

export function badRequest(errors: Record<string, string | null>) {
  return json({ errors }, { status: 400 });
}

export function forbidden() {
  throw new Response("Not Found", { status: 403 });
}

export function notFound() {
  throw new Response("Not Found", { status: 404 });
}
