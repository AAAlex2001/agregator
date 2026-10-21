"use client";

import { useState } from "react";
import { postBlitzAction } from "@/entities/blitz-order";
import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { Modal } from "@/shared/ui/modal";
import { TextArea } from "@/shared/ui/text-area";
import { useBlitzAction } from "../../model/use-blitz-action";
import type { BlitzStepProps } from "../../model/types";
import styles from "./style.module.scss";

/** Заказчик отменяет заявку до подписания договора и пишет причину. */
export function CancelButton({ order, onChange }: BlitzStepProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const { isPending, run } = useBlitzAction(onChange);

  /** Отменяет заявку и закрывает окно. */
  async function cancel() {
    const isDone = await run(
      () => postBlitzAction(
        order.id,
        "cancel",
        { reason: reason.trim() },
        "Не удалось отменить заявку",
      ),
      "Заявка отменена",
    );

    if (isDone) {
      setIsOpen(false);
    }
  }

  return (
    <>
      <Button
        size="field"
        variant="transparent"
        onClick={() => setIsOpen(true)}
      >
        Отменить заявку
      </Button>
      <Modal
        open={isOpen}
        size="sm"
        isBusy={isPending}
        ariaLabel="Отмена заявки"
        onClose={() => setIsOpen(false)}
      >
        <div className={styles.dialog}>
          <h2 className={styles.title}>Отменить заявку №{order.id}?</h2>
          <Field label="Причина">
            <TextArea
              value={reason}
              rows={3}
              maxLength={1000}
              placeholder="Например, нашли другого исполнителя"
              onChange={(event) => setReason(event.target.value)}
            />
          </Field>
          <div className={styles.actions}>
            <Button
              size="field"
              variant="outline"
              disabled={isPending}
              onClick={() => setIsOpen(false)}
            >
              Не отменять
            </Button>
            <Button
              size="field"
              isLoading={isPending}
              disabled={reason.trim().length < 3}
              onClick={() => void cancel()}
            >
              Отменить заявку
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
