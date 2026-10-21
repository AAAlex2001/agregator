"use client";

import { useState } from "react";
import { postBlitzAction } from "@/entities/blitz-order";
import { Button } from "@/shared/ui/button";
import { CalendarInput } from "@/shared/ui/calendar-input";
import { Field } from "@/shared/ui/field";
import { Switch } from "@/shared/ui/switch";
import { TextArea } from "@/shared/ui/text-area";
import { TextInput } from "@/shared/ui/text-input";
import { useNotifications } from "@/shared/ui/notifications";
import { planDraftOf, planProblem, toPlanInput } from "../../model/plan-draft";
import type { PlanDraft, PlanTextField } from "../../model/plan-draft";
import { useBlitzAction } from "../../model/use-blitz-action";
import type { BlitzStepProps } from "../../model/types";
import { StepNote } from "../step-note";
import styles from "./style.module.scss";

/** Руководитель группы составляет План аудита: даты этапов, совещания и интервью. */
export function PlanPanel({ order, onChange }: BlitzStepProps) {
  const [draft, setDraft] = useState<PlanDraft>(planDraftOf(order.audit_plan));
  const { isPending, run } = useBlitzAction(onChange);
  const { showError } = useNotifications();
  const withOnsite = order.audit_details?.stages.includes("onsite") ?? false;

  /** Меняет текстовое поле или дату. */
  function update(field: PlanTextField, value: string) {
    setDraft({ ...draft, [field]: value });
  }

  /** Отправляет План заказчику. */
  function send() {
    const problem = planProblem(draft, withOnsite);
    if (problem) {
      showError(problem);
      return;
    }

    void run(
      () => postBlitzAction(
        order.id,
        "plan",
        toPlanInput(draft, withOnsite),
        "Не удалось отправить План",
      ),
      "План отправлен заказчику на согласование",
    );
  }

  return (
    <StepNote
      title="Составьте План аудита"
      text={"Из Плана соберётся Программа аудита в Word: состав группы, график этапов и ресурсы. "
        + "Заказчик согласует её или попросит поправить."}
    >
      {order.plan_comment && (
        <p className={styles.comment}>Заказчик просит поправить: {order.plan_comment}</p>
      )}
      <div className={styles.grid}>
        <Field label="Документарный этап: с">
          <CalendarInput
            value={draft.documentsStart}
            placeholder="ДД.ММ.ГГГГ"
            onChange={(value) => update("documentsStart", value)}
          />
        </Field>
        <Field label="по">
          <CalendarInput
            value={draft.documentsEnd}
            placeholder="ДД.ММ.ГГГГ"
            onChange={(value) => update("documentsEnd", value)}
          />
        </Field>
        {withOnsite && (
          <>
            <Field label="Выездной этап: с">
              <CalendarInput
                value={draft.onsiteStart}
                placeholder="ДД.ММ.ГГГГ"
                onChange={(value) => update("onsiteStart", value)}
              />
            </Field>
            <Field label="по">
              <CalendarInput
                value={draft.onsiteEnd}
                placeholder="ДД.ММ.ГГГГ"
                onChange={(value) => update("onsiteEnd", value)}
              />
            </Field>
          </>
        )}
      </div>
      <Switch
        checked={draft.meetings}
        label="Вступительное и заключительное совещания"
        onChange={(meetings) => setDraft({ ...draft, meetings })}
      />
      {draft.meetings && (
        <div className={styles.grid}>
          <Field label="Вступительное совещание">
            <CalendarInput
              withTime
              value={draft.openingAt}
              placeholder="Дата и время"
              onChange={(value) => update("openingAt", value)}
            />
          </Field>
          <Field label="Заключительное совещание">
            <CalendarInput
              withTime
              value={draft.closingAt}
              placeholder="Дата и время"
              onChange={(value) => update("closingAt", value)}
            />
          </Field>
          <Field label="Ссылка на видеосвязь (необязательно)">
            <TextInput
              value={draft.meetingLink}
              maxLength={500}
              placeholder="https://telemost.yandex.ru/…"
              onChange={(event) => update("meetingLink", event.target.value)}
            />
          </Field>
        </div>
      )}
      {withOnsite && (
        <Field label="Цеха и участки для выезда (необязательно)">
          <TextArea
            value={draft.workshops}
            rows={3}
            maxLength={2000}
            onChange={(event) => update("workshops", event.target.value)}
          />
        </Field>
      )}
      <Field label="Кого интервьюировать">
        <TextArea
          value={draft.interviewees}
          rows={3}
          maxLength={2000}
          placeholder="Главный инженер, специалист по промышленной безопасности"
          onChange={(event) => update("interviewees", event.target.value)}
        />
      </Field>
      <div className={styles.actions}>
        <Button
          isLoading={isPending}
          onClick={send}
        >
          Отправить План заказчику
        </Button>
      </div>
    </StepNote>
  );
}