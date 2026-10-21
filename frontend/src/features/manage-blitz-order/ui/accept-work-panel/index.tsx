"use client";

import { BLITZ_RESULT_LABELS, BlitzDocuments, postBlitzAction } from "@/entities/blitz-order";
import { Button } from "@/shared/ui/button";
import { useBlitzAction } from "../../model/use-blitz-action";
import type { BlitzStepProps } from "../../model/types";
import { StepNote } from "../step-note";

/** Заказчик скачивает заключение и принимает работу. */
export function AcceptWorkPanel({ order, onChange }: BlitzStepProps) {
  const { isPending, run } = useBlitzAction(onChange);
  const conclusion = order.documents.filter((document) => document.kind === "conclusion");
  const result = order.result ? BLITZ_RESULT_LABELS[order.result].toLowerCase() : "";

  /** Принимает работу. */
  function accept() {
    void run(
      () => postBlitzAction(order.id, "accept-work", {}, "Не удалось принять работу"),
      "Работа принята. Акт — в заявке",
    );
  }

  return (
    <StepNote
      title={`Заключение готово${result ? ` (${result})` : ""}`}
      text="Скачайте заключение и проверьте его. Если всё в порядке — примите работу, появится акт."
    >
      <BlitzDocuments
        orderId={order.id}
        documents={conclusion}
      />
      <Button
        isLoading={isPending}
        onClick={accept}
      >
        Принять работу
      </Button>
    </StepNote>
  );
}
