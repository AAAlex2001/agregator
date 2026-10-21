"use client";

import { useState } from "react";
import {
  blitzDocumentsReportUrl,
  blitzWording,
  postBlitzAction,
  uploadBlitzStep,
} from "@/entities/blitz-order";
import type { BlitzUpload } from "@/entities/blitz-order";
import { Button } from "@/shared/ui/button";
import { ConfirmModal } from "@/shared/ui/confirm-modal";
import { useBlitzAction } from "../../model/use-blitz-action";
import type { BlitzStepProps } from "../../model/types";
import { StepFilesForm } from "../step-files-form";
import { StepNote } from "../step-note";
import styles from "./style.module.scss";

/** Исполнитель работает: выдаёт замечания или сообщает, что результат готов. */
export function WorkPanel({ order, onChange }: BlitzStepProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { isPending, run } = useBlitzAction(onChange);
  const wording = blitzWording(order.service);
  const isAudit = order.service === "audit";

  /** Отправляет замечания заказчику. */
  function sendRemarks({ text, files }: BlitzUpload): Promise<boolean> {
    return run(
      () => uploadBlitzStep(
        order.id,
        "remarks",
        { files, fields: [["text", text]] },
        "Не удалось отправить замечания",
      ),
      "Замечания отправлены заказчику",
    );
  }

  /** Сообщает, что результат готов, и закрывает окно. */
  async function markReady() {
    const isDone = await run(
      () => postBlitzAction(order.id, "conclusion-ready", {}, "Не удалось отметить готовность"),
      "Заказчик получит счёт на остаток",
    );

    if (isDone) {
      setIsConfirmOpen(false);
    }
  }

  return (
    <StepNote
      title={wording.workTitle}
      text={wording.workHint}
    >
      <div className={styles.ready}>
        <Button onClick={() => setIsConfirmOpen(true)}>{wording.resultReady}</Button>
        {isAudit && (
          <Button
            variant="outline"
            href={blitzDocumentsReportUrl(order.id)}
          >
            Отчёт о представленных документах
          </Button>
        )}
      </div>
      <StepFilesForm
        textLabel="Замечания"
        textPlaceholder={`Что исправить или дополнить: ${wording.documents}`}
        filesLabel="Файлы замечаний"
        submitLabel="Отправить замечания"
        isPending={isPending}
        needsFiles={false}
        onSubmit={sendRemarks}
      />
      <ConfirmModal
        open={isConfirmOpen}
        title={`${wording.resultReady}?`}
        description={wording.readyHint}
        confirmLabel="Да, готово"
        isBusy={isPending}
        onConfirm={() => void markReady()}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </StepNote>
  );
}
