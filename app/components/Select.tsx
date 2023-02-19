import clsx from "clsx";
import ReactSelect from "react-select";
import React from "react";

type Props = {
  error?: string | null | undefined;
  id: string;
  label: string;
};

export default function Select() {
  return (
    <ReactSelect
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
      aria-invalid={error ? true : undefined}
      aria-errormessage={error ? `${id}-error` : undefined}
      unstyled
      classNames={{
        control: (state) =>
          clsx("w-full rounded border border-slate-400 px-2 py-1 bg-white", {
            "hover:outline-indigo-500": state.isFocused,
          }),
        placeholder: () => "text-slate-400",
        multiValue: (state) =>
          clsx("rounded-xl bg-slate-200 text-sm text-black mr-2", {
            "bg-slate-300 text-gray-600": state.isFocused,
          }),
        multiValueLabel: () => "pl-3 pr-0.5 py-1",
        multiValueRemove: () => "pl-0.5 pr-2 hover:text-red-500",
      }}
    />
  );
}
