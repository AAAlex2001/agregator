"use client";

import { Button } from "@/shared/ui/button";
import { ConfirmModal } from "@/shared/ui/confirm-modal";
import { useDeleteContactDeal } from "../../model/use-delete-contact-deal";

/** Заявка покупателя и оформление кнопки в строке списка. */
interface DeleteContactDealButtonProps {
  dealId: number;
  className?: string;
}

/** Показывает удаление заявки на контакты и обязательное подтверждение. */
export function DeleteContactDealButton({
  dealId,
  className,
}: DeleteContactDealButtonProps) {
  const dialog = useDeleteContactDeal(dealId);

  return (
    <>
      <Button
        variant="danger"
        size="sm"
        className={className}
        onClick={dialog.openDialog}
      >
        Удалить
      </Button>
      <ConfirmModal
        open={dialog.isOpen}
        title="Удалить заявку на контакты?"
        description={
          "Заявка исчезнет из вашего списка. "
          + "Исполнитель и история сделки сохранятся для учёта действий."
        }
        confirmLabel="Удалить"
        isBusy={dialog.isDeleting}
        onConfirm={dialog.confirmDeletion}
        onCancel={dialog.closeDialog}
      />
    </>
  );
}
