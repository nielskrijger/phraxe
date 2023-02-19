import React, { useState } from "react";
import { RadioGroup as HeadlessRadioGroup } from "@headlessui/react";
import clsx from "clsx";
import type { InputGroupProps } from "~/components/InputGroup";
import InputGroup from "~/components/InputGroup";

export type Option = {
  value: string;
  title: string;
  description?: string;
};

type Props = InputGroupProps & {
  options: Option[];
  value: string;
  onChange?(value: string): void;
};

export default function RadioGroup({
  id,
  error,
  label,
  options,
  value,
  onChange,
}: Props) {
  const [selected, setSelected] = useState(value);

  const handleChange = (value: string) => {
    if (onChange) {
      onChange(value);
    }
    setSelected(value);
  };

  return (
    <InputGroup id={id} error={error} label={label}>
      <HeadlessRadioGroup
        value={selected}
        id={id}
        name={id}
        onChange={handleChange}
      >
        <HeadlessRadioGroup.Label className="sr-only">
          Plan
        </HeadlessRadioGroup.Label>

        <div className="flex flex-col gap-2 md:flex-row">
          {options.map(({ value, title, description }) => (
            <HeadlessRadioGroup.Option
              key={value}
              value={value}
              className={({ checked }) =>
                clsx(
                  "cursor-pointer rounded-md border border-slate-300 bg-white p-4 hover:border-indigo-600",
                  { "border-indigo-600 bg-indigo-50": checked }
                )
              }
            >
              {({ checked }) => (
                <div className="flex flex-col">
                  <HeadlessRadioGroup.Label
                    className={clsx("font-bold text-gray-900", {
                      "text-indigo-700": checked,
                    })}
                  >
                    {title}
                  </HeadlessRadioGroup.Label>
                  {description && (
                    <HeadlessRadioGroup.Description
                      as="span"
                      className={clsx("block text-sm", {
                        "text-indigo-900": checked,
                      })}
                    >
                      {description}
                    </HeadlessRadioGroup.Description>
                  )}
                </div>
              )}
            </HeadlessRadioGroup.Option>
          ))}
        </div>
      </HeadlessRadioGroup>
    </InputGroup>
  );
}
