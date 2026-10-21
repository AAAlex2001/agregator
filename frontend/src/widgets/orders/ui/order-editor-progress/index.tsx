"use client";

import { getOrderStepTitle, useOrderForm, useOrderFormSteps } from "@/entities/order";
import { StepProgress } from "@/shared/ui/step-progress";

/** Шкала шагов заказа: текущий шаг, следующий и список пройденных. */
export function OrderEditorProgress() {
  const { values } = useOrderForm();
  const steps = useOrderFormSteps();
  const titles = steps.keys.map((step) => ({ title: getOrderStepTitle(step, values) }));
  const next = titles[steps.step + 1];

  return (
    <StepProgress
      steps={titles}
      current={steps.step}
      title={`Шаг ${steps.step + 1} из ${titles.length} · ${titles[steps.step].title}`}
      caption={next ? `Далее: ${next.title}` : "Последний шаг: проверьте заказ и сохраните"}
      listTitle="Шаги заказа"
      onSelect={steps.goTo}
    />
  );
}
