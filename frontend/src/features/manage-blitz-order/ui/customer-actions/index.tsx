"use client";

import { CUSTOMER_WAITING } from "../../config/waiting";
import type { BlitzStepProps } from "../../model/types";
import { AcceptWorkPanel } from "../accept-work-panel";
import { ActPanel } from "../act-panel";
import { CancelButton } from "../cancel-button";
import { PaymentPanel } from "../payment-panel";
import { RevisionPanel } from "../revision-panel";
import { SignPanel } from "../sign-panel";
import { StepNote } from "../step-note";

/** Ход заказчика: подпись, оплата, исправления, приёмка — или пояснение, чего ждём. */
export function CustomerActions({ order, onChange }: BlitzStepProps) {
  switch (order.status) {
    case "consultation":
    case "offer":
    case "counter":
    case "plan":
    case "plan_review":
      return null;
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
    case "remarks":
      return (
        <RevisionPanel
          order={order}
          onChange={onChange}
        />
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
    case "new":
      return (
        <StepNote
          title={CUSTOMER_WAITING.new.title}
          text={CUSTOMER_WAITING.new.text}
        >
          <CancelButton
            order={order}
            onChange={onChange}
          />
        </StepNote>
      );
    default:
      return (
        <StepNote
          title={CUSTOMER_WAITING[order.status].title}
          text={CUSTOMER_WAITING[order.status].text}
        />
      );
  }
}
