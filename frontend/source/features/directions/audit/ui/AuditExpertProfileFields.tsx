"use client";

import Tabs from "@/source/shared/ui/Tabs";
import { TextInput } from "@/source/shared/ui/Inputs";
import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import { PartySuggestInput, type PartySuggestion } from "@/source/features/party-suggest";
import type { AuditCatalogs, AuditExpertProfile, AuditParticipantKind } from "../model/types";
import s from "../../shared/ui/fields.module.scss";

const PARTICIPANT_TABS = [
  { id: "AUDITOR", label: "Аудитор" },
  { id: "INSPECTION_BODY", label: "Инспекционный орган (тип А)" },
];

function fromSuggestion(query: string, picked: PartySuggestion | null) {
  if (!picked) return { full_name: query, short_name: "", inn: "" };
  return {
    full_name: picked.data.name?.full_with_opf ?? picked.unrestricted_value,
    short_name: picked.data.name?.short_with_opf ?? picked.value,
    inn: picked.data.inn ?? "",
  };
}

interface Props {
  value: AuditExpertProfile;
  onChange: (value: AuditExpertProfile) => void;
  catalogs: AuditCatalogs;
}

export function AuditExpertProfileFields({ value, onChange, catalogs }: Props) {
  return (
    <div className={s.form}>
      <Tabs
        tabs={PARTICIPANT_TABS}
        activeTab={value.participant_kind}
        onTabChange={(id) => onChange({ ...value, participant_kind: id as AuditParticipantKind })}
        variant="squared"
      />

      {value.participant_kind === "AUDITOR" ? (
        <>
          <div className={s.field}>
            <span className={s.label}>Области аттестации по промышленной безопасности</span>
            <MultiSelect
              id="audit-safety"
              options={catalogs.industrial_safety_areas}
              value={value.industrial_safety_areas}
              onChange={(next) => onChange({ ...value, industrial_safety_areas: next })}
            />
          </div>

          <div className={s.field}>
            <span className={s.label}>Области аттестации как эксперта</span>
            <MultiSelect
              id="audit-expert-areas"
              options={catalogs.expert_attestation_areas}
              value={value.expert_attestation_areas}
              onChange={(next) => onChange({ ...value, expert_attestation_areas: next })}
            />
          </div>

          <div className={s.field}>
            <span className={s.label}>Независимая оценка квалификации по аудиту</span>
            <MultiSelect
              id="audit-nok"
              options={catalogs.audit_qualifications}
              value={value.audit_qualifications}
              onChange={(next) => onChange({ ...value, audit_qualifications: next })}
            />
          </div>
        </>
      ) : (
        <>
          <div className={s.field}>
            <span className={s.label}>Инспекционный орган</span>
            <PartySuggestInput
              value={value.full_name}
              onChange={(query, picked) => onChange({ ...value, ...fromSuggestion(query, picked) })}
              placeholder="ИНН или название организации"
            />
            <span className={s.hint}>
              {value.inn
                ? `ИНН ${value.inn}${value.short_name ? ` · ${value.short_name}` : ""}`
                : "Выберите организацию из подсказок — ИНН и сокращённое наименование подставятся сами"}
            </span>
          </div>

          <label className={s.field}>
            <span className={s.label}>№ свидетельства об аккредитации (тип А)</span>
            <TextInput
              value={value.certificate_number}
              onChange={(event) => onChange({ ...value, certificate_number: event.target.value })}
              placeholder="RA.RU.А-000"
            />
          </label>

          <div className={s.field}>
            <span className={s.label}>Области аккредитации по аудиту СУПБ</span>
            <MultiSelect
              id="audit-accreditation"
              options={catalogs.accreditation_areas}
              value={value.accreditation_areas}
              onChange={(next) => onChange({ ...value, accreditation_areas: next })}
            />
          </div>
        </>
      )}
    </div>
  );
}
