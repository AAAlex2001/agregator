"use client";

import { useRef, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import Button from "@/source/shared/ui/Button";
import Tabs from "@/source/shared/ui/Tabs";
import { TextInput, EmailInput, PhoneInput } from "@/source/shared/ui/Inputs";
import { Checkbox } from "@/source/shared/ui/Checkbox";
import { CalendarInput } from "@/source/shared/ui/CalendarInput";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { FileGallery, type FileGalleryItem } from "@/source/shared/ui/FileGallery";
import { EXECUTOR_REQUIREMENT_HINTS } from "@/source/entities/order";
import { useServiceRequest } from "../model/useServiceRequest";
import { useSubmitServiceRequest } from "../model/useSubmitServiceRequest";
import type { ServiceRequestVariant } from "../model/types";
import s from "./service-request-form.module.scss";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={s.field}>
      <span className={s.label}>{label}</span>
      {children}
    </div>
  );
}

const TABS = [
  { id: "nir", label: "Проведение НИР" },
  { id: "lab", label: "Лабораторные исследования" },
];

const ServiceRequestForm = () => {
  const {
    state,
    setField,
    setVariant,
    addFiles,
    removeFile,
    toggleSiteVisit,
    toggleAgreement,
    addRequirement,
    setRequirement,
    removeRequirement,
  } = useServiceRequest();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileItems: FileGalleryItem[] = state.attachments.map((attachment, index) => ({
    id: attachment.url,
    name: attachment.name,
    url: attachment.url,
    isImage: attachment.isImage,
    onRemove: () => removeFile(index),
  }));

  const isNir = state.variant === "nir";
  const { submit, isSubmitting, errors } = useSubmitServiceRequest();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit(state);
  };

  return (
    <form className={s.card} onSubmit={handleSubmit}>
      <div className={s.head}>
        <Title
          as="h2"
          text={
            isNir
              ? "Создать заявку на проведение НИР"
              : "Создать заявку на проведение лабораторных исследований"
          }
        />
        <Subtitle text="Заполните заявку — подберём специалистов под вашу задачу." />
      </div>

      <Tabs
        tabs={TABS}
        activeTab={state.variant}
        onTabChange={(id) => setVariant(id as ServiceRequestVariant)}
        variant="squared"
      />

      {isNir ? (
        <>
          <Field label="Тема">
            <TextInput
              value={state.topic}
              onChange={(e) => setField("topic", e.target.value)}
              placeholder="Тема научно-исследовательской работы"
              error={errors.topic}
            />
          </Field>

          <div className={s.field}>
            <span className={s.label}>Требования к исполнителю</span>
            {state.executorRequirements.map((item) => (
              <div key={item.id} className={s.reqRow}>
                <TextInput
                  className={s.reqInput}
                  value={item.value}
                  onChange={(e) => setRequirement(item.id, e.target.value)}
                  placeholder={EXECUTOR_REQUIREMENT_HINTS.join(", ").toLowerCase()}
                />
                {state.executorRequirements.length > 1 && (
                  <button
                    type="button"
                    className={s.reqRemove}
                    onClick={() => removeRequirement(item.id)}
                    aria-label="Удалить требование"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <Button type="button" variant="transparent" size="sm" onClick={addRequirement}>
              + Добавить поле
            </Button>
          </div>

          <Checkbox id="site-visit" checked={state.needsSiteVisit} onChange={toggleSiteVisit}>
            Необходимость выезда на объект исследований
          </Checkbox>
        </>
      ) : (
        <>
          <Field label="Наименование исследований">
            <textarea
              className={errors.researchName ? `${s.textarea} ${s.textareaError}` : s.textarea}
              value={state.researchName}
              onChange={(e) => setField("researchName", e.target.value)}
              placeholder="Что требуется исследовать"
              rows={3}
            />
            {errors.researchName && <span className={s.error}>{errors.researchName}</span>}
          </Field>
          <Field label="Требования к оборудованию">
            <TextInput
              value={state.equipmentRequirements}
              onChange={(e) => setField("equipmentRequirements", e.target.value)}
              placeholder="Необходимое оборудование, методики"
            />
          </Field>
        </>
      )}

      <div className={s.row2}>
        <Field label="Имя">
          <TextInput
            value={state.firstName}
            onChange={(e) => setField("firstName", e.target.value)}
            placeholder="Ваше имя"
            error={errors.firstName}
          />
        </Field>
        <Field label="Фамилия">
          <TextInput
            value={state.lastName}
            onChange={(e) => setField("lastName", e.target.value)}
            placeholder="Ваша фамилия"
            error={errors.lastName}
          />
        </Field>
      </div>

      <div className={s.row2}>
        <Field label="Телефон">
          <PhoneInput
            value={state.phone}
            onChange={(e) => setField("phone", e.target.value)}
            placeholder="+7 (999) 999-99-99"
            error={errors.phone}
          />
        </Field>
        <Field label="Почта">
          <EmailInput
            value={state.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="mail@example.com"
            error={errors.email}
          />
        </Field>
      </div>

      <Field label="Краткое описание, задачи">
        <textarea
          className={errors.description ? `${s.textarea} ${s.textareaError}` : s.textarea}
          value={state.description}
          onChange={(e) => setField("description", e.target.value)}
          placeholder="Что нужно сделать"
          rows={3}
        />
        {errors.description && <span className={s.error}>{errors.description}</span>}
      </Field>

      <div className={s.row3}>
        <Field label="Срок приёма откликов">
          <CalendarInput
            value={state.responsesDeadline}
            onChange={(value) => setField("responsesDeadline", value)}
            error={errors.responsesDeadline}
          />
        </Field>
        <Field label="Начать работу">
          <CalendarInput
            value={state.startDate}
            onChange={(value) => setField("startDate", value)}
            error={errors.startDate}
          />
        </Field>
        <Field label="Сдать работу">
          <CalendarInput
            value={state.dueDate}
            onChange={(value) => setField("dueDate", value)}
            error={errors.dueDate}
          />
        </Field>
      </div>

      <Field label="Начальная максимальная цена">
        <TextInput
          value={state.maxPrice}
          onChange={(e) => setField("maxPrice", e.target.value)}
          placeholder="0"
          inputMode="numeric"
          suffix="₽"
          error={errors.maxPrice}
        />
      </Field>

      <FileGallery
        items={fileItems}
        label="Документы (необязательно)"
        hint="Проект договора, ТЗ — Word, PDF, ZIP"
        variant="editable"
        onAdd={() => fileInputRef.current?.click()}
        input={
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".doc,.docx,.pdf,.zip"
            className={s.hiddenInput}
            onChange={(e) => {
              addFiles(Array.from(e.target.files ?? []));
              e.target.value = "";
            }}
          />
        }
      />

      <div className={s.agreements}>
        <Checkbox
          id="request-privacy"
          checked={state.agreePrivacy}
          onChange={() => toggleAgreement("agreePrivacy")}
          error={errors.agreePrivacy}
        >
          Я соглашаюсь с{" "}
          <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className={s.link}>
            Политикой конфиденциальности
          </Link>
        </Checkbox>
        <Checkbox
          id="request-terms"
          checked={state.agreeTerms}
          onChange={() => toggleAgreement("agreeTerms")}
          error={errors.agreeTerms}
        >
          Я соглашаюсь с{" "}
          <Link href="/user-agreement" target="_blank" rel="noopener noreferrer" className={s.link}>
            Пользовательским соглашением
          </Link>
        </Checkbox>
        <Checkbox
          id="request-consent"
          checked={state.agreeConsent}
          onChange={() => toggleAgreement("agreeConsent")}
          error={errors.agreeConsent}
        >
          Я даю{" "}
          <Link
            href="/personal-data-consent"
            target="_blank"
            rel="noopener noreferrer"
            className={s.link}
          >
            Согласие на обработку персональных данных
          </Link>
        </Checkbox>
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        showArrow
        className={s.submit}
        isLoading={isSubmitting}
      >
        Оставить заявку
      </Button>
      <p className={s.consent}>
        Мы создадим кабинет по указанной почте — в нём вы увидите отклики и сможете общаться
        с исполнителями
      </p>
    </form>
  );
};

export default ServiceRequestForm;
