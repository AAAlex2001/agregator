"use client";

import { RtnQuestionReplyContent, useRtnQuestionReplies } from "@/entities/rtn";
import { RtnQuestionReplyForm } from "@/features/reply-to-rtn-question";
import { Loader } from "@/shared/ui/loader";
import styles from "./style.module.scss";

/** Обращение, для которого открыт список документов сообщества. */
interface RtnQuestionRepliesProps {
  questionId: number;
}

/** Собирает ответы сообщества и форму публикации документа ведомства. */
export function RtnQuestionReplies({ questionId }: RtnQuestionRepliesProps) {
  const { replies, appendReply } = useRtnQuestionReplies(questionId);

  return (
    <div className={styles.replies}>
      {!replies && (
        <Loader
          size="sm"
          label="Загружаем ответы"
        />
      )}
      {replies?.length === 0 && (
        <p className={styles.empty}>
          Ответов пока нет. Если у вас есть письмо ведомства по этому вопросу —
          поделитесь им.
        </p>
      )}
      {replies && replies.length > 0 && (
        <ul className={styles.list}>
          {replies.map((reply) => (
            <RtnQuestionReplyContent
              key={reply.id}
              reply={reply}
            />
          ))}
        </ul>
      )}
      <RtnQuestionReplyForm
        questionId={questionId}
        onAdded={appendReply}
      />
    </div>
  );
}
