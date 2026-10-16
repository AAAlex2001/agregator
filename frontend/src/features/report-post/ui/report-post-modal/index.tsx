"use client";

import { useId } from "react";
import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { Modal } from "@/shared/ui/modal";
import { TextArea } from "@/shared/ui/text-area";
import { Title } from "@/shared/ui/title";
import { useReportPost } from "../../model/use-report-post";
import type { ReportTarget } from "../../model/types";
import styles from "./style.module.scss";

/** Наибольшая длина причины жалобы, которую принимает сервер. */
const MAX_REASON_LENGTH = 500;

/** Публикация или комментарий, на который жалуются, и закрытие окна. */
interface ReportPostModalProps {
  id: number;
  target: ReportTarget;
  onClose: () => void;
}

/** Окно жалобы модератору с причиной в свободной форме. */
export function ReportPostModal({ id, target, onClose }: ReportPostModalProps) {
  const fieldId = useId();
  const {
    reason,
    isSending,
    setReason,
    submit,
  } = useReportPost(id, target, onClose);

  return (
    <Modal
      open
      onClose={onClose}
      isBusy={isSending}
      ariaLabel="Пожаловаться"
    >
      <form
        className={styles.form}
        onSubmit={submit}
      >
        <Title text="Пожаловаться" />
        <Field
          label="Расскажите, что не так"
          htmlFor={fieldId}
        >
          <TextArea
            id={fieldId}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            required
            maxLength={MAX_REASON_LENGTH}
            placeholder="Причина жалобы"
          />
        </Field>
        <Button
          type="submit"
          isLoading={isSending}
          disabled={reason.trim().length < 3}
        >
          Отправить жалобу
        </Button>
      </form>
    </Modal>
  );
}
