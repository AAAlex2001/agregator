"use client";

import cn from "classnames";
import type { CSSProperties } from "react";
import { LEAD_DIRECTIONS, LEAD_FORM_ID } from "@/source/entities/lead";
import Button from "@/source/shared/ui/Button";
import { EmailInput, PhoneInput, TextArea, TextInput } from "@/source/shared/ui/Inputs";
import { Select } from "@/source/shared/ui/Select";
import { useLeadForm } from "../model/useLeadForm";
import s from "./LeadForm.module.scss";

const DIRECTION_OPTIONS = LEAD_DIRECTIONS.map((item) => ({
  value: item.value,
  label: item.label,
  hint: item.hint,
  image: item.image,
}));

const BENEFITS = [
  "Ответим и уточним детали в течение рабочего дня",
  "Подберём исполнителей с подтверждённой квалификацией",
  "Заявка и подбор — бесплатно, без комиссии с работ",
];

interface LeadFormProps {
  defaultDirection: string | undefined;
}

/** Заявка под статьёй для гостей: подберём исполнителя по направлению. Перекрашивается под выбранное направление. */
export function LeadForm({ defaultDirection }: LeadFormProps) {
  const { state, direction, changeField, changeDirection, changeKinds, submit } = useLeadForm(defaultDirection);
  const { fields } = state;
  const palette = { "--lead-bg": direction.bg, "--lead-ink": direction.ink, "--lead-muted": direction.muted } as CSSProperties;

  if (state.isSent) {
    return (
      <aside className={s.widget} style={palette} id={LEAD_FORM_ID}>
        <div className={s.done}>
          <h2 className={s.doneTitle}>Заявка отправлена</h2>
          <p className={s.doneText}>
            Мы получили вашу задачу по направлению «{direction.label}» и свяжемся с вами по указанному телефону в
            ближайшее рабочее время.
          </p>
          <Button href={direction.href} variant="outline" size="md" className={s.doneButton}>
            Посмотреть направление
          </Button>
        </div>
      </aside>
    );
  }

  return (
    <aside className={s.widget} style={palette} id={LEAD_FORM_ID}>
      <div className={s.head}>
        <h2 className={s.title}>Оставьте заявку — подберём исполнителя</h2>
        <p className={s.subtitle}>
          Опишите задачу, и мы предложим специалистов с нужной аттестацией и опытом. Это бесплатно.
        </p>
      </div>

      <form className={s.form} onSubmit={submit}>
        <div className={s.layout}>
          <div className={s.fields}>
            <div className={cn(s.field, s.fieldWide)}>
              <span className={s.label}>Направление работ *</span>
              <Select
                variant="pill"
                ariaLabel="Направление работ"
                options={DIRECTION_OPTIONS}
                value={direction.value}
                onChange={changeDirection}
              />
            </div>

            <label className={s.field}>
              <span className={s.label}>Ваше имя *</span>
              <TextInput
                required
                placeholder="Иван Иванович"
                value={fields.name}
                onChange={(event) => changeField("name", event.target.value)}
              />
            </label>
            <label className={s.field}>
              <span className={s.label}>Телефон *</span>
              <PhoneInput
                required
                placeholder="+7-999-000-00-00"
                value={fields.phone}
                onChange={(event) => changeField("phone", event.target.value)}
              />
            </label>
            <label className={s.field}>
              <span className={s.label}>Email</span>
              <EmailInput
                placeholder="mail@example.com"
                value={fields.email}
                onChange={(event) => changeField("email", event.target.value)}
              />
            </label>
            <label className={s.field}>
              <span className={s.label}>Организация</span>
              <TextInput
                placeholder="ООО «Пример»"
                value={fields.company}
                onChange={(event) => changeField("company", event.target.value)}
              />
            </label>
            <label className={s.field}>
              <span className={s.label}>ИНН</span>
              <TextInput
                placeholder="10 или 12 цифр"
                value={fields.inn}
                onChange={(event) => changeField("inn", event.target.value)}
              />
            </label>
            <label className={s.field}>
              <span className={s.label}>Регион, город</span>
              <TextInput
                placeholder="Например: Кемеровская область"
                value={fields.region}
                onChange={(event) => changeField("region", event.target.value)}
              />
            </label>
            <label className={s.field}>
              <span className={s.label}>Объект</span>
              <TextInput
                placeholder={direction.objectPlaceholder}
                value={fields.objectName}
                onChange={(event) => changeField("objectName", event.target.value)}
              />
            </label>
            <label className={s.field}>
              <span className={s.label}>Желаемый срок</span>
              <TextInput
                placeholder="Например: до конца месяца"
                value={fields.deadline}
                onChange={(event) => changeField("deadline", event.target.value)}
              />
            </label>

            <div className={s.field}>
              <span className={s.label}>Что нужно сделать</span>
              <Select
                multiple
                ariaLabel="Виды работ"
                placeholder="Выберите виды работ"
                options={direction.kinds.map((kind) => ({ value: kind, label: kind }))}
                value={fields.workKinds}
                onChange={changeKinds}
              />
            </div>

            <label className={s.field}>
              <span className={s.label}>Ориентировочный бюджет</span>
              <TextInput
                placeholder="Если известен"
                value={fields.budget}
                onChange={(event) => changeField("budget", event.target.value)}
              />
            </label>

            <label className={cn(s.field, s.fieldWide)}>
              <span className={s.label}>Задача *</span>
              <TextArea
                required
                rows={3}
                placeholder={direction.taskPlaceholder}
                value={fields.task}
                onChange={(event) => changeField("task", event.target.value)}
              />
            </label>
          </div>

          <aside className={s.media}>
            <video
              key={direction.video}
              className={s.video}
              src={direction.video}
              poster={direction.image}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
            />
            <ul className={s.benefits}>
              {BENEFITS.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </aside>
        </div>

        <Button type="submit" variant="primary" size="md" fullWidth showArrow isLoading={state.isSending} className={s.submit}>
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
