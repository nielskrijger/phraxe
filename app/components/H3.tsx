import * as React from "react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function H3({ children }: Props) {
  return <h3 className="font-serif text-xl font-bold">{children}</h3>;
}
