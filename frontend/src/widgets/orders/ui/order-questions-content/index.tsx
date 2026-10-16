"use client";

import {
  QuestionsSkeleton,
  useOrderQuestions,
} from "@/entities/order-question";
import { useUser } from "@/entities/user";
import { AskOrderQuestionForm } from "@/features/ask-order-question";
import { OrderQuestionItem } from "../order-question-item";
import styles from "./style.module.scss";

/** Права отображения ветки для текущего пользователя. */
interface OrderQuestionsContentProps {
  customerId: number;
  canAsk: boolean;
}

/** Показывает состояния ветки и доступные текущему пользователю действия. */
export function OrderQuestionsContent({
  customerId,
  canAsk,
}: OrderQuestionsContentProps) {
  const { user, role } = useUser();
  const { items, isLoading, error } = useOrderQuestions();
  const userId = user?.id ?? null;
  const hasOwnQuestion = items.some((question) => question.expert_id === userId);
  const isOrderCustomer = role === "CUSTOMER" && userId === customerId;
  const showQuestionForm = role === "EXPERT" && canAsk && !hasOwnQuestion;

  return (
    <section className={styles.block}>
      <h3 className={styles.title}>Вопросы по заказу</h3>

      {isLoading && <QuestionsSkeleton />}
      {error && <p className={styles.error}>{error}</p>}
      {!isLoading && !error && items.length === 0 && (
        <p className={styles.muted}>Вопросов пока нет.</p>
      )}
      {items.length > 0 && (
        <ul className={styles.list}>
          {items.map((question) => (
            <li key={question.id}>
              <OrderQuestionItem
                question={question}
                isOwner={question.expert_id === userId}
                canAnswer={isOrderCustomer}
              />
            </li>
          ))}
        </ul>
      )}

      {showQuestionForm && <AskOrderQuestionForm />}
    </section>
  );
}
