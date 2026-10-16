"use client";

import type { ResponseStatus } from "@/entities/response";
import { Button } from "@/shared/ui/button";
import { useChangeResponseStatus } from "../../model/use-change-response-status";

/** Отклик, новый статус, подпись и оформление действия. */
interface ChangeResponseStatusButtonProps {
  responseId: number;
  status: ResponseStatus;
  text: string;
  variant: "green" | "outline";
  onChanged: () => void;
}

/** Выбирает исполнителя, принимает или завершает проект, возвращает отклик на рассмотрение. */
export function ChangeResponseStatusButton({
  responseId,
  status,
  text,
  variant,
  onChanged,
}: ChangeResponseStatusButtonProps) {
  const { isChanging, changeStatus } = useChangeResponseStatus(
    responseId,
    status,
    onChanged,
  );

  return (
    <Button
      variant={variant}
      size="sm"
      isLoading={isChanging}
      onClick={changeStatus}
    >
      {text}
    </Button>
  );
}
