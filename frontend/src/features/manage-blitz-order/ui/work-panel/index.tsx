"use client";

import { useState } from "react";
import { postBlitzAction, uploadBlitzStep } from "@/entities/blitz-order";
import type { BlitzUpload } from "@/entities/blitz-order";
import { Button } from "@/shared/ui/button";
import { ConfirmModal } from "@/shared/ui/confirm-modal";
import { useBlitzAction } from "../../model/use-blitz-action";
import type { BlitzStepProps } from "../../model/types";
import { StepFilesForm } from "../step-files-form";
import { StepNote } from "../step-note";
import styles from "./style.module.scss";

/** Что делать эксперту во время работы. */
const WORK_HINT = "Если документацию нужно исправить — отправьте замечания. "
  + "Когда заключение готово, сообщите заказчику: он оплатит остаток.";

/** Что будет после «заключение готово». */
const READY_HINT = "Заказчик получит уведомление и оплатит остаток. "
  + "После оплаты вы отправите подписанное заключение.";

/** Эксперт работает: выдаёт замечания или сообщает, что заключение готово. */
export function WorkPanel({ order, onChange }: BlitzStepProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { isPending, run } = useBlitzAction(onChange);

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

  /** Сообщает, что заключение готово, и закрывает окно. */
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
      title="Экспертиза в работе"
      text={WORK_HINT}
    >
      <div className={styles.ready}>
        <Button onClick={() => setIsConfirmOpen(true)}>Заключение готово</Button>
      </div>
      <StepFilesForm
        textLabel="Замечания"
        textPlaceholder="Что исправить в документации"
        filesLabel="Файлы замечаний"
        submitLabel="Отправить замечания"
        isPending={isPending}
        needsFiles={false}
        onSubmit={sendRemarks}
      />
      <ConfirmModal
        open={isConfirmOpen}
        title="Заключение готово?"
        description={READY_HINT}
        confirmLabel="Да, готово"
        isBusy={isPending}
        onConfirm={() => void markReady()}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </StepNote>
  );
}
