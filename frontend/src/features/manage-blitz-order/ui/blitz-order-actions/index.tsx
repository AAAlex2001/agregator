"use client";

import { isAuditLead } from "@/entities/blitz-order";
import type { BlitzOrder } from "@/entities/blitz-order";
import { AuditCustomerActions } from "../audit-customer-actions";
import { AuditLeadActions } from "../audit-lead-actions";
import { CustomerActions } from "../customer-actions";
import { ExpertActions } from "../expert-actions";
import { StepNote } from "../step-note";

/** Заявка, кто смотрит и как показать её новую версию. */
interface BlitzOrderActionsProps {
  order: BlitzOrder;
  isExpert: boolean;
  viewerId: number | undefined;
  onChange: (order: BlitzOrder) => void;
}

/** Что сейчас сделать по заявке тому, кто её смотрит. */
export function BlitzOrderActions({ order, isExpert, viewerId, onChange }: BlitzOrderActionsProps) {
  if (order.service === "audit" && !isExpert) {
    return (
      <AuditCustomerActions
        order={order}
        onChange={onChange}
      />
    );
  }

  if (order.service === "audit" && order.status !== "new" && !isAuditLead(order, viewerId)) {
    const lead = order.team.find((member) => member.lead);

    return (
      <StepNote
        title="Вы в аудиторской группе"
        text={`Заявку ведёт руководитель группы${lead ? ` ${lead.name}` : ""}. `
          + "Документы заказчика — в разделе «Файлы»."}
      />
    );
  }

  if (order.service === "audit") {
    return (
      <AuditLeadActions
        order={order}
        onChange={onChange}
      />
    );
  }

  if (isExpert) {
    return (
      <ExpertActions
        order={order}
        onChange={onChange}
      />
    );
  }

  return (
    <CustomerActions
      order={order}
      onChange={onChange}
    />
  );
}
