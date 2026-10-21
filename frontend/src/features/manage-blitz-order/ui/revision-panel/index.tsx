"use client";

import { uploadBlitzStep } from "@/entities/blitz-order";
import type { BlitzUpload } from "@/entities/blitz-order";
import { useBlitzAction } from "../../model/use-blitz-action";
import type { BlitzStepProps } from "../../model/types";
import { StepFilesForm } from "../step-files-form";
import { StepNote } from "../step-note";

/** Заказчик исправляет документацию по замечаниям и отправляет её повторно. */
export function RevisionPanel({ order, onChange }: BlitzStepProps) {
  const { isPending, run } = useBlitzAction(onChange);

  /** Отправляет исправленную документацию. */
  function send({ text, files }: BlitzUpload): Promise<boolean> {
    return run(
      () => uploadBlitzStep(
        order.id,
        "revision",
        { files, fields: [["text", text]] },
        "Не удалось отправить исправления",
      ),
      "Исправления отправлены эксперту",
    );
  }

  return (
    <StepNote
      title="Эксперт прислал замечания"
      text="Замечания — ниже в разделе «Замечания». Исправьте документацию и отправьте её повторно."
    >
      <StepFilesForm
        textLabel="Комментарий для эксперта (необязательно)"
        textPlaceholder="Что исправили"
        filesLabel="Исправленная документация"
        submitLabel="Отправить на повторную проверку"
        isPending={isPending}
        needsFiles
        onSubmit={send}
      />
    </StepNote>
  );
}
