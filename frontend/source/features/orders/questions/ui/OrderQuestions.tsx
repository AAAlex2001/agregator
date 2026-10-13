"use client";

import { useSession } from "@/source/entities/session";
import { useOrderQuestions } from "../model/useOrderQuestions";
import { AskQuestionForm } from "./AskQuestionForm";
import { QuestionItem } from "./QuestionItem";
import { QuestionsSkeleton } from "./QuestionsSkeleton";
import s from "./OrderQuestions.module.scss";

interface OrderQuestionsProps {
  orderId: number;
  customerId: number;
  canAsk: boolean;
}

/** Блок «Вопросы по заказу»: исполнитель задаёт один вопрос, заказчик этого заказа отвечает. */
export function OrderQuestions({ orderId, customerId, canAsk }: OrderQuestionsProps) {
  const { user, role } = useSession();
  const { items, isLoading, error, isSubmitting, ask, edit, answer } = useOrderQuestions(orderId);
  const userId = user?.id ?? null;
  const hasOwnQuestion = items.some((item) => item.expert_id === userId);
  const isOrderCustomer = role === "CUSTOMER" && userId === customerId;

  return (
    <section className={s.block}>
      <h3 className={s.title}>Вопросы по заказу</h3>

      {isLoading && <QuestionsSkeleton />}
      {error && <p className={s.error}>{error}</p>}
      {!isLoading && !error && items.length === 0 && <p className={s.muted}>Вопросов пока нет.</p>}
      {items.length > 0 && (
        <ul className={s.list}>
          {items.map((item) => (
            <li key={item.id}>
              <QuestionItem
                item={item}
                isOwner={item.expert_id === userId}
                canAnswer={isOrderCustomer}
                isSubmitting={isSubmitting}
                onEdit={(text) => edit(item.id, text)}
                onAnswer={(text) => answer(item.id, text)}
              />
            </li>
          ))}
        </ul>
      )}

      {role === "EXPERT" && canAsk && !hasOwnQuestion && <AskQuestionForm isSubmitting={isSubmitting} onAsk={ask} />}
    </section>
  );
}
