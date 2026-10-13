import { json, send } from "@/source/shared/api/request";
import type { RtnFile } from "../model/clarification";
import type { PublicRtnQuestion, RtnQuestion, RtnQuestionReply } from "../model/question";

/** Отправить вопрос в Ростехнадзор. Ответ придёт на почту аккаунта. */
export async function submitRtnQuestion(questionText: string): Promise<void> {
  await send("/public/rtn/questions", json("POST", { question_text: questionText }), "Не удалось отправить вопрос");
}

/** Вопросы, которые задал сам пользователь. */
export async function fetchMyRtnQuestions(): Promise<RtnQuestion[]> {
  const response = await send("/rtn/questions/mine", {}, "Не удалось загрузить ваши вопросы");
  return response.json();
}

/** Вопросы, которые уже взяли в работу. */
export async function fetchPublicRtnQuestions(): Promise<PublicRtnQuestion[]> {
  const response = await send("/public/rtn/questions", {}, "Не удалось загрузить вопросы");
  return response.json();
}

/** Ответы сообщества на вопрос. */
export async function fetchRtnQuestionReplies(questionId: number): Promise<RtnQuestionReply[]> {
  const response = await send(`/public/rtn/questions/${questionId}/replies`, {}, "Не удалось загрузить ответы");
  return response.json();
}

/** Опубликовать ответ ведомства с документом. */
export async function addRtnQuestionReply(questionId: number, text: string, attachments: RtnFile[]): Promise<RtnQuestionReply> {
  const response = await send(
    `/public/rtn/questions/${questionId}/replies`,
    json("POST", { text, attachments }),
    "Не удалось опубликовать ответ",
  );
  return response.json();
}

/** Письмо на почту, когда выйдет официальный ответ. */
export async function subscribeToRtnQuestion(questionId: number, email: string): Promise<void> {
  await send(`/public/rtn/questions/${questionId}/subscribe`, json("POST", { email }), "Не удалось оформить подписку");
}
