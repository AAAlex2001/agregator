"use client";

import { useEffect, useState } from "react";
import { DraftCard, DraftSection } from "@/source/entities/draft";
import type { OrderCardData } from "@/source/entities/order";
import { deleteDraft, listDrafts, type ResponseDraft } from "@/source/features/expert-orders";

interface Props {
  orders: OrderCardData[];
  onContinue: (order: OrderCardData) => void;
}

export function ResponseDraftsList({ orders, onContinue }: Props) {
  const [drafts, setDrafts] = useState<ResponseDraft[]>([]);

  useEffect(() => {
    setDrafts(listDrafts());
  }, []);

  if (drafts.length === 0) return null;

  return (
    <DraftSection title="Незавершённые отклики">
      {drafts.map((draft) => (
        <DraftCard
          key={draft.orderId}
          meta={`№ ${draft.orderId}`}
          title={draft.orderTitle}
          bottomLeftLabel="Организатор:"
          bottomLeftValue={draft.customer}
          rightItems={[
            ...(draft.cost ? [{ label: "Ваша цена", value: `${draft.cost} ₽`, accent: true }] : []),
            ...(draft.deadline ? [{ label: "Срок выполнения до", value: draft.deadline, orange: true }] : []),
          ]}
          onContinue={() => {
            const order = orders.find((o) => o.id === draft.orderId);
            if (order) onContinue(order);
          }}
          onDelete={() => {
            deleteDraft(draft.orderId);
            setDrafts((prev) => prev.filter((d) => d.orderId !== draft.orderId));
          }}
        />
      ))}
    </DraftSection>
  );
}
