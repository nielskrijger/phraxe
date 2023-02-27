import * as React from "react";
import type { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function H1({ children, className }: Props) {
  return (
    <h1 className={clsx(className, "pb-3 text-3xl font-bold")}>{children}</h1>
  );
}
