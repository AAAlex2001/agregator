import { API_URL } from "@/source/shared/api/config";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import { fetchWithSession } from "@/source/shared/api/session";

export async function submitRtnQuestion(questionText: string, contactEmail: string): Promise<void> {
  const response = await fetchWithSession(`${API_URL}/public/rtn/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question_text: questionText, contact_email: contactEmail }),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response, "Не удалось отправить вопрос"));
}

export async function reportRtnChange(clarificationId: number, description: string): Promise<void> {
  const response = await fetchWithSession(
    `${API_URL}/public/rtn/clarifications/${clarificationId}/change-report`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    },
  );
  if (!response.ok) throw new Error(await readErrorMessage(response, "Не удалось отправить сообщение"));
}
