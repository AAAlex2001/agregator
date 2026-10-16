"use client";

import { deleteRejectedResponses, formatResponseCount } from "@/entities/response";
import { Button } from "@/shared/ui/button";
import { ConfirmModal } from "@/shared/ui/confirm-modal";
import { useDeleteRejected } from "../../model/use-delete-rejected";

/** Число отклонённых откликов во вкладке и обновление списка после удаления. */
interface DeleteRejectedResponsesButtonProps {
  count: number;
  onDeleted: () => void;
}

/** Удаляет все отклонённые отклики заказчика после подтверждения. */
export function DeleteRejectedResponsesButton({
  count,
  onDeleted,
}: DeleteRejectedResponsesButtonProps) {
  const dialog = useDeleteRejected(deleteRejectedResponses, onDeleted);

  return (
    <>
      <Button
        variant="danger"
        size="sm"
        onClick={dialog.openDialog}
      >
        Удалить все отклонённые
      </Button>
      <ConfirmModal
        open={dialog.isOpen}
        title="Удалить все отклонённые отклики?"
        description={
          `Будет удалено ${formatResponseCount(count)}. Действие нельзя отменить.`
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
