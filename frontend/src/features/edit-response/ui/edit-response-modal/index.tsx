"use client";

import { OrderSummaryPanel } from "@/entities/order";
import {
  getResponseStatusBadge,
  ResponseCommentFields,
  ResponseTermsFields,
} from "@/entities/response";
import type { ResponseItem } from "@/entities/response";
import { Modal } from "@/shared/ui/modal";
import { StepActions } from "@/shared/ui/step-actions";
import { StepProgress } from "@/shared/ui/step-progress";
import { EDIT_RESPONSE_STEPS } from "../../config/steps";
import { useEditResponse } from "../../model/use-edit-response";
import styles from "./style.module.scss";

/** Изменяемый отклик и действия после сохранения или закрытия окна. */
interface EditResponseModalProps {
  response: ResponseItem;
  onClose: () => void;
  onSaved: () => void;
}

/** Названия шагов для шкалы. */
const STEP_TITLES = EDIT_RESPONSE_STEPS.map((step) => ({ title: step.title }));

/** Изменение предложения по шагам: сроки и стоимость, затем комментарий и файлы. */
export function EditResponseModal({ response, onClose, onSaved }: EditResponseModalProps) {
  const form = useEditResponse(response, onSaved);
  const status = getResponseStatusBadge(response, "EXPERT");
  const step = EDIT_RESPONSE_STEPS[form.steps.step];

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      isBusy={form.isSubmitting}
      dialogClassName={styles.dialog}
    >
      <form
        className={styles.wizard}
        noValidate
        onSubmit={form.submit}
      >
        <div className={styles.headerRow}>
          <h2 className={styles.headerTitle}>Изменение предложения</h2>
          <div className={styles.statusRow}>
            <span className={styles.dateText}>Отклик от {response.date}</span>
            <span
              className={styles.statusBadge}
              style={{ color: status.color, background: status.background }}
            >
              {status.text}
            </span>
          </div>
        </div>
        <StepProgress
          steps={STEP_TITLES}
          current={form.steps.step}
          title={`Шаг ${form.steps.step + 1} из ${STEP_TITLES.length} · ${step.title}`}
          caption={form.steps.isLast
            ? "Последний шаг: проверьте и сохраните"
            : "Далее: Комментарий и файлы"}
          listTitle="Шаги изменения"
          onSelect={form.steps.goTo}
        />
        {step.key === "terms" ? (
          <>
            <OrderSummaryPanel
              order={{
                title: response.order_title,
                company: response.customer_company,
                customer_name: response.customer_name,
                customer_inn: response.customer_inn,
                start_date: response.order_start_date,
                date: response.order_date,
                sum: response.order_sum || response.proposed_sum,
                badges: response.badges,
              }}
            />
            <ResponseTermsFields
              offer={form.offer}
              dispatch={form.dispatch}
            />
          </>
        ) : (
          <ResponseCommentFields
            comment={form.offer.comment}
            files={form.files}
            dispatch={form.dispatch}
            onAddFiles={form.addFiles}
          />
        )}
        <StepActions
          isFirst={form.steps.isFirst}
          isLast={form.steps.isLast}
          isSubmitting={form.isSubmitting}
          submitLabel="Сохранить"
          onCancel={onClose}
          onBack={form.steps.back}
        />
      </form>
    </Modal>
  );
}