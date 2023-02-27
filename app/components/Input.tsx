import * as React from "react";
import type { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { forwardRef } from "react";
import type { InputGroupProps } from "~/components/InputGroup";
import InputGroup from "~/components/InputGroup";
import clsx from "clsx";

type Props = InputGroupProps &
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    error?: string | null | undefined;
    className?: string;
  };

const Input = forwardRef<HTMLInputElement, Props>(
  ({ id, error, name, className, description, label, ...props }, ref) => {
    return (
      <InputGroup id={id} error={error} label={label} description={description}>
        <input
          ref={ref}
          id={id}
          name={id}
          required
          type="text"
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-error`}
          className={clsx(
            "mb-1 w-full rounded-md border border-slate-400 p-2 outline-0 hover:border-indigo-400 focus:border-primary focus:bg-indigo-50",
            { "border-red-600": !!error }
          )}
          {...props}
        />
      </InputGroup>
    );
  }
);

Input.displayName = "Input";

export default Input;
