"use client";

import { LEAD_FORM_ID } from "@/entities/lead";
import { Button } from "@/shared/ui/button";
import { useLeadForm } from "../../model/use-lead-form";
import { ContactFields } from "../contact-fields";
import { DirectionField } from "../direction-field";
import { LeadMedia } from "../lead-media";
import { LeadSuccess } from "../lead-success";
import { TaskFields } from "../task-fields";
import styles from "./style.module.scss";

/** Направление статьи, с которым посетитель открывает форму заявки. */
interface LeadFormProps {
  defaultDirection?: string;
}

/** Собирает заявку под статьёй и заменяет её подтверждением после отправки. */
export function LeadForm({ defaultDirection }: LeadFormProps) {
  const {
    state,
    direction,
    changeField,
    changeDirection,
    changeKinds,
    submit,
  } = useLeadForm(defaultDirection);

  if (state.isSent) {
    return (
      <aside
        className={styles.widget}
        data-direction={direction.value}
        id={LEAD_FORM_ID}
      >
        <LeadSuccess direction={direction} />
      </aside>
    );
  }

  return (
    <aside
      className={styles.widget}
      data-direction={direction.value}
      id={LEAD_FORM_ID}
    >
      <div className={styles.head}>
        <h2 className={styles.title}>
          Оставьте заявку — подберём исполнителя
        </h2>
        <p className={styles.subtitle}>
          Опишите задачу, и мы предложим специалистов с нужной аттестацией
          и опытом. Это бесплатно.
        </p>
      </div>
      <form
        className={styles.form}
        onSubmit={submit}
      >
        <div className={styles.layout}>
          <div className={styles.fields}>
            <DirectionField
              value={direction.value}
              onChange={changeDirection}
            />
            <ContactFields
              fields={state.fields}
              onChange={changeField}
            />
            <TaskFields
              fields={state.fields}
              direction={direction}
              onChange={changeField}
              onKindsChange={changeKinds}
            />
          </div>
          <LeadMedia direction={direction} />
        </div>
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          showArrow
          isLoading={state.isSending}
          className={styles.submit}
        >
          Отправить заявку
        </Button>
        <p className={styles.consent}>
          Нажимая кнопку, вы соглашаетесь с{" "}
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            политикой конфиденциальности
          </a>{" "}
          и{" "}
          <a
            href="/personal-data-consent"
            target="_blank"
            rel="noopener noreferrer"
          >
            обработкой персональных данных
          </a>
          .
        </p>
      </form>
    </aside>
  );
}
