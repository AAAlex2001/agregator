"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { BlitzFilePicker, BLITZ_FILE_ACCEPT, useBlitzFiles } from "@/entities/blitz-order";
import type { BlitzUpload } from "@/entities/blitz-order";
import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { TextArea } from "@/shared/ui/text-area";
import styles from "./style.module.scss";

/** Подписи полей, формат файлов, обязательность и отправка. */
interface StepFilesFormProps {
  textLabel?: string;
  textPlaceholder?: string;
  filesLabel: string;
  submitLabel: string;
  isPending: boolean;
  needsFiles: boolean;
  accept?: string;
  extra?: ReactNode;
  onSubmit: (upload: BlitzUpload) => Promise<boolean>;
}

/** Текст и файлы шага: замечания, исправления или заключение. После отправки поля очищаются. */
export function StepFilesForm({
  textLabel,
  textPlaceholder,
  filesLabel,
  submitLabel,
  isPending,
  needsFiles,
  accept = BLITZ_FILE_ACCEPT,
  extra,
  onSubmit,
}: StepFilesFormProps) {
  const [text, setText] = useState("");
  const attachments = useBlitzFiles();
  const hasFiles = attachments.files.length > 0;
  const isEmpty = needsFiles ? !hasFiles : !text.trim() && !hasFiles;

  /** Отправляет шаг и очищает форму после успеха. */
  async function submit() {
    const isDone = await onSubmit({ text: text.trim(), files: attachments.files });

    if (isDone) {
      setText("");
      attachments.clearFiles();
    }
  }

  return (
    <div className={styles.form}>
      {extra}
      {textLabel && (
        <Field label={textLabel}>
          <TextArea
            value={text}
            rows={4}
            maxLength={5000}
            placeholder={textPlaceholder}
            onChange={(event) => setText(event.target.value)}
          />
        </Field>
      )}
      <BlitzFilePicker
        label={filesLabel}
        items={attachments.items}
        isFull={attachments.isFull}
        accept={accept}
        onAdd={attachments.addFiles}
      />
      <Button
        isLoading={isPending}
        disabled={isEmpty}
        onClick={() => void submit()}
      >
        {submitLabel}
      </Button>
    </div>
  );
}
