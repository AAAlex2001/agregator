import { API_URL } from "@/source/shared/api/config";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import { fetchWithSession } from "@/source/shared/api/session";
import type {
  PublicRtnQuestion,
  RtnQuestion,
  RtnQuestionAttachment,
  RtnQuestionReply,
} from "../model/types";

export async function fetchMyRtnQuestions(): Promise<RtnQuestion[]> {
  const response = await fetchWithSession(`${API_URL}/rtn/questions/mine`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось загрузить ваши вопросы"));
  }
  return response.json();
}

export async function fetchPublicRtnQuestions(): Promise<PublicRtnQuestion[]> {
  const response = await fetch(`${API_URL}/public/rtn/questions`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось загрузить вопросы"));
  }
  return response.json();
}

export async function fetchRtnQuestionReplies(questionId: number): Promise<RtnQuestionReply[]> {
  const response = await fetch(`${API_URL}/public/rtn/questions/${questionId}/replies`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось загрузить ответы"));
  }
  return response.json();
}

export async function addRtnQuestionReply(
  questionId: number,
  text: string,
  attachments: RtnQuestionAttachment[],
): Promise<RtnQuestionReply> {
  const response = await fetchWithSession(`${API_URL}/public/rtn/questions/${questionId}/replies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, attachments }),
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось опубликовать ответ"));
  }
  return response.json();
}

export async function subscribeToRtnQuestion(questionId: number, email: string): Promise<void> {
  const response = await fetchWithSession(`${API_URL}/public/rtn/questions/${questionId}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось оформить подписку"));
  }
}

export async function uploadRtnQuestionAttachment(file: File): Promise<RtnQuestionAttachment> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetchWithSession(`${API_URL}/public/rtn/comments/upload-attachment`, {
    method: "POST",
    body: form,
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось загрузить файл"));
  }
  return response.json();
}
