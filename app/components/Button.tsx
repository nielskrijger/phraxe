import * as React from "react";
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import clsx from "clsx";
import { useNavigate } from "@remix-run/react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  to?: string;
  fullWidth?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function Button({
  children,
  className,
  to,
  fullWidth = false,
  onClick,
  ...props
}: Props) {
  const navigate = useNavigate();

  return (
    <button
      type={to || onClick ? "button" : "submit"}
      onClick={to ? () => navigate(to) : onClick}
      name="submitName"
      value="submitValue"
      className={clsx(
        className,
        "rounded-full bg-black py-2 px-6 text-white hover:bg-slate-600 focus:bg-slate-500",
        { "w-full": fullWidth }
      )}
      {...props}
    >
      {children}
    </button>
  );
}
