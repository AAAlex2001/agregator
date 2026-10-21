import { blitzActUrl, blitzWording } from "@/entities/blitz-order";
import { Button } from "@/shared/ui/button";
import type { BlitzStepProps } from "../../model/types";
import { StepNote } from "../step-note";

/** Работа принята: акт сдачи-приёмки доступен для скачивания. */
export function ActPanel({ order }: BlitzStepProps) {
  return (
    <StepNote
      title="Работа принята"
      text={"Акт сдачи-приёмки составлен по приёмке в кабинете. "
        + `${blitzWording(order.service).resultTitle} — в разделе «Файлы».`}
    >
      <Button
        variant="outline"
        href={blitzActUrl(order.id)}
      >
        Скачать акт
      </Button>
    </StepNote>
  );
}
