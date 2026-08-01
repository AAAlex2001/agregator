"use client";

import { ExpertAttestationFields, type ExpertCertificate } from "@/source/entities/expertise";
import type { DirectionFormProps } from "../model/types";
import s from "./DirectionForm.module.scss";

const DEFAULT_MAP_FIELDS = ["name", "area", "object", "category"];

export function ExpertiseExpertForm({ value, onChange }: DirectionFormProps) {
  const certificates = Array.isArray(value.certificates)
    ? (value.certificates as ExpertCertificate[])
    : [];
  const mapFields = Array.isArray(value.map_fields)
    ? (value.map_fields as string[])
    : DEFAULT_MAP_FIELDS;
  const showOnMap = value.show_on_map !== false;

  return (
    <div className={s.form}>
      <ExpertAttestationFields
        certificates={certificates}
        showOnMap={showOnMap}
        mapFields={mapFields}
        onChangeCertificates={(next) => onChange({ ...value, certificates: next })}
        onChangeShowOnMap={(next) => onChange({ ...value, show_on_map: next })}
        onChangeMapFields={(next) => onChange({ ...value, map_fields: next })}
      />
    </div>
  );
}
