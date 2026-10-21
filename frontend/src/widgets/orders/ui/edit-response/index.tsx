"use client";

import { useResponse } from "@/entities/response";
import { EditResponseForm } from "@/features/edit-response";
import { EmptyState } from "@/shared/ui/empty-state";
import { OrderPageFrame } from "../order-page-frame";

/** Отклик из адреса и переходы после сохранения или отмены. */
interface EditResponseProps {
  responseId: number;
  onCancel: () => void;
  onSaved: () => void;
}

/** Страница изменения предложения: доступна, пока заказчик рассматривает отклик. */
export function EditResponse({ responseId, onCancel, onSaved }: EditResponseProps) {
  const { response, error, isLoading } = useResponse(responseId);

  return (
    <OrderPageFrame
      isLoading={isLoading}
      error={error}
      backHref="/responses"
      backLabel="К откликам"
    >
      {response && response.status !== "REVIEW" && (
        <EmptyState
          title="Предложение уже нельзя изменить"
          subtitle="Изменить условия можно, пока заказчик рассматривает отклик"
          actionLabel="К откликам"
          actionHref="/responses"
        />
      )}
      {response && response.status === "REVIEW" && (
        <EditResponseForm
          response={response}
          onCancel={onCancel}
          onSaved={onSaved}
        />
      )}
    </OrderPageFrame>
  );
}
