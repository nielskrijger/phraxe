import * as React from "react";
import type { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function H2({ children, className }: Props) {
  return (
    <h2 className={clsx(className, "pb-2 font-serif text-2xl font-bold")}>
      {children}
    </h2>
  );
}
