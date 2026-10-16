"use client";

import { deleteRejectedResponse } from "@/entities/response";
import type { ResponseItem } from "@/entities/response";
import { Button } from "@/shared/ui/button";
import { ConfirmModal } from "@/shared/ui/confirm-modal";
import { useDeleteRejected } from "../../model/use-delete-rejected";

/** Отклонённый отклик и обновление списка после удаления. */
interface DeleteRejectedResponseButtonProps {
  response: ResponseItem;
  onDeleted: () => void;
}

/** Удаляет один отклонённый отклик после подтверждения заказчика. */
export function DeleteRejectedResponseButton({
  response,
  onDeleted,
}: DeleteRejectedResponseButtonProps) {
  const dialog = useDeleteRejected(
    () => deleteRejectedResponse(response.id),
    onDeleted,
  );

  return (
    <>
      <Button
        variant="danger"
        size="sm"
        isLoading={dialog.isDeleting}
        onClick={dialog.openDialog}
      >
        Удалить
      </Button>
      <ConfirmModal
        open={dialog.isOpen}
        title="Удалить отклик?"
        description={
          <>
            Отклик по заявке <b>«{response.order_title}»</b> будет удалён.
            Действие нельзя отменить.
          </>
        }
        confirmLabel="Удалить"
        cancelLabel="Отменить"
        isBusy={dialog.isDeleting}
        onConfirm={dialog.confirmDeletion}
        onCancel={dialog.closeDialog}
      />
    </>
  );
}
