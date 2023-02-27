import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { Language } from "accept-language-parser";
import acceptLanguage from "accept-language-parser";
import { uniq } from "lodash";

export type SupportedLanguage = {
  name: string;
  value: string;
  code: string;
};

// The supported languages are those installed for PostgreSQL ts_vector:
// "SELECT cfgname FROM pg_ts_config"
export const supportedLanguages: SupportedLanguage[] = [
  { name: "Arabic", value: "arabic", code: "ar" },
  { name: "Armenian", value: "armenian", code: "hy" },
  { name: "Basque", value: "basque", code: "bm" },
  { name: "Catalan", value: "catalan", code: "ca" },
  { name: "Danish", value: "danish", code: "da" },
  { name: "Dutch", value: "dutch", code: "nl" },
  { name: "English", value: "english", code: "en" },
  { name: "Finnish", value: "finnish", code: "fi" },
  { name: "French", value: "french", code: "fr" },
  { name: "German", value: "german", code: "de" },
  { name: "Greek", value: "greek", code: "el" },
  { name: "Hindi", value: "hindi", code: "hi" },
  { name: "Hungarian", value: "hungarian", code: "hu" },
  { name: "Indonesian", value: "indonesian", code: "id" },
  { name: "Irish", value: "irish", code: "ga" },
  { name: "Italian", value: "italian", code: "it" },
  { name: "Lithuanian", value: "lithuanian", code: "lt" },
  { name: "Nepali", value: "nepali", code: "ne" },
  { name: "Norwegian", value: "norwegian", code: "no" },
  { name: "Portuguese", value: "portuguese", code: "pt" },
  { name: "Romanian", value: "romanian", code: "ro" },
  { name: "Russian", value: "russian", code: "ru" },
  { name: "Serbian", value: "serbian", code: "sr" },
  { name: "Spanish", value: "spanish", code: "es" },
  { name: "Swedish", value: "swedish", code: "sv" },
  { name: "Tamil", value: "tamil", code: "ta" },
  { name: "Turkish", value: "turkish", code: "tr" },
  { name: "Yiddish", value: "yiddish", code: "yi" },
];

const LocaleContext = createContext<Language[]>([]);

export function LanguageProvider({
  children,
  languages,
}: {
  children: ReactNode;
  languages: Language[];
}) {
  return (
    <LocaleContext.Provider value={languages}>
      {children}
    </LocaleContext.Provider>
  );
}

/**
 * Returns the languages from the "Accept-Language" header that are stored in
 * the context.
 */
export function useAcceptLanguages() {
  return useContext(LocaleContext);
}

export function usePreferredLanguages(): SupportedLanguage[] {
  const acceptLanguages = useAcceptLanguages();
  return parsePreferredLanguages(acceptLanguages);
}

export function findSupportedLanguage(
  value: string
): SupportedLanguage | undefined {
  return supportedLanguages.find((language) => language.value === value);
}

export function parseAcceptLanguage(request: Request): Language[] {
  const languages = acceptLanguage.parse(
    request.headers.get("Accept-Language") as string
  );

  // If somehow the header is empty, return a default locale
  if (languages?.length < 1) {
    return [{ code: "en", region: "US", quality: 1 }];
  }

  return languages;
}

/**
 * Used in the backend to determine the preferred languages from Accept-Language
 * header and returns the ones that are supported. Yields an array of unique
 * language names, for example: `["english", "dutch"]`
 */
export function getPreferredLanguages(request: Request): string[] {
  const acceptLanguages = parseAcceptLanguage(request);
  const preferredLanguages = parsePreferredLanguages(acceptLanguages);
  return uniq(preferredLanguages.map((lng) => lng.value));
}

export function parsePreferredLanguages(
  languages: Language[]
): SupportedLanguage[] {
  const result: SupportedLanguage[] = [];
  for (const language of languages) {
    const preferredLanguage = supportedLanguages.find(
      (e) => e.code === language.code
    );
    if (preferredLanguage) {
      result.push(preferredLanguage);
    }
  }

  if (result.length === 0) {
    result.push(supportedLanguages.find((e) => e.code === "en")!);
  }

  return result;
}
