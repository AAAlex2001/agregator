"use client";

import { Button } from "@/shared/ui/button";
import { Loader } from "@/shared/ui/loader";
import { StepProgress } from "@/shared/ui/step-progress";
import { AUDIT_STEPS } from "../../config/steps";
import { useCreateBlitzAudit } from "../../model/use-create-blitz-audit";
import { AuditStep } from "../audit-step";
import styles from "./style.module.scss";

/** Шаги для полосы прогресса и списка. */
const PROGRESS_STEPS = AUDIT_STEPS.map((step) => ({ title: step.title }));

/** Что подписать под полосой: следующий шаг или что он последний. */
function nextCaption(step: number): string {
  const next = AUDIT_STEPS[step + 1];

  return next ? `Далее: ${next.title}` : "Последний шаг: проверьте и отправьте заявку";
}

/** Заявка на аудит СУПБ по шагам: от заявителя до комментария, отправка — на последнем шаге. */
export function CreateBlitzAuditForm() {
  const form = useCreateBlitzAudit();
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

  return (
    <div className={styles.wizard}>
      <StepProgress
        steps={PROGRESS_STEPS}
        current={state.step}
        title={`Шаг ${state.step + 1} из ${PROGRESS_STEPS.length}`}
        caption={nextCaption(state.step)}
        listTitle="Шаги заявки"
        onSelect={form.goTo}
      />
      <form
        className={styles.form}
        noValidate
        onSubmit={form.submit}
      >
        <AuditStep
          form={form}
          catalog={catalog}
        />
        <div className={styles.actions}>
          {state.step === 0 ? (
            <Button
              variant="outline"
              size="field"
              href="/blitz-audit"
            >
              Отмена
            </Button>
          ) : (
            <Button
              variant="outline"
              size="field"
              onClick={form.back}
            >
              Назад
            </Button>
          )}
          <Button
            type="submit"
            size="field"
            isLoading={state.isSubmitting}
          >
            {form.isLastStep ? "Отправить заявку" : "Далее"}
          </Button>
        </div>
      </form>
    </div>
  );
}