"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui";
import { ListCard } from "@/source/shared/ui/ListCard";
import { deleteDraft, listDrafts, type ResponseDraft } from "@/source/features/expert-orders";
import s from "./ResponseDrafts.module.scss";

export function ResponseDrafts() {
  const router = useRouter();
  const [drafts, setDrafts] = useState<ResponseDraft[]>([]);

  useEffect(() => {
    setDrafts(listDrafts());
  }, []);

  if (drafts.length === 0) return null;

  const handleContinue = (orderId: number) => {
    router.push(`/expert/orders?orderId=${orderId}`);
  };

  const handleDelete = (orderId: number) => {
    deleteDraft(orderId);
    setDrafts((prev) => prev.filter((d) => d.orderId !== orderId));
  };

  const formatTime = (ms: number) => {
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className={s.section}>
      <h2 className={s.title}>Черновики откликов</h2>
      <div className={s.list}>
        {drafts.map((draft) => (
          <ListCard
            key={draft.orderId}
            meta={`№ ${draft.orderId}`}
            statusText="Черновик"
            statusColor="#5d4037"
            statusBg="#efebe9"
            titleLabel="Название заказа:"
            title={draft.orderTitle || "—"}
            bottomLeftLabel="Организатор:"
            bottomLeftValue={draft.customer || "—"}
            rightItems={[
              ...(draft.cost ? [{ label: "Ваша цена", value: `${draft.cost} ₽`, valueAccent: true }] : []),
              ...(draft.deadline ? [{ label: "Срок выполнения до", value: draft.deadline }] : []),
              { label: "Сохранён", value: formatTime(draft.updatedAt) },
            ]}
            actions={
              <>
                <Button variant="secondary" size="sm" onClick={() => handleContinue(draft.orderId)}>
                  Продолжить
                </Button>
                <Button variant="transparent" size="sm" onClick={() => handleDelete(draft.orderId)}>
                  Удалить
                </Button>
              </>
            }
          />
        ))}
      </div>
    </section>
  );
}
