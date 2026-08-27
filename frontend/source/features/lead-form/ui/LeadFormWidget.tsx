"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Button from "@/source/shared/ui/Button";
import { ChevronIcon } from "@/source/shared/ui/icons";
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
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const direction =
    LEAD_DIRECTIONS.find((item) => item.value === values.direction) ?? LEAD_DIRECTIONS[0];
  const set = (key: keyof LeadFormValues) => (value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const toggleKind = (kind: string) =>
    setValues((prev) => ({
      ...prev,
      workKinds: prev.workKinds.includes(kind)
        ? prev.workKinds.filter((item) => item !== kind)
        : [...prev.workKinds, kind],
    }));

  useEffect(() => {
    if (!isOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [isOpen]);

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

      <form className={s.form} onSubmit={submit}>
        <div className={s.layout}>
          <div className={s.fields}>
            <label className={`${s.field} ${s.fieldWide}`}>
              <span className={s.label}>Направление работ *</span>
              <div className={s.pickerWrap} ref={pickerRef}>
                <button
                  type="button"
                  className={s.picker}
                  aria-haspopup="listbox"
                  aria-expanded={isOpen}
                  onClick={() => setIsOpen((value) => !value)}
                >
                  <Image
                    src={direction.image}
                    alt=""
                    width={40}
                    height={40}
                    className={s.pickerIcon}
                  />
                  <span className={s.pickerLabel}>
                    <span className={s.pickerTop}>{direction.label}</span>
                    <span className={s.pickerBottom}>{direction.hint}</span>
                  </span>
                  <ChevronIcon
                    className={isOpen ? `${s.chevron} ${s.chevronOpen}` : s.chevron}
                    color="currentColor"
                  />
                </button>
                {isOpen && (
                  <ul className={s.menu} role="listbox" aria-label="Направление работ">
                    {LEAD_DIRECTIONS.map((item) => (
                      <li key={item.value}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={item.value === direction.value}
                          className={
                            item.value === direction.value ? `${s.option} ${s.optionActive}` : s.option
                          }
                          onClick={() => {
                            setValues((prev) => ({
                              ...prev,
                              direction: item.value,
                              workKinds: [],
                            }));
                            setIsOpen(false);
                          }}
                        >
                          <Image
                            src={item.image}
                            alt=""
                            width={32}
                            height={32}
                            className={s.optionIcon}
                          />
                          <span className={s.optionLabel}>
                            <span className={s.pickerTop}>{item.label}</span>
                            <span className={s.pickerBottom}>{item.hint}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </label>

            <div className={`${s.field} ${s.fieldWide}`}>
              <span className={s.label}>Что нужно сделать</span>
              <div className={s.kinds}>
                {direction.kinds.map((kind) => (
                  <button
                    key={kind}
                    type="button"
                    aria-pressed={values.workKinds.includes(kind)}
                    className={values.workKinds.includes(kind) ? `${s.kind} ${s.kindActive}` : s.kind}
                    onClick={() => toggleKind(kind)}
                  >
                    {kind}
                  </button>
                ))}
              </div>
            </div>

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
                placeholder="+7-999-000-00-00"
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

            <label className={`${s.field} ${s.fieldWide}`}>
              <span className={s.label}>Задача *</span>
              <TextArea
                required
                rows={3}
                placeholder={direction.taskPlaceholder}
                value={values.task}
                onChange={(event) => set("task")(event.target.value)}
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
