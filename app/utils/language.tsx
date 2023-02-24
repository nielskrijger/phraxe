import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { Language } from "accept-language-parser";
import acceptLanguage from "accept-language-parser";

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
 * Returns the languages from the "Accept-Language" header.
 */
export function useAcceptLanguages() {
  return useContext(LocaleContext);
}

export function usePreferredLanguage(): SupportedLanguage {
  const acceptLanguages = useAcceptLanguages();
  for (const language of acceptLanguages) {
    const preferredLanguage = supportedLanguages.find(
      (e) => e.code === language.code
    );
    if (preferredLanguage) {
      return preferredLanguage;
    }
  }

  return supportedLanguages.find((e) => e.code === "en")!;
}

export function findSupportedLanguage(
  code: string
): SupportedLanguage | undefined {
  return supportedLanguages.find((language) => language.value === code);
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
