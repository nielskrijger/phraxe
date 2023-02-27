import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import tippyStylesheetUrl from "tippy.js/dist/tippy.css";
import Header from "~/components/header/Header";
import { LanguageProvider, parseAcceptLanguage } from "~/utils/language";
import { getUser } from "~/session.server";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: tippyStylesheetUrl },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "phraXe",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request), // Sets up user session
    languages: parseAcceptLanguage(request),
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <LanguageProvider languages={data.languages}>
      <html lang="en" className="text-[14px]">
        <head>
          <Meta />
          <Links />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Arvo:wght@400;700&family=Inter:wght@200;400;700;900&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="align-center flex min-h-screen flex-col">
          <Header />

          <div className="grid flex-grow">
            <div className="mx-auto grid w-full max-w-6xl flex-col py-3">
              <Outlet />
            </div>
          </div>

          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </LanguageProvider>
  );
}
