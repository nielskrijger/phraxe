import * as React from "react";
import type { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function H4({ className, children }: Props) {
  return <h4 className={clsx(className, "pb-2 text-gray-600")}>{children}</h4>;
}
