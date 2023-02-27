import clsx from "clsx";
import type { OptionsOrGroups, SingleValue } from "react-select";
import ReactSelect from "react-select";
import React, { useState } from "react";
import type { ClassNamesConfig } from "react-select/dist/declarations/src/styles";
import type { GroupBase } from "react-select/dist/declarations/src/types";
import InputGroup from "~/components/InputGroup";

export type OptionType = { label: string; value: string };

export type SelectProps = {
  error?: string | null | undefined;
  id: string;
  label: string;
  value: OptionType;
  options: OptionsOrGroups<OptionType, GroupBase<OptionType>>;
  onChange?: (newValue: SingleValue<OptionType>) => void;
};

export function selectStyles<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(error?: SelectProps["error"]): ClassNamesConfig<Option, IsMulti, Group> {
  return {
    control: (state) =>
      clsx(
        "w-full rounded-md border border-slate-400 px-2 py-1 bg-white outline-0 hover:border-indigo-400",
        {
          "outline outline-indigo-500 border-primary bg-indigo-50":
            state.isFocused,
          "border-red-600": !!error,
        }
      ),
    placeholder: () => "text-slate-400",
    multiValue: (state) =>
      clsx("rounded-xl bg-slate-700 text-sm text-white mr-2", {
        "bg-slate-300 text-slate-600": state.isFocused,
      }),
    multiValueLabel: () => "pl-3 pr-0.5 py-1",
    multiValueRemove: () => "pl-0.5 pr-2 hover:text-red-500",
    clearIndicator: () => "cursor-pointer",
    menu: () =>
      "absolute right-0 mt-2 w-56 origin-top-right divide-y divide-slate-100 rounded-md border border-slate-200 bg-white shadow-lg outline-none",
    option: (state) =>
      clsx(
        "text-slate-700 flex w-full justify-between px-4 py-2 text-left leading-5",
        { "bg-slate-100 text-slate-900": state.isFocused }
      ),
    noOptionsMessage: () => "italic text-slate-700 p-2",
    loadingMessage: () => "text-slate-700 p-2",
    groupHeading: () => "text-slate-400 text-sm p-2",
  };
}

export default function Select({
  error,
  id,
  label,
  options,
  value,
  onChange,
}: SelectProps) {
  const [selectedValue, setSelectValue] = useState<OptionType | null>(value);

  const handleChange = (newValue: SingleValue<OptionType>) => {
    setSelectValue(newValue);
    onChange?.(newValue);
  };

  return (
    <InputGroup id={id} error={error} label={label}>
      <ReactSelect<OptionType>
        onChange={handleChange}
        value={selectedValue}
        options={options}
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-errormessage={error ? `${id}-error` : undefined}
        unstyled
        classNames={selectStyles(error)}
      />
    </InputGroup>
  );
}
