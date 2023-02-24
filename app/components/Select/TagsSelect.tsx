import React, { useEffect, useRef, useState } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import InputGroup from "~/components/InputGroup";
import { uniqBy } from "lodash";
import { useFetcher } from "@remix-run/react";
import type { OptionType } from "~/components/Select/Select";
import { selectStyles } from "~/components/Select/Select";
import type { GroupBase } from "react-select/dist/declarations/src/types";

type Props = {
  error?: string | null | undefined;
  id: string;
  label: string;
  language: string;
};

export default function TagsSelect({ error, id, label, language }: Props) {
  const callbackRef = useRef<(options: OptionType[]) => void>();
  const fetcher = useFetcher();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState<OptionType[]>([]);

  const handleLoadOptions = (
    inputValue: string,
    callback: (options: OptionType[]) => void
  ) => {
    const search = new URLSearchParams();
    search.set("q", inputValue);
    search.set("language", language);
    fetcher.load(`/tags?${search.toString()}`);
    callbackRef.current = callback;
  };

  const handleChange = (newValue: readonly OptionType[]) => {
    setValue(uniqBy(newValue, "value")); // avoid duplicates
    setInputValue("");
  };

  useEffect(() => {
    setMenuIsOpen(inputValue.length > 0);
  }, [inputValue]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.tags) {
      callbackRef.current?.(fetcher.data.tags ?? []);
    }
  }, [fetcher.data, fetcher.state]);

  return (
    <InputGroup id={id} error={error} label={label}>
      <AsyncCreatableSelect
        instanceId="tags-input"
        components={{
          DropdownIndicator: null,
        }}
        inputValue={inputValue}
        value={value}
        id={id}
        name={id}
        isClearable
        isMulti
        menuIsOpen={menuIsOpen}
        isLoading={fetcher.state === "loading"}
        loadOptions={handleLoadOptions}
        onChange={handleChange}
        onInputChange={setInputValue}
        placeholder="Type something..."
        aria-invalid={error ? true : undefined}
        aria-errormessage={error ? `${id}-error` : undefined}
        unstyled
        delimiter="|"
        classNames={selectStyles<OptionType, true, GroupBase<OptionType>>(
          error
        )}
      />
    </InputGroup>
  );
}
