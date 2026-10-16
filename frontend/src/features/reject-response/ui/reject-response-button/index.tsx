"use client";

import type { ResponseItem } from "@/entities/response";
import { Button } from "@/shared/ui/button";
import { useRejectResponse } from "../../model/use-reject-response";
import { RejectResponseModal } from "../reject-response-modal";

/** Отклик на заказ заказчика и обновление списка после отказа. */
interface RejectResponseButtonProps {
  response: ResponseItem;
  onRejected: () => void;
}

/** Показывает отказ исполнителю и окно с причиной отказа. */
export function RejectResponseButton({ response, onRejected }: RejectResponseButtonProps) {
  const dialog = useRejectResponse(response.id, onRejected);

  return (
    <>
      <Button
        variant="danger"
        size="sm"
        isLoading={dialog.isRejecting}
        onClick={dialog.openDialog}
      >
        Отклонить
      </Button>
      {dialog.isOpen && (
        <RejectResponseModal
          response={response}
          reason={dialog.reason}
          isRejecting={dialog.isRejecting}
          onReasonChange={dialog.changeReason}
          onCancel={dialog.closeDialog}
          onConfirm={dialog.confirmRejection}
        />
      )}
    </>
  );
}
