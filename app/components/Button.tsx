import * as React from "react";
import type { ReactNode } from "react";
import clsx from "clsx";
import { useNavigate } from "react-router";

type Props = {
  children: ReactNode;
  to?: string;
  fullWidth?: boolean;
  className?: string;
};

export default function Button({
  children,
  className,
  to,
  fullWidth = false,
}: Props) {
  const navigate = useNavigate();

  return (
    <button
      type={to ? "button" : "submit"}
      onClick={to ? () => navigate(to) : undefined}
      className={clsx(
        className,
        "rounded-full bg-black py-2 px-6 text-white hover:bg-gray-600 focus:bg-gray-500",
        { "w-full": fullWidth }
      )}
    >
      {children}
    </button>
  );
}
