import OpenAI from "openai";

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is missing`);
  return value;
}

const groqClient = new OpenAI({
  apiKey: getRequiredEnv("GROQ_API_KEY"),
  baseURL: "https://api.groq.com/openai/v1"
});

function getModel() {
  return process.env.GROQ_MODEL?.trim() || "llama-3.1-8b-instant";
}

async function generateText(prompt: string, system: string) {
  const completion = await groqClient.chat.completions.create({
    model: getModel(),
    temperature: 0.3,
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
