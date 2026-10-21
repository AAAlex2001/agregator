"use client";

import {
  BLITZ_AUDIT_ACCEPT,
  BLITZ_AUDIT_FILE_MAX_SIZE,
  BLITZ_AUDIT_FILES_HINT,
  blitzWording,
  uploadBlitzStep,
} from "@/entities/blitz-order";
import type { BlitzUpload } from "@/entities/blitz-order";
import { useBlitzAction } from "../../model/use-blitz-action";
import type { BlitzStepProps } from "../../model/types";
import { StepFilesForm } from "../step-files-form";
import { StepNote } from "../step-note";

/** Заказчик исправляет документы по замечаниям и отправляет их повторно. */
export function RevisionPanel({ order, onChange }: BlitzStepProps) {
  const { isPending, run } = useBlitzAction(onChange);
  const wording = blitzWording(order.service);
  const isAudit = order.service === "audit";

  /** Отправляет исправленные документы. */
  function send({ text, files }: BlitzUpload): Promise<boolean> {
    return run(
      () => uploadBlitzStep(
        order.id,
        "revision",
        { files, fields: [["text", text]] },
        "Не удалось отправить исправления",
      ),
      `Исправления отправлены: ${wording.executor.toLowerCase()} продолжит работу`,
    );
  }

  return (
    <StepNote
      title={`${wording.executor} прислал замечания`}
      text={`Замечания — ниже в разделе «Замечания». Исправьте ${wording.documents} `
        + "и отправьте на повторную проверку."}
    >
      <StepFilesForm
        textLabel={`Комментарий для ${isAudit ? "аудитора" : "эксперта"} (необязательно)`}
        textPlaceholder="Что исправили"
        filesLabel={isAudit ? "Исправленные документы" : "Исправленная документация"}
        submitLabel="Отправить на повторную проверку"
        isPending={isPending}
        needsFiles
        accept={isAudit ? BLITZ_AUDIT_ACCEPT : undefined}
        maxSize={isAudit ? BLITZ_AUDIT_FILE_MAX_SIZE : undefined}
        hint={isAudit ? BLITZ_AUDIT_FILES_HINT : undefined}
        onSubmit={send}
      />
    </StepNote>
  );
}
