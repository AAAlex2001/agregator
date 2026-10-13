"use client";

import { TextArea } from "@/source/shared/ui/Inputs";
import Tabs from "@/source/shared/ui/Tabs";
import { ApplicantFields, Field, FieldNote, FieldStack } from "../../shared";
import type { AuditCatalogs } from "../catalogs/types";
import type { AuditOrderDetails, AuditTimeline } from "./types";
import { AuditKindFields } from "./AuditKindFields";
import { AuditScaleFields } from "./AuditScaleFields";

const TIMELINE_TABS = [
  { id: "MONTH_URGENT", label: "В течение месяца (срочно)" },
  { id: "CURRENT_QUARTER", label: "Текущий квартал" },
  { id: "NEXT_QUARTER", label: "Следующий квартал" },
  { id: "CONSULTATION", label: "Консультация" },
];

interface AuditOrderFieldsProps {
  value: AuditOrderDetails;
  onChange: (value: AuditOrderDetails) => void;
  catalogs: AuditCatalogs;
}

/** Заявка на аудит СУПБ: заявитель, что аудировать, тип аудита, сроки и комментарий. */
export function AuditOrderFields({ value, onChange, catalogs }: AuditOrderFieldsProps) {
  return (
    <FieldStack>
      <Field label="Сведения о заявителе">
        <ApplicantFields value={value} onChange={(next) => onChange({ ...value, ...next })} />
      </Field>

      <AuditScaleFields value={value} onChange={onChange} />
      <AuditKindFields value={value} onChange={onChange} catalogs={catalogs} />

      <Field label="Желаемые сроки проведения">
        <Tabs
          tabs={TIMELINE_TABS}
          activeTab={value.desired_timeline}
          onTabChange={(id) => onChange({ ...value, desired_timeline: id as AuditTimeline })}
          variant="squared"
        />
      </Field>

      <Field label="Комментарии, пояснения, вопросы">
        <TextArea
          value={value.comments}
          onChange={(event) => onChange({ ...value, comments: event.target.value })}
          placeholder="Дополнительная информация для аудитора"
          maxLength={5000}
        />
      </Field>

      <FieldNote>Техническое задание и дополнительные файлы приложите в файлах заявки ниже.</FieldNote>
    </FieldStack>
  );
}
