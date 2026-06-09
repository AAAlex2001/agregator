"use client";

import { Button } from "@/source/shared/ui";
import { Modal } from "@/source/shared/ui";
import s from "./DeleteRejectedModal.module.scss";

interface Props {
  open: boolean;
  mode: "single" | "all";
  count?: number;
  orderTitle?: string;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function pluralResponses(n: number): string {
  const r = n % 100;
  const d = n % 10;
  if (r >= 11 && r <= 19) return `${n} откликов`;
  if (d === 1) return `${n} отклик`;
  if (d >= 2 && d <= 4) return `${n} отклика`;
  return `${n} откликов`;
}

export function DeleteRejectedModal({
  open,
  mode,
  count,
  orderTitle,
  isLoading,
  onCancel,
  onConfirm,
}: Props) {
  if (!open) return null;

  const isAll = mode === "all";
  const title = isAll ? "Удалить все отклонённые отклики?" : "Удалить отклик?";
  const desc = isAll
    ? count && count > 0
      ? `Будет удалено ${pluralResponses(count)}. Действие нельзя отменить.`
      : "Все отклонённые отклики будут удалены безвозвратно."
    : orderTitle
      ? <>Отклик по заявке <b>«{orderTitle}»</b> будет удалён. Действие нельзя отменить.</>
      : "Отклик будет удалён. Действие нельзя отменить.";

  return (
    <Modal open onClose={onCancel} size="sm" isBusy={isLoading} ariaLabelledBy="delete-rejected-title">
      <h2 id="delete-rejected-title" className={s.title}>{title}</h2>
      <p className={s.desc}>{desc}</p>
      <div className={s.buttons}>
        <Button variant="chat" fullWidth onClick={onCancel}>Отменить</Button>
        <Button variant="danger" fullWidth onClick={onConfirm} isLoading={isLoading}>
          Удалить
        </Button>
      </div>
    </Modal>
  );
}
