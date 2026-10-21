import { formatDateRu } from "@/shared/lib/format-date";
import { StepProgress } from "@/shared/ui/step-progress";
import {
  blitzStatusLabel,
  blitzStepIndex,
  blitzStepReachedAt,
  blitzSteps,
} from "../../model/status";
import type { BlitzOrder } from "../../model/types";

/** Заявка и кто смотрит: подписи статусов у заказчика и исполнителя разные. */
interface BlitzProgressProps {
  order: BlitzOrder;
  isExpert: boolean;
}

/** Этапы заявки полосой и списком с датами. У отменённой заявки полосы нет — причина в истории. */
export function BlitzProgress({ order, isExpert }: BlitzProgressProps) {
  if (order.status === "canceled") {
    return null;
  }

  const steps = blitzSteps(order.service);
  const current = blitzStepIndex(order.status, order.service);
  const since = blitzStepReachedAt(order, steps[current]);
  const progressSteps = steps.map((step, index) => {
    const reachedAt = index <= current ? blitzStepReachedAt(order, step) : null;

    return {
      title: blitzStatusLabel(step, isExpert, order.service),
      note: reachedAt ? formatDateRu(reachedAt) : undefined,
    };
  });

  return (
    <StepProgress
      steps={progressSteps}
      current={current}
      title={blitzStatusLabel(order.status, isExpert, order.service)}
      caption={`Шаг ${current + 1} из ${steps.length}${since ? ` · с ${formatDateRu(since)}` : ""}`}
      listTitle="Этапы заявки"
    />
  );
}