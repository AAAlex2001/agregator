"use client";

import type { ResponseItem } from "@/entities/response";
import { Button } from "@/shared/ui/button";
import { useWithdrawResponse } from "../../model/use-withdraw-response";
import { WithdrawResponseModal } from "../withdraw-response-modal";

/** Отклик, подпись кнопки для его статуса и обновление списка после отзыва. */
interface WithdrawResponseButtonProps {
  response: ResponseItem;
  text: string;
  onWithdrawn: () => void;
}

/** Показывает отзыв предложения и обязательное подтверждение. */
export function WithdrawResponseButton({
  response,
  text,
  onWithdrawn,
}: WithdrawResponseButtonProps) {
  const dialog = useWithdrawResponse(response.id, onWithdrawn);

  return (
    <>
      <Button
        variant="danger"
        size="sm"
        isLoading={dialog.isWithdrawing}
        onClick={dialog.openDialog}
      >
        {text}
      </Button>
      {dialog.isOpen && (
        <WithdrawResponseModal
          response={response}
          isWithdrawing={dialog.isWithdrawing}
          onCancel={dialog.closeDialog}
          onConfirm={dialog.confirmWithdrawal}
        />
      )}
    </>
  );
}
