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
      className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-gold/70 focus:ring-2 focus:ring-gold/20"
      value={value}
      onChange={(e) => onChange(e.target.value as SupportedLanguage)}
      aria-label="Select menu language"
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <option key={lang} value={lang}>
          {lang.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
