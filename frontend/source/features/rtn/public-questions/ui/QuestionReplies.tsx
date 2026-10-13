"use client";

import { toGalleryItem } from "@/source/entities/rtn";
import { formatDateLong } from "@/source/shared/lib/formatDate";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import Loader from "@/source/shared/ui/Loader";
import { useQuestionReplies } from "../model/useQuestionReplies";
import { ReplyForm } from "./ReplyForm";
import s from "./QuestionReplies.module.scss";

interface QuestionRepliesProps {
  questionId: number;
}

/** Ответы ведомств, которыми поделились пользователи, и форма своего ответа. */
export function QuestionReplies({ questionId }: QuestionRepliesProps) {
  const { replies, add } = useQuestionReplies(questionId);

  return (
    <div className={s.replies}>
      {!replies && <Loader size="sm" label="Загружаем ответы" />}
      {replies?.length === 0 && (
        <p className={s.empty}>Ответов пока нет. Если у вас есть письмо ведомства по этому вопросу — поделитесь им.</p>
      )}
      {replies && replies.length > 0 && (
        <ul className={s.list}>
          {replies.map((reply) => (
            <li key={reply.id} className={s.reply}>
              <div className={s.head}>
                <span className={s.author}>{reply.author_name}</span>
                <time className={s.date} dateTime={reply.created_at}>
                  {formatDateLong(reply.created_at)}
                </time>
              </div>
              {reply.text && <p className={s.text}>{reply.text}</p>}
              <FileGallery items={reply.attachments.map(toGalleryItem)} />
            </li>
          ))}
        </ul>
      )}

      <ReplyForm onSubmit={add} />
    </div>
  );
}
