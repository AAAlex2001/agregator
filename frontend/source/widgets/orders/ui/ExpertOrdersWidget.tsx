"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { isResponsesClosed, type OrderCardData } from "@/source/entities/order";
import { ExpertOrdersList } from "@/source/features/orders/expert-list";
import { OrderQuestions } from "@/source/features/orders/questions";
import { RespondModal } from "@/source/features/responses/respond";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import s from "./ExpertOrdersWidget.module.scss";

/** «Все заказы» исполнителя: лента и окно отклика. */
export function ExpertOrdersWidget() {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<OrderCardData | null>(null);
  const openOrderId = Number(searchParams.get("orderId")) || null;

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <Title text="Все заказы" as="h1" className={s.pageTitle} />
        <Subtitle text="Актуальные заказы по направлениям" className={s.pageSubtitle} />
      </div>
      <ExpertOrdersList openOrderId={openOrderId} onOpen={setSelected} />
      {selected && (
        <RespondModal
          order={selected}
          questions={<OrderQuestions orderId={selected.id} customerId={selected.customerId} canAsk={!isResponsesClosed(selected)} />}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
