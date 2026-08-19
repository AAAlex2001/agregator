"use client";

import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import { ApplicantFields } from "../../shared/ui/ApplicantFields";
import type { SurveyCatalogs, SurveyOrderDetails } from "../model/types";
import s from "../../shared/ui/fields.module.scss";

interface Props {
  value: SurveyOrderDetails;
  onChange: (value: SurveyOrderDetails) => void;
  catalogs: SurveyCatalogs;
}

export function SurveyOrderFields({ value, onChange, catalogs }: Props) {
  const kindOptions = catalogs.kinds.map((option) => ({
    code: option.code,
    title: `${option.short} — ${option.title}`,
  }));

  return (
    <div className={s.form}>
      <div className={s.field}>
        <span className={s.label}>Сведения о заявителе</span>
        <ApplicantFields value={value} onChange={(next) => onChange({ ...value, ...next })} />
      </div>

      <div className={s.field}>
        <span className={s.label}>Виды изысканий</span>
        <MultiSelect
          id="survey-order-kinds"
          options={kindOptions}
          value={value.kinds}
          onChange={(next) => onChange({ ...value, kinds: next })}
        />
      </div>
    </div>
  );
}
