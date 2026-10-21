"use client";

import type { ChangeEvent } from "react";
import { Field } from "@/shared/ui/field";
import { FieldNote } from "@/shared/ui/field-note";
import { FieldStack } from "@/shared/ui/field-stack";
import { Tabs } from "@/shared/ui/tabs";
import { TextArea } from "@/shared/ui/text-area";
import type { OrderApplicant } from "../../model/details/applicant";
import type {
  AuditOrderDetails,
  AuditOrderDocument,
  AuditOrderDocumentKey,
} from "../../model/details/audit";
import type { OrderFieldOption } from "../../model/order-field-option";
import { AuditKindFields } from "../audit-kind-fields";
import { AuditScaleFields } from "../audit-scale-fields";
import { OrderApplicantFields } from "../order-applicant-fields";

/** Желаемые периоды проведения аудита СУПБ. */
const TIMELINE_TABS = [
  {
    id: "MONTH_URGENT",
    label: "В течение месяца (срочно)",
  },
  {
    id: "CURRENT_QUARTER",
    label: "Текущий квартал",
  },
  {
    id: "NEXT_QUARTER",
    label: "Следующий квартал",
  },
  {
    id: "CONSULTATION",
    label: "Консультация",
  },
];

/** Условия аудита; загруженные документы обновляются отдельно от текстовых полей. */
interface AuditOrderFieldsProps {
  value: AuditOrderDetails;
  onChange: (value: AuditOrderDetails) => void;
  onDocumentChange: (
    field: AuditOrderDocumentKey,
    document: AuditOrderDocument | null,
  ) => void;
  areaOptions: OrderFieldOption[];
}

/** Показывает заявителя, объекты, вид аудита, желаемые сроки и комментарии. */
export function AuditOrderFields({
  value,
  onChange,
  onDocumentChange,
  areaOptions,
}: AuditOrderFieldsProps) {
  /** Обновляет сведения о заявителе, сохраняя условия аудита. */
  function changeApplicant(applicant: OrderApplicant) {
    onChange({
      ...value,
      ...applicant,
    });
  }

  /** Передаёт свидетельство ОПО без перезаписи других условий заказа. */
  function changeRegistrationDocument(document: AuditOrderDocument | null) {
    onDocumentChange("registration_certificate", document);
  }

  /** Передаёт файл СТО без перезаписи других условий заказа. */
  function changeStandardDocument(document: AuditOrderDocument | null) {
    onDocumentChange("sto_file", document);
  }

  /** Меняет желаемый период проведения аудита. */
  function changeTimeline(timeline: string) {
    if (
      timeline !== "MONTH_URGENT" &&
      timeline !== "CURRENT_QUARTER" &&
      timeline !== "NEXT_QUARTER" &&
      timeline !== "CONSULTATION"
    ) {
      return;
    }

    onChange({
      ...value,
      desired_timeline: timeline,
    });
  }

  /** Меняет пояснения и вопросы заказчика к аудитору. */
  function changeComments(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange({
      ...value,
      comments: event.target.value,
    });
  }

  return (
    <FieldStack>
      <Field label="Сведения о заявителе">
        <OrderApplicantFields
          value={value}
          onChange={changeApplicant}
        />
      </Field>
      <AuditScaleFields
        value={value}
        onChange={onChange}
        onDocumentChange={changeRegistrationDocument}
      />
      <AuditKindFields
        value={value}
        onChange={onChange}
        onDocumentChange={changeStandardDocument}
        areaOptions={areaOptions}
      />
      <Field label="Желаемые сроки проведения">
        <Tabs
          tabs={TIMELINE_TABS}
          activeTab={value.desired_timeline}
          onTabChange={changeTimeline}
          variant="squared"
        />
      </Field>
      <Field label="Комментарии, пояснения, вопросы">
        <TextArea
          value={value.comments}
          onChange={changeComments}
          placeholder="Дополнительная информация для аудитора"
          maxLength={5000}
        />
      </Field>
      <FieldNote>
        Техническое задание и дополнительные файлы приложите на шаге «Документы».
      </FieldNote>
    </FieldStack>
  );
}
