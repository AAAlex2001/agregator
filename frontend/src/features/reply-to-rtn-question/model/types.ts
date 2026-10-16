import type { RtnQuestionReply } from "@/entities/rtn";

/** Обращение и добавление опубликованного ответа в его список. */
export interface ReplyToRtnQuestionOptions {
  questionId: number;
  onAdded: (reply: RtnQuestionReply) => void;
}
