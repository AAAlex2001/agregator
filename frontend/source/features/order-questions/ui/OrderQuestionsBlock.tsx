"use client";

import { useOrderQuestions } from "../model/useOrderQuestions";
import { QuestionItem } from "./QuestionItem";
import { AskQuestionForm } from "./AskQuestionForm";
import { QuestionsSkeleton } from "./QuestionsSkeleton";
import s from "./OrderQuestionsBlock.module.scss";

interface Props {
  orderId: number | null;
  currentUserId: number | null;
  customerId: number | null;
  isCustomer: boolean;
  isExpert: boolean;
  expertCanAsk: boolean;
}

export function OrderQuestionsBlock({
  orderId,
  currentUserId,
  customerId,
  isCustomer,
  isExpert,
  expertCanAsk,
}: Props) {
  const { items, isLoading, error, isSubmitting, ask, edit, answer } =
    useOrderQuestions(orderId);

  if (orderId === null) return null;

  const myQuestion = items.find((q) => q.expert_id === currentUserId) ?? null;
  const showAskForm = isExpert && expertCanAsk && myQuestion === null;
  const isCustomerOfThisOrder = isCustomer && currentUserId === customerId;

  return (
    <section className={s.block}>
      <h3 className={s.title}>Вопросы по заказу</h3>

      {isLoading ? (
        <QuestionsSkeleton />
      ) : error ? (
        <p className={s.error}>{error}</p>
      ) : items.length === 0 ? (
        <p className={s.muted}>Вопросов пока нет.</p>
      ) : (
        <ul className={s.list}>
          {items.map((q) => (
            <li key={q.id}>
              <QuestionItem
                item={q}
                isOwner={q.expert_id === currentUserId}
                isCustomerOfThisOrder={isCustomerOfThisOrder}
                isSubmitting={isSubmitting}
                onEdit={(text) => edit(q.id, text)}
                onAnswer={(text) => answer(q.id, text)}
              />
            </li>
          ))}
        </ul>
      )}

      {showAskForm && (
        <AskQuestionForm
          isSubmitting={isSubmitting}
          onSubmit={ask}
        />
      )}
    </section>
  );
}
