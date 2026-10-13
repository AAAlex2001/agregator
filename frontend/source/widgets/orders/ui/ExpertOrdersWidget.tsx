"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { isResponsesClosed, type OrderCardData } from "@/source/entities/order";
import { ExpertOrdersList } from "@/source/features/orders/expert-list";
import { OrderQuestions } from "@/source/features/orders/questions";
import { RespondModal } from "@/source/features/responses/respond";
import s from "./ExpertOrdersWidget.module.scss";

/** «Все заказы» исполнителя: лента и окно отклика. */
export function ExpertOrdersWidget() {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<OrderCardData | null>(null);
  const openOrderId = Number(searchParams.get("orderId")) || null;

  return (
    <div className={s.wrapper}>
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
