import { json, send } from "@/source/shared/api/request";

/** Текст публикации от ИИ-помощника по просьбе автора. */
export async function writePostWithAi(instruction: string, html: string): Promise<string> {
  const response = await send("/posts/assistant", json("POST", { instruction, html }), "ИИ-помощник сейчас недоступен");
  const result: { html: string } = await response.json();
  return result.html;
}
