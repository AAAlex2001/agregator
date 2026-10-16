"use client";

import type { ResponseItem } from "@/entities/response";
import { ChangeResponseStatusButton } from "@/features/change-response-status";
import { EditResponseButton } from "@/features/edit-response";
import { OpenOrderChatButton } from "@/features/open-order-chat";
import { RestoreWithdrawnResponseButton } from "@/features/restore-withdrawn-response";
import { ShareOrderButton } from "@/features/share-order";
import { WithdrawResponseButton } from "@/features/withdraw-response";
import styles from "./style.module.scss";

/** Отклик исполнителя, обновление списка и переход в чат. */
interface ExpertResponseActionsProps {
  response: ResponseItem;
  onChanged: () => void;
  onOpenChat: (chatUuid: string) => void;
}

/** Действия исполнителя с его откликом в зависимости от статуса. */
export function ExpertResponseActions({
  response,
  onChanged,
  onOpenChat,
}: ExpertResponseActionsProps) {
  const share = <ShareOrderButton publicId={response.order_public_id} />;
  const chat = (
    <OpenOrderChatButton
      response={response}
      viewer="EXPERT"
      onOpened={onOpenChat}
    />
  );

  if (response.status === "REVIEW") {
    return (
      <div className={styles.actions}>
        <EditResponseButton
          response={response}
          onSaved={onChanged}
        />
        {share}
        <WithdrawResponseButton
          response={response}
          text="Отозвать"
          onWithdrawn={onChanged}
        />
      </div>
    );
  }

  if (response.status === "ACCEPTED") {
    return (
      <div className={styles.actions}>
        {chat}
        {share}
        <WithdrawResponseButton
          response={response}
          text="Отказаться"
          onWithdrawn={onChanged}
        />
      </div>
    );
  }

  if (response.status === "IN_PROGRESS" && !response.expert_confirmed) {
    return (
      <div className={styles.actions}>
        {chat}
        <ChangeResponseStatusButton
          responseId={response.id}
          status="IN_PROGRESS"
          text="Принять проект"
          variant="green"
          onChanged={onChanged}
        />
        {share}
        <WithdrawResponseButton
          response={response}
          text="Отказаться"
          onWithdrawn={onChanged}
        />
      </div>
    );
  }

  if (response.status === "IN_PROGRESS") {
    return (
      <div className={styles.actions}>
        {chat}
        {share}
      </div>
    );
  }

  if (response.status === "WITHDRAWN_BY_EXPERT") {
    return (
      <div className={styles.actions}>
        <RestoreWithdrawnResponseButton
          responseId={response.id}
          onRestored={onChanged}
        />
        {share}
      </div>
    );
  }

  return <div className={styles.actions}>{share}</div>;
}
