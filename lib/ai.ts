import OpenAI from "openai";

type AiProvider = "openai" | "groq";

function getProvider(): AiProvider {
  const rawProvider = process.env.AI_PROVIDER?.trim().toLowerCase();
  if (rawProvider === "openai" || rawProvider === "groq") return rawProvider;
  if (process.env.GROQ_API_KEY) return "groq";
  return "openai";
}

function getModel(provider: AiProvider): string {
  if (provider === "groq") return process.env.GROQ_MODEL?.trim() || "llama-3.1-8b-instant";
  return process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini";
}

function getClient(provider: AiProvider) {
  if (provider === "groq") {
    const key = process.env.GROQ_API_KEY;
    if (!key) throw new Error("GROQ_API_KEY is missing");
    return new OpenAI({ apiKey: key, baseURL: "https://api.groq.com/openai/v1" });
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is missing");
  return new OpenAI({ apiKey: key });
}

async function generateText(prompt: string, system: string) {
  const provider = getProvider();
  const completion = await getClient(provider).chat.completions.create({
    model: getModel(provider),
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt }
    ]
  });

  const text = completion.choices[0]?.message?.content?.trim();
  if (!text) throw new Error("AI response was empty");
  return text;
}

export async function generateMenuTranslation(input: { dishName: string; descriptionIt: string; targetLanguage: string }) {
  return generateText(
    `Translate and enrich this Italian dish for a premium menu.
Dish: ${input.dishName}
Italian description: ${input.descriptionIt}
Target language: ${input.targetLanguage}
Return only one concise sentence.`,
    "You produce concise premium-menu copy."
  );
}

export async function askWaiterAssistant(input: { menuContext: string; question: string; language: string }) {
  return generateText(
    `Language: ${input.language}
Menu context:
${input.menuContext}
Guest question: ${input.question}
Answer in 1-3 concise sentences.`,
    "You are a luxury hospitality waiter assistant."
  );
}
