"use client";

import { Loader } from "@/shared/ui/loader";
import { StepActions } from "@/shared/ui/step-actions";
import { StepProgress } from "@/shared/ui/step-progress";
import { ORDER_STEPS } from "../../config/steps";
import { useCreateBlitzOrder } from "../../model/use-create-blitz-order";
import { OrderStep } from "../order-step";
import styles from "./style.module.scss";

/** Шаги для полосы прогресса и списка. */
const PROGRESS_STEPS = ORDER_STEPS.map((step) => ({ title: step.title }));

/** Что подписать под полосой: следующий шаг или что он последний. */
function nextCaption(step: number): string {
  const next = ORDER_STEPS[step + 1];

  return next ? `Далее: ${next.title}` : "Последний шаг: проверьте и отправьте заявку";
}

/** Заявка на экспертизу по шагам: что проверить, цена, документация, заказчик и комментарий. */
export function CreateBlitzOrderForm() {
  const form = useCreateBlitzOrder();
  const { state, catalog } = form;

  if (form.catalogError) {
    return <p className={styles.error}>{form.catalogError}</p>;
  }

  if (!catalog) {
    return (
      <div className={styles.loader}>
        <Loader
          label=""
          size="lg"
        />
      </div>
    );
  }

  const stepTitle = ORDER_STEPS[form.steps.step].title;

  return (
    <div className={styles.wizard}>
      <StepProgress
        steps={PROGRESS_STEPS}
        current={form.steps.step}
        title={`Шаг ${form.steps.step + 1} из ${PROGRESS_STEPS.length} · ${stepTitle}`}
        caption={nextCaption(form.steps.step)}
        listTitle="Шаги заявки"
        onSelect={form.steps.goTo}
      />
      <form
        className={styles.form}
        noValidate
        onSubmit={form.submit}
      >
        <OrderStep
          form={form}
          catalog={catalog}
        />
        <StepActions
          isFirst={form.steps.isFirst}
          isLast={form.steps.isLast}
          isSubmitting={state.isSubmitting}
          submitLabel="Отправить заявку"
          cancelHref="/blitz"
          onBack={form.steps.back}
        />
      </form>
    </div>
  );
}