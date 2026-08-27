"use client";

import { useState, type FormEvent } from "react";
import Button from "@/source/shared/ui/Button";
import { TextInput, TextArea, EmailInput, PhoneInput } from "@/source/shared/ui/Inputs";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { submitLead } from "../api/lead.api";
import { LEAD_DIRECTIONS } from "../model/directions";
import { emptyLeadForm, type LeadFormValues } from "../model/types";
import s from "./LeadFormWidget.module.scss";

const BENEFITS = [
  "Ответим и уточним детали в течение рабочего дня",
  "Подберём исполнителей с подтверждённой квалификацией",
  "Заявка и подбор — бесплатно, без комиссии с работ",
];

interface Props {
  /** Направление статьи — им форма открывается по умолчанию. */
  defaultDirection?: string;
}

export function LeadFormWidget({ defaultDirection }: Props) {
  const { showError } = useNotifications();
  const [values, setValues] = useState<LeadFormValues>({
    ...emptyLeadForm,
    direction: defaultDirection ?? emptyLeadForm.direction,
  });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const direction =
    LEAD_DIRECTIONS.find((item) => item.value === values.direction) ?? LEAD_DIRECTIONS[0];
  const set = (key: keyof LeadFormValues) => (value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (isSending) return;
    setIsSending(true);
    try {
      await submitLead(values, typeof window === "undefined" ? "" : window.location.href);
      setIsSent(true);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось отправить заявку");
    } finally {
      setIsSending(false);
    }
  };

  const style = {
    "--lead-bg": direction.bg,
    "--lead-ink": direction.ink,
    "--lead-muted": direction.muted,
  } as React.CSSProperties;

  if (isSent) {
    return (
      <aside className={s.widget} style={style}>
        <div className={s.done}>
          <h2 className={s.doneTitle}>Заявка отправлена</h2>
          <p className={s.doneText}>
            Мы получили вашу задачу по направлению «{direction.label}» и свяжемся с вами по
            указанному телефону в ближайшее рабочее время.
          </p>
          <Button href={direction.href} variant="outline" size="md" className={s.doneButton}>
            Посмотреть направление
          </Button>
        </div>
      </aside>
    );
  }

  return (
    <aside className={s.widget} style={style} id="lead-form">
      <div className={s.head}>
        <h2 className={s.title}>Оставьте заявку — подберём исполнителя</h2>
        <p className={s.subtitle}>
          Опишите задачу, и мы предложим специалистов с нужной аттестацией и опытом. Это бесплатно.
        </p>
      </div>

      <div className={s.tabs} role="radiogroup" aria-label="Направление работ">
        {LEAD_DIRECTIONS.map((item) => (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={item.value === direction.value}
            className={item.value === direction.value ? `${s.tab} ${s.tabActive}` : s.tab}
            onClick={() => set("direction")(item.value)}
          >
            {item.short}
          </button>
        ))}
      </div>

      <form className={s.form} onSubmit={submit}>
        <div className={s.grid}>
          <label className={s.field}>
            <span className={s.label}>Ваше имя *</span>
            <TextInput
              required
              placeholder="Иван Иванович"
              value={values.name}
              onChange={(event) => set("name")(event.target.value)}
            />
          </label>
          <label className={s.field}>
            <span className={s.label}>Телефон *</span>
            <PhoneInput
              required
              value={values.phone}
              onChange={(event) => set("phone")(event.target.value)}
            />
          </label>
          <label className={s.field}>
            <span className={s.label}>Email</span>
            <EmailInput
              placeholder="mail@example.com"
              value={values.email}
              onChange={(event) => set("email")(event.target.value)}
            />
          </label>
          <label className={s.field}>
            <span className={s.label}>Организация</span>
            <TextInput
              placeholder="ООО «Пример»"
              value={values.company}
              onChange={(event) => set("company")(event.target.value)}
            />
          </label>
          <label className={s.field}>
            <span className={s.label}>ИНН</span>
            <TextInput
              placeholder="10 или 12 цифр"
              value={values.inn}
              onChange={(event) => set("inn")(event.target.value)}
            />
          </label>
          <label className={s.field}>
            <span className={s.label}>Регион, город</span>
            <TextInput
              placeholder="Например: Кемеровская область"
              value={values.region}
              onChange={(event) => set("region")(event.target.value)}
            />
          </label>
          <label className={s.field}>
            <span className={s.label}>Объект</span>
            <TextInput
              placeholder={direction.objectPlaceholder}
              value={values.objectName}
              onChange={(event) => set("objectName")(event.target.value)}
            />
          </label>
          <label className={s.field}>
            <span className={s.label}>Желаемый срок</span>
            <TextInput
              placeholder="Например: до конца месяца"
              value={values.deadline}
              onChange={(event) => set("deadline")(event.target.value)}
            />
          </label>
          <label className={s.field}>
            <span className={s.label}>Ориентировочный бюджет</span>
            <TextInput
              placeholder="Если известен"
              value={values.budget}
              onChange={(event) => set("budget")(event.target.value)}
            />
          </label>
        </div>

        <label className={`${s.field} ${s.taskField}`}>
          <span className={s.label}>Задача *</span>
          <TextArea
            required
            rows={3}
            placeholder={direction.taskPlaceholder}
            value={values.task}
            onChange={(event) => set("task")(event.target.value)}
          />
        </label>

        <ul className={s.benefits}>
          {BENEFITS.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>

        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          showArrow
          isLoading={isSending}
          className={s.submit}
        >
          Отправить заявку
        </Button>

        <p className={s.consent}>
          Нажимая кнопку, вы соглашаетесь с{" "}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
            политикой конфиденциальности
          </a>{" "}
          и{" "}
          <a href="/personal-data-consent" target="_blank" rel="noopener noreferrer">
            обработкой персональных данных
          </a>
          .
        </p>
      </form>
    </aside>
  );
}
