"use client";

import { useState } from "react";
import type { OrderCardData } from "@/source/entities/order";
import { useSession } from "@/source/entities/session";
import { OrderCopyPicker } from "@/source/features/orders/copy-order";
import { CreateOrderForm } from "@/source/features/orders/create-order";
import { CustomerOrdersList } from "@/source/features/orders/customer-list";
import Button from "@/source/shared/ui/Button";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import s from "./CustomerOrdersWidget.module.scss";

interface Editor {
  editTarget?: OrderCardData;
  copyTemplate?: OrderCardData;
}

/** «Мои заказы»: список, форма создания/правки и выбор заказа для копирования. */
export function CustomerOrdersWidget() {
  const { user } = useSession();
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
      <div className={s.pageHead}>
        <Title text="Мои заказы" as="h1" className={s.pageTitle} />
        <Subtitle text="Актуальные заказы по направлениям" className={s.pageSubtitle} />
      </div>
      <div className={s.createActions}>
        <Button variant="primary" size="md" fullWidth className={s.createBtn} onClick={() => setEditor({})}>
          Добавить заказ
        </Button>
        <Button variant="outlineOrange" size="md" fullWidth className={s.createBtn} onClick={() => setIsCopyPickerOpen(true)}>
          Скопировать заявку
        </Button>
      </div>
      <CustomerOrdersList key={version} onEdit={(order) => setEditor({ editTarget: order })} onCreate={() => setEditor({})} />
      {copyPicker}
    </div>
  );
}
