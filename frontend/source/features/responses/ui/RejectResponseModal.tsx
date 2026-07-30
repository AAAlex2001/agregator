"use client";

import { useState } from "react";
import { Button } from "@/source/shared/ui";
import { Modal } from "@/source/shared/ui";
import s from "./RejectResponseModal.module.scss";

const MAX = 1000;

interface Props {
  orderTitle: string;
  expertName: string;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}

export function RejectResponseModal({
  orderTitle,
  expertName,
  isLoading,
  onCancel,
  onConfirm,
}: Props) {
  const [reason, setReason] = useState("");

  return (
    <Modal open onClose={onCancel} size="sm" isBusy={isLoading} ariaLabelledBy="reject-modal-title">
      <h2 id="reject-modal-title" className={s.title}>Отклонить отклик</h2>

      <p className={s.desc}>
        {expertName ? <>Исполнитель <b>{expertName}</b> не подойдёт по заявке </> : <>Исполнитель не подойдёт по заявке </>}
        <b>«{orderTitle}»</b>?
      </p>

      <div className={s.field}>
        <label className={s.label}>Причина отказа (необязательно)</label>
        <textarea
          className={s.textarea}
          value={reason}
          onChange={(e) => setReason(e.target.value.slice(0, MAX))}
          placeholder="Например: не подходят сроки или цена"
          rows={4}
          disabled={isLoading}
        />
        <span className={s.counter}>{reason.length}/{MAX}</span>
      </div>

      <div className={s.buttons}>
        <Button variant="chat" fullWidth onClick={onCancel}>Отменить</Button>
        <Button
          variant="danger"
          fullWidth
          onClick={() => onConfirm(reason.trim())}
          isLoading={isLoading}
        >
          Отклонить
        </Button>
      </div>
    </Modal>
  );
}
