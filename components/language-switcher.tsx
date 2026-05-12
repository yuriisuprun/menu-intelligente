"use client";

import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/utils";

export function LanguageSwitcher({
  value,
  onChange
}: {
  value: SupportedLanguage;
  onChange: (lang: SupportedLanguage) => void;
}) {
  return (
    <select
      className="rounded-md border border-white/20 bg-black/20 px-2 py-1 text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value as SupportedLanguage)}
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <option key={lang} value={lang}>
          {lang.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
