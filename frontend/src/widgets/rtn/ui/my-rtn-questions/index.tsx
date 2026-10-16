import { RtnQuestionCard, RtnQuestionCardSkeleton } from "@/entities/rtn";
import type { RtnQuestion } from "@/entities/rtn";
import { Button } from "@/shared/ui/button";
import styles from "./style.module.scss";

/** Загруженные обращения пользователя и повторная загрузка при ошибке. */
interface MyRtnQuestionsProps {
  questions: RtnQuestion[];
  isLoading: boolean;
  error: string | null;
  basePath: string;
  onRetry: () => void;
}

/** Показывает свои обращения, ожидание списка или ошибку с повтором загрузки. */
export function MyRtnQuestions({
  questions,
  isLoading,
  error,
  basePath,
  onRetry,
}: MyRtnQuestionsProps) {
  if (error) {
    return (
      <div className={styles.message}>
        <p>{error}</p>
        <Button
          variant="outlineOrange"
          onClick={onRetry}
        >
          Обновить список
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={styles.list}
        aria-label="Загрузка вопросов"
      >
        <RtnQuestionCardSkeleton />
        <RtnQuestionCardSkeleton />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className={styles.message}>
        <h3>Вы ещё не задавали вопросов</h3>
        <p>
          После отправки вопрос появится здесь вместе с текущим статусом рассмотрения.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {questions.map((question) => (
        <RtnQuestionCard
          key={question.id}
          question={question}
          basePath={basePath}
        />
      ))}
    </div>
  );
}
