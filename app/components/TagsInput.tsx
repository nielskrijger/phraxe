import type { KeyboardEventHandler } from "react";
import React, { useState } from "react";
import Creatable from "react-select/creatable";
import clsx from "clsx";
import InputGroup from "~/components/InputGroup";

const components = {
  DropdownIndicator: null,
};

type Option = {
  readonly label: string;
  readonly value: string;
};

const createOption = (label: string) => ({
  label,
  value: label,
});

type Props = {
  error?: string | null | undefined;
  id: string;
  label: string;
};

export default function TagsInput({ error, id, label }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState<readonly Option[]>([]);

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setValue((prev) => [...prev, createOption(inputValue)]);
        setInputValue("");
        event.preventDefault();
    }
  };

  return (
    <InputGroup id={id} error={error} label={label}>
      <Creatable
        components={components}
        inputValue={inputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        onChange={(newValue) => setValue(newValue)}
        onInputChange={(newValue) => setInputValue(newValue)}
        onKeyDown={handleKeyDown}
        placeholder="Type something and press enter..."
        value={value}
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-errormessage={error ? `${id}-error` : undefined}
        unstyled
        delimiter="|"
        classNames={{
          control: (state) =>
            clsx(
              "w-full rounded border border-slate-400 px-2 py-1 bg-white outline-0 hover:border-indigo-400",
              {
                "outline outline-indigo-500 border-indigo-600 bg-indigo-50":
                  state.isFocused,
                "border-red-600": !!error,
              }
            ),
          placeholder: () => "text-slate-400",
          multiValue: (state) =>
            clsx("rounded-xl bg-gray-700 text-sm text-white mr-2", {
              "bg-slate-300 text-gray-600": state.isFocused,
            }),
          multiValueLabel: () => "pl-3 pr-0.5 py-1",
          multiValueRemove: () => "pl-0.5 pr-2 hover:text-red-500",
          clearIndicator: () => "cursor-pointer",
        }}
      />
    </InputGroup>
  );
}
