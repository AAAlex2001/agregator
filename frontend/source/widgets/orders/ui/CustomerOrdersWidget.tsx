"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderCardData } from "@/source/entities/order";
import { useSession } from "@/source/entities/session";
import { OrderCopyPicker } from "@/source/features/orders/copy-order";
import { CreateOrderForm } from "@/source/features/orders/create-order";
import { CustomerOrdersList } from "@/source/features/orders/customer-list";
import s from "./CustomerOrdersWidget.module.scss";

interface Editor {
  editTarget?: OrderCardData;
  copyTemplate?: OrderCardData;
}

/** Показывает заказы заказчика и открывает редактирование выбранного заказа. */
export function CustomerOrdersWidget() {
  const { user } = useSession();
  const router = useRouter();
  const [editor, setEditor] = useState<Editor | null>(null);
  const [isCopyPickerOpen, setIsCopyPickerOpen] = useState(false);
  const [version, setVersion] = useState(0);

  const copyPicker = isCopyPickerOpen && (
    <OrderCopyPicker
      customerId={user?.id ?? 0}
      onClose={() => setIsCopyPickerOpen(false)}
      onSelect={(order) => {
        setEditor({ copyTemplate: order });
        setIsCopyPickerOpen(false);
      }}
    />
  );

  if (editor) {
    return (
      <div className={s.wrapper}>
        <CreateOrderForm
          key={`${editor.editTarget?.id ?? "new"}-${editor.copyTemplate?.id ?? "blank"}`}
          editTarget={editor.editTarget}
          copyTemplate={editor.copyTemplate}
          onCancel={() => setEditor(null)}
          onCopy={() => setIsCopyPickerOpen(true)}
          onSaved={() => {
            setEditor(null);
            setVersion(version + 1);
          }}
        />
        {copyPicker}
      </div>
    );
  }

  return (
    <div className={s.wrapper}>
      <CustomerOrdersList
        key={version}
        onEdit={(order) => setEditor({ editTarget: order })}
        onCreate={() => router.push("/customer/orders/new")}
      />
      {copyPicker}
    </div>
  );
}
