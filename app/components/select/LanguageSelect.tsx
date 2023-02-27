import type { OptionType, SelectProps } from "./Select";
import Select from "./Select";
import type { SupportedLanguage } from "~/utils/language";
import {
  useAcceptLanguages,
  supportedLanguages,
  usePreferredLanguages,
  findSupportedLanguage,
} from "~/utils/language";
import { partition } from "lodash";
import type { OptionsOrGroups } from "react-select";
import type { GroupBase } from "react-select/dist/declarations/src/types";
import type { SingleValue } from "react-select";

function languageToOption(lng: SupportedLanguage): OptionType {
  return {
    value: lng.value,
    label: lng.name,
  };
}

type Props = Pick<SelectProps, "id" | "label" | "error"> & {
  onChange?: (newValue: SingleValue<OptionType>) => void;
};

export default function LanguageSelect({ ...props }: Props) {
  const acceptLanguages = useAcceptLanguages();
  const preferredLanguages = usePreferredLanguages();

  let options = supportedLanguages.map(languageToOption);
  const [preferredOptions, otherOptions] = partition(options, (lng) =>
    acceptLanguages.some((e) => {
      return e.code === findSupportedLanguage(lng.value)?.code;
    })
  );

  // Add browser languages to the "Quick select"-list
  let languageOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>;
  if (preferredOptions.length > 0) {
    languageOptions = [
      {
        label: "Quick select",
        options: preferredOptions,
      },
      {
        label: "Other",
        options: otherOptions,
      },
    ];
  } else {
    languageOptions = options;
  }

  // Determine the initial value
  const initialValue = options.find(
    (opt) => opt.value === preferredLanguages[0].value
  );
  if (!initialValue) {
    throw new Error("Failed to find preferred language"); // should never happen (defaults to english)
  }

  return <Select value={initialValue} options={languageOptions} {...props} />;
}
