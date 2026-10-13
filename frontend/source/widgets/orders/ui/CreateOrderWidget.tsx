"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderCardData } from "@/source/entities/order";
import { useSession } from "@/source/entities/session";
import { OrderCopyPicker } from "@/source/features/orders/copy-order";
import { CreateOrderForm } from "@/source/features/orders/create-order";
import s from "./CustomerOrdersWidget.module.scss";

/** Создаёт заказ с нуля или на основе выбранного заказа. */
export function CreateOrderWidget() {
  const router = useRouter();
  const { user } = useSession();
  const [copyTemplate, setCopyTemplate] = useState<OrderCardData>();
  const [isCopyPickerOpen, setIsCopyPickerOpen] = useState(false);

  function returnToOrders() {
    router.push("/customer/orders");
  }

  return (
    <div className={s.wrapper}>
      <CreateOrderForm
        key={copyTemplate?.id ?? "new"}
        showHeading={false}
        copyTemplate={copyTemplate}
        onCancel={returnToOrders}
        onCopy={() => setIsCopyPickerOpen(true)}
        onSaved={returnToOrders}
      />
      {isCopyPickerOpen && (
        <OrderCopyPicker
          customerId={user?.id ?? 0}
          onClose={() => setIsCopyPickerOpen(false)}
          onSelect={(order) => {
            setCopyTemplate(order);
            setIsCopyPickerOpen(false);
          }}
        />
      )}
    </div>
  );
}
