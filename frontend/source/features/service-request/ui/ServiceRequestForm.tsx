"use client";

import { useRef, type FormEvent } from "react";
import Link from "next/link";
import Button from "@/source/shared/ui/Button";
import Tabs from "@/source/shared/ui/Tabs";
import { TextInput, EmailInput, PhoneInput } from "@/source/shared/ui/Inputs";
import { Checkbox } from "@/source/shared/ui/Checkbox";
import { CalendarInput } from "@/source/shared/ui/CalendarInput";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { FileGallery, type FileGalleryItem } from "@/source/shared/ui/FileGallery";
import { useServiceRequest } from "../model/useServiceRequest";
import { useSubmitServiceRequest } from "../model/useSubmitServiceRequest";
import type { ServiceRequestVariant } from "../model/types";
import { Field } from "./Field";
import { LabRequestFields } from "./LabRequestFields";
import { NirRequestFields } from "./NirRequestFields";
import s from "./service-request-form.module.scss";

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
  const { submit, isSubmitting } = useSubmitServiceRequest();

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
        <NirRequestFields
          state={state}
          onTopicChange={(value) => setField("topic", value)}
          onToggleSiteVisit={toggleSiteVisit}
          onAddRequirement={addRequirement}
          onSetRequirement={setRequirement}
          onRemoveRequirement={removeRequirement}
        />
      ) : (
        <LabRequestFields
          state={state}
          onResearchNameChange={(value) => setField("researchName", value)}
          onEquipmentChange={(value) => setField("equipmentRequirements", value)}
        />
      )}

      <div className={s.row2}>
        <Field label="Имя">
          <TextInput
            value={state.firstName}
            required
            onChange={(e) => setField("firstName", e.target.value)}
            placeholder="Ваше имя"
          />
        </Field>
        <Field label="Фамилия">
          <TextInput
            value={state.lastName}
            required
            onChange={(e) => setField("lastName", e.target.value)}
            placeholder="Ваша фамилия"
          />
        </Field>
      </div>

      <div className={s.row2}>
        <Field label="Телефон">
          <PhoneInput
            value={state.phone}
            required
            onChange={(e) => setField("phone", e.target.value)}
            placeholder="+7 (999) 999-99-99"
          />
        </Field>
        <Field label="Почта">
          <EmailInput
            value={state.email}
            required
            onChange={(e) => setField("email", e.target.value)}
            placeholder="mail@example.com"
          />
        </Field>
      </div>

      <Field label="Краткое описание, задачи">
        <textarea
          className={s.textarea}
          value={state.description}
          required
          onChange={(e) => setField("description", e.target.value)}
          placeholder="Что нужно сделать"
          rows={3}
        />
      </Field>

      <div className={s.row3}>
        <Field label="Срок приёма откликов">
          <CalendarInput
            value={state.responsesDeadline}
            onChange={(value) => setField("responsesDeadline", value)}
          />
        </Field>
        <Field label="Начать работу">
          <CalendarInput
            value={state.startDate}
            onChange={(value) => setField("startDate", value)}
          />
        </Field>
        <Field label="Сдать работу">
          <CalendarInput
            value={state.dueDate}
            onChange={(value) => setField("dueDate", value)}
          />
        </Field>
      </div>

      <Field label="Начальная максимальная цена">
        <TextInput
          value={state.maxPrice}
          required
          onChange={(e) => setField("maxPrice", e.target.value)}
          placeholder="0"
          inputMode="numeric"
          suffix="₽"
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
          required
          checked={state.agreePrivacy}
          onChange={() => toggleAgreement("agreePrivacy")}
        >
          Я соглашаюсь с{" "}
          <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className={s.link}>
            Политикой конфиденциальности
          </Link>
        </Checkbox>
        <Checkbox
          id="request-terms"
          required
          checked={state.agreeTerms}
          onChange={() => toggleAgreement("agreeTerms")}
        >
          Я соглашаюсь с{" "}
          <Link href="/user-agreement" target="_blank" rel="noopener noreferrer" className={s.link}>
            Пользовательским соглашением
          </Link>
        </Checkbox>
        <Checkbox
          id="request-consent"
          required
          checked={state.agreeConsent}
          onChange={() => toggleAgreement("agreeConsent")}
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
