import * as React from "react";
import type { DetailedHTMLProps } from "react";
import { forwardRef } from "react";
import clsx from "clsx";
import type { InputGroupProps } from "~/components/InputGroup";
import InputGroup from "~/components/InputGroup";
import { TextareaAutosize } from "@mui/material";
import type { TextareaAutosizeProps } from "@mui/base/TextareaAutosize/TextareaAutosize";

type Props = InputGroupProps &
  DetailedHTMLProps<TextareaAutosizeProps, HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ error, id, className, label, ...props }, ref) => {
    return (
      <InputGroup id={id} error={error} label={label}>
        <TextareaAutosize
          ref={ref}
          id={id}
          name={id}
          className={clsx(
            className,
            "w-full rounded-md border border-slate-400 p-2 outline-0 hover:border-indigo-400 focus:border-primary focus:bg-indigo-50",
            { "border-red-600": !!error }
          )}
          aria-invalid={error ? true : undefined}
          aria-errormessage={error ? `${id}-error` : undefined}
          {...props}
        />
      </InputGroup>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
