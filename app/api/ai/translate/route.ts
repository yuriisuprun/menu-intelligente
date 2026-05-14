import { NextRequest, NextResponse } from "next/server";
import { generateMenuTranslation } from "@/lib/ai";
import { DIETARY_TAGS } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const { dishName, descriptionIt, targetLanguage } = await req.json();
  if (!dishName || !descriptionIt || !targetLanguage) {
    return NextResponse.json({ error: "dishName, descriptionIt and targetLanguage are required" }, { status: 400 });
  }

  try {
    const translation = await generateMenuTranslation({ dishName, descriptionIt, targetLanguage });
    const tags = DIETARY_TAGS.filter((t) => `${dishName} ${descriptionIt}`.toLowerCase().includes(t.split("-")[0]));
    return NextResponse.json({ translation, tags });
  } catch (error) {
    const message = error instanceof Error ? error.message : "translation failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
