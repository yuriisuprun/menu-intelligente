import { NextRequest, NextResponse } from "next/server";
import { generateMenuTranslation } from "@/lib/ai";
import { DIETARY_TAGS } from "@/lib/utils";

async function deepLTranslate(text: string, targetLang: string) {
  const key = process.env.DEEPL_API_KEY;
  if (!key) return null;
  const form = new URLSearchParams();
  form.append("text", text);
  form.append("target_lang", targetLang.toUpperCase());
  const res = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: { Authorization: `DeepL-Auth-Key ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString()
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.translations?.[0]?.text ?? null;
}

export async function POST(req: NextRequest) {
  const { dishName, descriptionIt, targetLanguage } = await req.json();
  try {
    const translation = await generateMenuTranslation({ dishName, descriptionIt, targetLanguage });
    const tags = DIETARY_TAGS.filter((t) => `${dishName} ${descriptionIt}`.toLowerCase().includes(t.split("-")[0]));
    return NextResponse.json({ translation, tags });
  } catch {
    const fallback = await deepLTranslate(descriptionIt, targetLanguage);
    return NextResponse.json({ translation: fallback ?? descriptionIt, tags: [] });
  }
}
