"use client";

import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import { UserAvatar } from "@/source/shared/ui/UserAvatar";
import { formatWithTime } from "@/source/shared/lib/formatDate";
import type { QuestionApiItem } from "@/source/entities/order-question";
import s from "./QuestionItem.module.scss";
import f from "./Forms.module.scss";

const MAX = 2000;

interface Props {
  item: QuestionApiItem;
  isOwner: boolean;
  isCustomerOfThisOrder: boolean;
  isSubmitting: boolean;
  onEdit: (text: string) => Promise<void>;
  onAnswer: (text: string) => Promise<void>;
}

export function QuestionItem({
  item, isOwner, isCustomerOfThisOrder, isSubmitting, onEdit, onAnswer,
}: Props) {
  const [editingQuestion, setEditingQuestion] = useState(false);
  const [questionDraft, setQuestionDraft] = useState(item.question);
  const [answerDraft, setAnswerDraft] = useState(item.answer ?? "");
  const [editingAnswer, setEditingAnswer] = useState(false);

  const canEditQuestion = isOwner && item.answer === null;
  const canAnswer = isCustomerOfThisOrder;

  const handleEdit = async () => {
    const t = questionDraft.trim();
    if (!t) return;
    await onEdit(t);
    setEditingQuestion(false);
  };

  const handleAnswer = async () => {
    const t = answerDraft.trim();
    if (!t) return;
    await onAnswer(t);
    setEditingAnswer(false);
  };

  return (
    <article className={s.card}>
      <header className={s.head}>
        <UserAvatar src={item.expert_avatar_url} alt={item.expert_name} className={s.avatar} />
        <div className={s.headText}>
          <span className={s.name}>{item.expert_name || "Эксперт"}</span>
          <span className={s.date}>{formatWithTime(item.asked_at)}</span>
        </div>
        {item.is_anonymous && (
          <span className={s.anonBadge} title="Видят только вы и заказчик">
            Анонимно
          </span>
        )}
      </header>

      {editingQuestion ? (
        <div className={f.form}>
          <textarea
            className={f.textarea}
            value={questionDraft}
            onChange={(e) => setQuestionDraft(e.target.value.slice(0, MAX))}
            rows={3}
            disabled={isSubmitting}
          />
          <div className={f.controls}>
            <span className={f.counter}>{questionDraft.length}/{MAX}</span>
            <Button variant="outline" size="sm" onClick={() => { setEditingQuestion(false); setQuestionDraft(item.question); }}>
              Отмена
            </Button>
            <Button variant="primary" size="sm" onClick={handleEdit} isLoading={isSubmitting}>
              Сохранить
            </Button>
          </div>
        </div>
      ) : (
        <p className={s.text}>{item.question}</p>
      )}

      {canEditQuestion && !editingQuestion && (
        <button type="button" className={s.linkBtn} onClick={() => setEditingQuestion(true)}>
          Изменить
        </button>
      )}

      {item.answer !== null && !editingAnswer && (
        <div className={s.answer}>
          <span className={s.answerLabel}>Ответ заказчика:</span>
          <p className={s.text}>{item.answer}</p>
          {canAnswer && (
            <button type="button" className={s.linkBtn} onClick={() => setEditingAnswer(true)}>
              Изменить ответ
            </button>
          )}
        </div>
      )}

      {canAnswer && (item.answer === null || editingAnswer) && (
        <div className={f.form}>
          <textarea
            className={f.textarea}
            placeholder={item.is_anonymous ? "Ваш ответ (виден только этому эксперту)…" : "Ваш ответ (виден всем экспертам)…"}
            value={answerDraft}
            onChange={(e) => setAnswerDraft(e.target.value.slice(0, MAX))}
            rows={3}
            disabled={isSubmitting}
          />
          <div className={f.controls}>
            <span className={f.counter}>{answerDraft.length}/{MAX}</span>
            {editingAnswer && (
              <Button variant="outline" size="sm" onClick={() => { setEditingAnswer(false); setAnswerDraft(item.answer ?? ""); }}>
                Отмена
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={handleAnswer}
              isLoading={isSubmitting}
              disabled={answerDraft.trim().length === 0}
            >
              {item.answer === null ? "Ответить" : "Сохранить"}
            </Button>
          </div>
        </div>
      )}
    </article>
  );
}
