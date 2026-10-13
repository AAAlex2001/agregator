"use client";

import { useState } from "react";
import type { OrderQuestion } from "@/source/entities/order-question";
import { formatWithTime } from "@/source/shared/lib/formatDate";
import { UserAvatar } from "@/source/shared/ui/UserAvatar";
import { QuestionForm } from "./QuestionForm";
import s from "./QuestionItem.module.scss";

type Editing = "question" | "answer" | null;

interface QuestionItemProps {
  item: OrderQuestion;
  isOwner: boolean;
  canAnswer: boolean;
  isSubmitting: boolean;
  onEdit: (text: string) => Promise<void>;
  onAnswer: (text: string) => Promise<void>;
}

/** Вопрос с ответом заказчика. Автор правит вопрос до ответа, заказчик отвечает и правит ответ. */
export function QuestionItem({ item, isOwner, canAnswer, isSubmitting, onEdit, onAnswer }: QuestionItemProps) {
  const [editing, setEditing] = useState<Editing>(null);
  const answerPlaceholder = item.is_anonymous ? "Ваш ответ (виден только этому исполнителю)…" : "Ваш ответ (виден всем исполнителям)…";

  return (
    <article className={s.card}>
      <header className={s.head}>
        <UserAvatar src={item.expert_avatar_url} alt={item.expert_name} className={s.avatar} />
        <div className={s.headText}>
          <span className={s.name}>{item.expert_name || "Исполнитель"}</span>
          <span className={s.date}>{formatWithTime(item.asked_at)}</span>
        </div>
        {item.is_anonymous && (
          <span className={s.anonBadge} title="Видят только вы и заказчик">
            Анонимно
          </span>
        )}
      </header>

      {editing === "question" ? (
        <QuestionForm
          initial={item.question}
          placeholder="Ваш вопрос"
          submitLabel="Сохранить"
          isSubmitting={isSubmitting}
          onSubmit={async (text) => {
            await onEdit(text);
            setEditing(null);
          }}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <p className={s.text}>{item.question}</p>
      )}

      {isOwner && item.answer === null && editing === null && (
        <button type="button" className={s.linkBtn} onClick={() => setEditing("question")}>
          Изменить
        </button>
      )}

      {item.answer !== null && editing !== "answer" && (
        <div className={s.answer}>
          <span className={s.answerLabel}>Ответ заказчика:</span>
          <p className={s.text}>{item.answer}</p>
          {canAnswer && (
            <button type="button" className={s.linkBtn} onClick={() => setEditing("answer")}>
              Изменить ответ
            </button>
          )}
        </div>
      )}

      {canAnswer && (item.answer === null || editing === "answer") && (
        <QuestionForm
          initial={item.answer ?? ""}
          placeholder={answerPlaceholder}
          submitLabel={item.answer === null ? "Ответить" : "Сохранить"}
          isSubmitting={isSubmitting}
          onSubmit={async (text) => {
            await onAnswer(text);
            setEditing(null);
          }}
          onCancel={editing === "answer" ? () => setEditing(null) : undefined}
        />
      )}
    </article>
  );
}
