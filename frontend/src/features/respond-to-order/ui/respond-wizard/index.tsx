"use client";

import type { ReactNode } from "react";
import type { OrderListItem } from "@/entities/order";
import { StepActions } from "@/shared/ui/step-actions";
import { StepProgress } from "@/shared/ui/step-progress";
import { Title } from "@/shared/ui/title";
import { RESPOND_STEP_TITLES } from "../../config/steps";
import type { RespondCallbacks } from "../../model/types";
import { useRespondForm } from "../../model/use-respond-form";
import { RespondStepFields } from "../respond-step";
import styles from "./style.module.scss";

/** Заказ, обсуждение его условий, переходы по результату отклика и выход с первого шага. */
interface RespondWizardProps extends RespondCallbacks {
  order: OrderListItem;
  questions: ReactNode;
  onCancel: () => void;
}

/** Заказ и отклик по шагам: сначала сводка заявки, затем предложение. */
export function RespondWizard({
  order,
  questions,
  onCancel,
  onResponded,
  onSubscriptionRequired,
}: RespondWizardProps) {
  const form = useRespondForm(order, { onResponded, onSubscriptionRequired });
  const titles = form.keys.map((key) => ({ title: RESPOND_STEP_TITLES[key] }));
  const current = titles[form.steps.step].title;
  const next = titles[form.steps.step + 1];

  return (
    <div className={styles.wizard}>
      <Title
        as="h1"
        className={styles.title}
        text={order.title}
      />
      <StepProgress
        steps={titles}
        current={form.steps.step}
        title={`Шаг ${form.steps.step + 1} из ${titles.length} · ${current}`}
        caption={next ? `Далее: ${next.title}` : "Последний шаг: проверьте и отправьте отклик"}
        listTitle="Шаги отклика"
        onSelect={form.steps.goTo}
      />
      <form
        className={styles.form}
        noValidate
        onSubmit={form.submit}
      >
        <RespondStepFields
          order={order}
          questions={questions}
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
    </div>
  );
}
