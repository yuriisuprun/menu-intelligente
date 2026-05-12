import OpenAI from "openai";

function getClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is missing");
  return new OpenAI({ apiKey: key });
}

export async function generateMenuTranslation(input: { dishName: string; descriptionIt: string; targetLanguage: string }) {
  const completion = await getClient().responses.create({
    model: "gpt-4.1-mini",
    input: `Translate and enrich this Italian dish for a premium menu.
Dish: ${input.dishName}
Italian description: ${input.descriptionIt}
Target language: ${input.targetLanguage}
Return only one concise sentence.`
  });
  return completion.output_text.trim();
}

export async function askWaiterAssistant(input: { menuContext: string; question: string; language: string }) {
  const completion = await getClient().responses.create({
    model: "gpt-4.1-mini",
    input: `You are a luxury hospitality waiter assistant.
Language: ${input.language}
Menu context:
${input.menuContext}
Guest question: ${input.question}
Answer in 1-3 concise sentences.`
  });
  return completion.output_text.trim();
}
