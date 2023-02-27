import * as React from "react";
import { Link as RemixLink } from "@remix-run/react";
import type { ReactNode } from "react";
import type { To } from "@remix-run/router";

type Props = {
  to: To;
  isExternal?: boolean;
  children: ReactNode;
};

export default function Link({ to, children, isExternal = false }: Props) {
  if (isExternal) {
    if (typeof to !== "string") {
      throw new Error("Expected link.to to be a string");
    }

    return (
      <a
        href={to}
        target="_blank"
        rel="noreferrer"
        className="text-primary hover:text-black"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </a>
    );
  }

  return (
    <RemixLink
      to={to}
      className="text-primary hover:text-black"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </RemixLink>
  );
}
