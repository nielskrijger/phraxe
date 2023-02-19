import * as React from "react";
import type { ReactNode } from "react";

export type InputGroupProps = {
  className?: string;
  label: string;
  id: string;
  error?: string | null | undefined;
  description?: string;
};

export default function InputGroup({
  children,
  label,
  id,
  error,
  description,
}: InputGroupProps & { children: ReactNode }) {
  return (
    <div className="mt-1 flex w-full flex-col">
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      {children}

      {description && (
        <div className="text-sm text-slate-500">{description}</div>
      )}

      {error && (
        <div className="pt-1 text-red-700" id={`${id}-error`}>
          {error}
        </div>
      )}
    </div>
  );
}
