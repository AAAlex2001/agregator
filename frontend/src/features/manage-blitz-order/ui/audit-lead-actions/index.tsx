"use client";

import { AUDIT_LEAD_WAITING } from "../../config/waiting";
import type { BlitzStepProps } from "../../model/types";
import { AuditTakePanel } from "../audit-take-panel";
import { ConclusionPanel } from "../conclusion-panel";
import { CounterAnswerPanel } from "../counter-answer-panel";
import { PlanPanel } from "../plan-panel";
import { StepNote } from "../step-note";
import { TeamPanel } from "../team-panel";
import { WorkPanel } from "../work-panel";

/** Ход руководителя аудиторской группы: взять заявку, торг, группа, План, работа и отчёт. */
export function AuditLeadActions({ order, onChange }: BlitzStepProps) {
  switch (order.status) {
    case "new":
      return (
        <AuditTakePanel
          order={order}
          onChange={onChange}
        />
      );
    case "counter":
      return (
        <CounterAnswerPanel
          order={order}
          onChange={onChange}
        />
      );
    case "contract":
      return (
        <>
          <StepNote
            title="Ждём аванс"
            text="Договор подписан. Пока заказчик оплачивает аванс, наберите аудиторскую группу."
          />
          <TeamPanel
            order={order}
            onChange={onChange}
          />
        </>
      );
    case "plan":
      return (
        <>
          <TeamPanel
            order={order}
            onChange={onChange}
          />
          <PlanPanel
            order={order}
            onChange={onChange}
          />
        </>
      );
    case "in_progress":
      return (
        <WorkPanel
          order={order}
          onChange={onChange}
        />
      );
    case "paid":
      return (
        <ConclusionPanel
          order={order}
          onChange={onChange}
        />
      );
    default:
      return (
        <StepNote
          title={AUDIT_LEAD_WAITING[order.status].title}
          text={AUDIT_LEAD_WAITING[order.status].text}
        />
      );
  }
}