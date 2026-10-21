"use client";

import { EXPERT_WAITING } from "../../config/waiting";
import type { BlitzStepProps } from "../../model/types";
import { AcceptPanel } from "../accept-panel";
import { ConclusionPanel } from "../conclusion-panel";
import { StepNote } from "../step-note";
import { WorkPanel } from "../work-panel";

/** Ход эксперта: взять заявку, работа и замечания, отправка заключения — или чего ждём. */
export function ExpertActions({ order, onChange }: BlitzStepProps) {
  switch (order.status) {
    case "consultation":
    case "offer":
    case "counter":
    case "plan":
    case "plan_review":
      return null;
    case "new":
      return (
        <AcceptPanel
          order={order}
          onChange={onChange}
        />
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
          title={EXPERT_WAITING[order.status].title}
          text={EXPERT_WAITING[order.status].text}
        />
      );
  }
}
