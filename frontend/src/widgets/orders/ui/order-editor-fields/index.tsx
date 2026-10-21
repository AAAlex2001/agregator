"use client";

import { getOrderStepTitle, useOrderForm, useOrderFormSteps } from "@/entities/order";
import { StepProgress } from "@/shared/ui/step-progress";
import { Title } from "@/shared/ui/title";
import { OrderEditorStep } from "../order-editor-step";
import styles from "./style.module.scss";

/** Направления заказчика, необязательный заголовок, справка и копирование. */
interface OrderEditorFieldsProps {
  directions: string[];
  title?: string;
  onShowHelp: () => void;
  onCopy: () => void;
}

/** Заголовок, шкала шагов заказа и поля текущего шага. */
export function OrderEditorFields({
  directions,
  title,
  onShowHelp,
  onCopy,
}: OrderEditorFieldsProps) {
  const { values } = useOrderForm();
  const steps = useOrderFormSteps();
  const titles = steps.keys.map((step) => ({ title: getOrderStepTitle(step, values) }));
  const next = titles[steps.step + 1];

  return (
    <>
      {title && (
        <Title
          className={styles.title}
          text={title}
        />
      )}
      <StepProgress
        steps={titles}
        current={steps.step}
        title={`Шаг ${steps.step + 1} из ${titles.length} · ${titles[steps.step].title}`}
        caption={next ? `Далее: ${next.title}` : "Последний шаг: проверьте заказ и сохраните"}
        listTitle="Шаги заказа"
        onSelect={steps.goTo}
      />
      <OrderEditorStep
        directions={directions}
        onShowHelp={onShowHelp}
        onCopy={onCopy}
      />
    </>
  );
}