import * as React from "react";
import type { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function Card({ children, onClick, className }: Props) {
  return (
    <div
      className={clsx(className, "rounded-xl border bg-white p-3 lg:p-4", {
        "cursor-pointer hover:border-indigo-400": onClick,
      })}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "link" : undefined}
    >
      {children}
    </div>
  );
}
