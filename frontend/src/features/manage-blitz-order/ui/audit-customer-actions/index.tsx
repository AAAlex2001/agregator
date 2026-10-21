"use client";

import { AUDIT_CUSTOMER_WAITING } from "../../config/waiting";
import type { BlitzStepProps } from "../../model/types";
import { AcceptWorkPanel } from "../accept-work-panel";
import { ActPanel } from "../act-panel";
import { CancelButton } from "../cancel-button";
import { ChecklistPanel } from "../checklist-panel";
import { OfferAnswerPanel } from "../offer-answer-panel";
import { PaymentPanel } from "../payment-panel";
import { PlanReviewPanel } from "../plan-review-panel";
import { RevisionPanel } from "../revision-panel";
import { SignPanel } from "../sign-panel";
import { StepNote } from "../step-note";

/** Ход заказчика аудита: торг, договор, оплата, План, документы, приёмка — или чего ждём. */
export function AuditCustomerActions({ order, onChange }: BlitzStepProps) {
  switch (order.status) {
    case "new":
    case "consultation":
    case "counter":
      return (
        <StepNote
          title={AUDIT_CUSTOMER_WAITING[order.status].title}
          text={AUDIT_CUSTOMER_WAITING[order.status].text}
        >
          <CancelButton
            order={order}
            onChange={onChange}
          />
        </StepNote>
      );
    case "offer":
      return (
        <OfferAnswerPanel
          order={order}
          onChange={onChange}
        />
      );
    case "expert_ready":
      return (
        <SignPanel
          order={order}
          onChange={onChange}
        />
      );
    case "contract":
    case "conclusion_ready":
      return (
        <PaymentPanel
          order={order}
          onChange={onChange}
        />
      );
    case "plan_review":
      return (
        <PlanReviewPanel
          order={order}
          onChange={onChange}
        />
      );
    case "in_progress":
      return (
        <ChecklistPanel
          order={order}
          onChange={onChange}
        />
      );
    case "remarks":
      return (
        <>
          <RevisionPanel
            order={order}
            onChange={onChange}
          />
          <ChecklistPanel
            order={order}
            onChange={onChange}
          />
        </>
      );
    case "sent":
      return (
        <AcceptWorkPanel
          order={order}
          onChange={onChange}
        />
      );
    case "accepted":
      return (
        <ActPanel
          order={order}
          onChange={onChange}
        />
      );
    default:
      return (
        <StepNote
          title={AUDIT_CUSTOMER_WAITING[order.status].title}
          text={AUDIT_CUSTOMER_WAITING[order.status].text}
        />
      );
  }
}