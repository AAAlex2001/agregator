"use client";

import type { OrderListItem } from "@/entities/order";
import { StepActions } from "@/shared/ui/step-actions";
import { StepProgress } from "@/shared/ui/step-progress";
import { RESPOND_STEP_TITLES } from "../../config/steps";
import type { useRespondForm } from "../../model/use-respond-form";
import { RespondStepFields } from "../respond-step";
import styles from "./style.module.scss";

/** Заказ, состояние отклика и возврат к просмотру заказа с первого шага. */
interface RespondWizardProps {
  order: OrderListItem;
  form: ReturnType<typeof useRespondForm>;
  onCancel: () => void;
}

/** Отклик по шагам: шкала, поля текущего шага и кнопки перехода. */
export function RespondWizard({ order, form, onCancel }: RespondWizardProps) {
  const titles = form.keys.map((key) => ({ title: RESPOND_STEP_TITLES[key] }));
  const current = titles[form.steps.step].title;
  const next = titles[form.steps.step + 1];

  return (
    <form
      className={styles.wizard}
      noValidate
      onSubmit={form.submit}
    >
      <h2 className={styles.title}>Отклик на заказ</h2>
      <StepProgress
        steps={titles}
        current={form.steps.step}
        title={`Шаг ${form.steps.step + 1} из ${titles.length} · ${current}`}
        caption={next ? `Далее: ${next.title}` : "Последний шаг: проверьте и отправьте отклик"}
        listTitle="Шаги отклика"
        onSelect={form.steps.goTo}
      />
      <RespondStepFields
        order={order}
        form={form}
      />
      <StepActions
        isFirst={form.steps.isFirst}
        isLast={form.steps.isLast}
        isSubmitting={form.isSubmitting}
        submitLabel="Отправить отклик"
        onCancel={onCancel}
        onBack={form.steps.back}
      />
    </form>
  );
}