import { json, send } from "@/source/shared/api/request";

/** Получает текст публикации от ИИ-помощника. */
export async function writePostWithAi(
  instruction: string,
  html: string,
  signal?: AbortSignal,
): Promise<string> {
  const response = await send(
    "/posts/assistant",
    { ...json("POST", { instruction, html }), signal },
    "ИИ-помощник сейчас недоступен",
  );
  const result: { html: string } = await response.json();
  return result.html;
}
