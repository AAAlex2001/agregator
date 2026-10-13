"use client";

import { useState, type FormEvent } from "react";
import { reportComment, reportPost } from "@/source/entities/posts";
import Button from "@/source/shared/ui/Button";
import { TextArea } from "@/source/shared/ui/Inputs";
import { Modal } from "@/source/shared/ui/Modal";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { Title } from "@/source/shared/ui/Typography";
import s from "./ReportModal.module.scss";

const MAX_REASON_LENGTH = 500;

interface ReportModalProps {
  id: number;
  kind: "post" | "comment";
  onClose: () => void;
}

/** Жалоба модератору на публикацию или комментарий. */
export function ReportModal({ id, kind, onClose }: ReportModalProps) {
  const { showSuccess, showError } = useNotifications();
  const [reason, setReason] = useState("");
  const [isSending, setIsSending] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSending(true);
    try {
      await (kind === "post" ? reportPost(id, reason.trim()) : reportComment(id, reason.trim()));
      showSuccess("Жалоба отправлена модератору");
      onClose();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось отправить жалобу");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal open onClose={onClose} isBusy={isSending} ariaLabel="Пожаловаться">
      <form className={s.form} onSubmit={submit}>
        <Title text="Пожаловаться" />
        <label htmlFor="post-report-reason">Расскажите, что не так</label>
        <TextArea
          id="post-report-reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          required
          maxLength={MAX_REASON_LENGTH}
          placeholder="Причина жалобы"
        />
        <Button type="submit" isLoading={isSending} disabled={reason.trim().length < 3}>
          Отправить жалобу
        </Button>
      </form>
    </Modal>
  );
}
