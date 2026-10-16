"use client";

import type { ResponseItem } from "@/entities/response";
import { ChangeResponseStatusButton } from "@/features/change-response-status";
import { DeleteRejectedResponseButton } from "@/features/delete-rejected-responses";
import { OpenOrderChatButton } from "@/features/open-order-chat";
import { RejectResponseButton } from "@/features/reject-response";
import { Button } from "@/shared/ui/button";
import styles from "./style.module.scss";

/** Отклик на заказ, обновление списка, завершение, отзыв и переход в чат. */
interface CustomerResponseActionsProps {
  response: ResponseItem;
  onChanged: () => void;
  onCompleted: (response: ResponseItem) => void;
  onLeaveReview: (response: ResponseItem) => void;
  onOpenChat: (chatUuid: string) => void;
}

/** Действия заказчика с откликом исполнителя в зависимости от статуса. */
export function CustomerResponseActions({
  response,
  onChanged,
  onCompleted,
  onLeaveReview,
  onOpenChat,
}: CustomerResponseActionsProps) {
  const chat = (
    <OpenOrderChatButton
      response={response}
      viewer="CUSTOMER"
      onOpened={onOpenChat}
    />
  );
  const select = (
    <ChangeResponseStatusButton
      responseId={response.id}
      status="IN_PROGRESS"
      text="Выбрать исполнителем"
      variant="green"
      onChanged={onChanged}
    />
  );
  const reject = (
    <RejectResponseButton
      response={response}
      onRejected={onChanged}
    />
  );

  /** Показывает предложение оставить отзыв о завершённом проекте. */
  function completeProject() {
    onCompleted(response);
  }

  /** Открывает отзыв о завершённом проекте. */
  function leaveReview() {
    onLeaveReview(response);
  }

  if (response.status === "REVIEW") {
    return (
      <div className={styles.actions}>
        {chat}
        {select}
        {reject}
      </div>
    );
  }

  if (response.status === "ACCEPTED") {
    return (
      <div className={styles.actions}>
        {select}
        {chat}
        {reject}
      </div>
    );
  }

  if (response.status === "IN_PROGRESS") {
    return (
      <div className={styles.actions}>
        {chat}
        <ChangeResponseStatusButton
          responseId={response.id}
          status="COMPLETED"
          text="Завершить проект"
          variant="green"
          onChanged={completeProject}
        />
        {reject}
      </div>
    );
  }

  if (response.status === "REJECTED") {
    return (
      <div className={styles.actions}>
        {!response.order_locked && (
          <ChangeResponseStatusButton
            responseId={response.id}
            status="REVIEW"
            text="Вернуть на рассмотрение"
            variant="outline"
            onChanged={onChanged}
          />
        )}
        <DeleteRejectedResponseButton
          response={response}
          onDeleted={onChanged}
        />
      </div>
    );
  }

  if (response.status === "COMPLETED" && !response.has_review) {
    return (
      <div className={styles.actions}>
        <Button
          variant="secondary"
          size="sm"
          onClick={leaveReview}
        >
          Оставить отзыв
        </Button>
      </div>
    );
  }

  return null;
}
