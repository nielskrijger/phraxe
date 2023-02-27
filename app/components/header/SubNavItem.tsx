import type { ReactNode } from "react";
import { Link, useLocation } from "@remix-run/react";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  to: string;
};

export default function SubNavItem({ to, children }: Props) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className={clsx("px-3 py-2 font-bold uppercase hover:text-slate-600", {
        "border-b-2 border-primary pb-1 text-primary": active,
        "pb-2": !active,
      })}
    >
      {children}
    </Link>
  );
}
