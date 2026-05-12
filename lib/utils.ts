import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SUPPORTED_LANGUAGES = ["it", "en", "fr", "de", "es", "ja", "uk"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export function resolveLanguage(header?: string | null): SupportedLanguage {
  const normalized = header?.toLowerCase() ?? "en";
  const matched = SUPPORTED_LANGUAGES.find((l) => normalized.startsWith(l));
  return matched ?? "en";
}

export const DIETARY_TAGS = [
  "gluten-free",
  "vegetarian",
  "vegan",
  "halal",
  "spicy",
  "dairy-free",
  "nut-containing",
  "seafood",
  "pork"
] as const;
