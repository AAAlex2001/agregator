"use client";

import { Button } from "@/shared/ui/button";
import { ConfirmModal } from "@/shared/ui/confirm-modal";
import { useDeleteOrderDialog } from "../../model/use-delete-order-dialog";

/** Идентификатор удаляемого заказа из текущего списка. */
interface DeleteOrderButtonProps {
  orderId: number;
}

/** Показывает действие удаления и обязательное подтверждение. */
export function DeleteOrderButton({ orderId }: DeleteOrderButtonProps) {
  const dialog = useDeleteOrderDialog(orderId);

  return (
    <>
      <Button
        variant="danger"
        size="sm"
        onClick={dialog.openDialog}
      >
        Удалить
      </Button>
      <ConfirmModal
        open={dialog.isOpen}
        title="Удалить заказ?"
        description="Заказ и отклики на него исчезнут безвозвратно."
        confirmLabel="Удалить"
        isBusy={dialog.isDeleting}
        onConfirm={dialog.confirmDeletion}
        onCancel={dialog.closeDialog}
      />
    </>
  );
}
