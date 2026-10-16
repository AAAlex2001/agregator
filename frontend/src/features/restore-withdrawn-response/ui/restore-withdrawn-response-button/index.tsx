"use client";

import { Button } from "@/shared/ui/button";
import { useRestoreWithdrawnResponse } from "../../model/use-restore-withdrawn-response";

/** Отозванный отклик и обновление списка после восстановления. */
interface RestoreWithdrawnResponseButtonProps {
  responseId: number;
  onRestored: () => void;
}

/** Восстанавливает ранее отозванное предложение исполнителя. */
export function RestoreWithdrawnResponseButton({
  responseId,
  onRestored,
}: RestoreWithdrawnResponseButtonProps) {
  const { isRestoring, restore } = useRestoreWithdrawnResponse(responseId, onRestored);

  return (
    <Button
      variant="outline"
      size="sm"
      isLoading={isRestoring}
      onClick={restore}
    >
      Восстановить отклик
    </Button>
  );
}
