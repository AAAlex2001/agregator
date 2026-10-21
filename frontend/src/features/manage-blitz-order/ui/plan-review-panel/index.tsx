"use client";

import { useState } from "react";
import { blitzDocumentUrl, postBlitzAction } from "@/entities/blitz-order";
import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { TextArea } from "@/shared/ui/text-area";
import { useBlitzAction } from "../../model/use-blitz-action";
import type { BlitzStepProps } from "../../model/types";
import { StepNote } from "../step-note";
import styles from "./style.module.scss";

/** Заказчик читает План аудита и согласует его или просит поправить. */
export function PlanReviewPanel({ order, onChange }: BlitzStepProps) {
  const [comment, setComment] = useState("");
  const { isPending, run } = useBlitzAction(onChange);
  const plans = order.documents.filter((document) => document.kind === "audit_plan");
  const latest = plans[plans.length - 1];

  /** Согласует План. */
  function approve() {
    void run(
      () => postBlitzAction(order.id, "plan/approve", {}, "Не удалось согласовать План"),
      "План согласован. Можно загружать документы",
    );
  }

  /** Просит поправить План. */
  function requestChanges() {
    void run(
      () => postBlitzAction(
        order.id,
        "plan/changes",
        { comment: comment.trim() },
        "Не удалось отправить замечания к Плану",
      ),
      "Замечания к Плану отправлены аудитору",
    );
  }

  return (
    <StepNote
      title={`План аудита готов${order.audit_plan ? ` — версия ${order.audit_plan.version}` : ""}`}
      text={"В Плане — состав группы, даты этапов, совещания и кого будут интервьюировать. "
        + "После согласования откроется загрузка документов по перечню."}
    >
      {latest && (
        <a
          className={styles.paper}
          href={blitzDocumentUrl(order.id, latest.id)}
        >
          Программа аудита (Word)
        </a>
      )}
      <div className={styles.actions}>
        <Button
          isLoading={isPending}
          onClick={approve}
        >
          Согласовать План
        </Button>
      </div>
      <div className={styles.changes}>
        <Field label="Что поправить">
          <TextArea
            value={comment}
            rows={3}
            maxLength={4000}
            placeholder="Например, перенести выездной этап на неделю позже"
            onChange={(event) => setComment(event.target.value)}
          />
        </Field>
        <div className={styles.actions}>
          <Button
            variant="outline"
            disabled={isPending || comment.trim().length < 3}
            onClick={requestChanges}
          >
            Попросить поправить
          </Button>
        </div>
      </div>
    </StepNote>
  );
}