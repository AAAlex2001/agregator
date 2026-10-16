"use client";

import { useId } from "react";
import type { ChangeEvent } from "react";
import type { ResponseItem } from "@/entities/response";
import { Button } from "@/shared/ui/button";
import { Modal } from "@/shared/ui/modal";
import { REJECTION_REASON_MAX_LENGTH } from "../../config/reason";
import styles from "./style.module.scss";

/** Отклоняемый отклик, введённая причина и действия окна. */
interface RejectResponseModalProps {
  response: ResponseItem;
  reason: string;
  isRejecting: boolean;
  onReasonChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Спрашивает подтверждение отказа и необязательную причину для исполнителя. */
export function RejectResponseModal({
  response,
  reason,
  isRejecting,
  onReasonChange,
  onCancel,
  onConfirm,
}: RejectResponseModalProps) {
  const id = useId();

  /** Передаёт введённую причину отказа. */
  function changeReason(event: ChangeEvent<HTMLTextAreaElement>) {
    onReasonChange(event.target.value);
  }

  return (
    <Modal
      open
      onClose={onCancel}
      size="sm"
      isBusy={isRejecting}
      ariaLabelledBy={`${id}-title`}
    >
      <h2
        id={`${id}-title`}
        className={styles.title}
      >
        Отклонить отклик
      </h2>

      <p className={styles.desc}>
        {response.expert_name ? (
          <>Исполнитель <b>{response.expert_name}</b> не подойдёт по заявке </>
        ) : (
          <>Исполнитель не подойдёт по заявке </>
        )}
        <b>«{response.order_title}»</b>?
      </p>

      <div className={styles.field}>
        <label
          htmlFor={`${id}-reason`}
          className={styles.label}
        >
          Причина отказа (необязательно)
        </label>
        <textarea
          id={`${id}-reason`}
          className={styles.textarea}
          value={reason}
          onChange={changeReason}
          placeholder="Например: не подходят сроки или цена"
          rows={4}
          disabled={isRejecting}
        />
        <span className={styles.counter}>
          {reason.length}/{REJECTION_REASON_MAX_LENGTH}
        </span>
      </div>

      <div className={styles.buttons}>
        <Button
          variant="chat"
          fullWidth
          onClick={onCancel}
        >
          Отменить
        </Button>
        <Button
          variant="danger"
          fullWidth
          isLoading={isRejecting}
          onClick={onConfirm}
        >
          Отклонить
        </Button>
      </div>
    </Modal>
  );
}
