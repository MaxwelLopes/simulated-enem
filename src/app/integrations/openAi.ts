"use server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateText = async ({
  role,
  prompt,
  temperature = 0.3,
}: {
  role: string;
  prompt: string;
  temperature: number;
}) => {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL as string,
      messages: [
        { role: "system", content: `Você é ${role}.` },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
      temperature: temperature,
    });

    const response = completion.choices[0]?.message?.content?.trim();
    if (!response) throw new Error("Resposta vazia da API.");

    return response;
  } catch (error: any) {
    console.error("Erro ao chamar a API da OpenAI:", error?.message || error);
    throw new Error("Falha ao gerar texto. Tente novamente.");
  }
};
