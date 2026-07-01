"use client";

import { Checkbox } from "@/source/shared/ui";
import { CertificateBuilder } from "./CertificateBuilder";
import type { ExpertCertificate } from "../model/data";
import s from "./ExpertAttestationFields.module.scss";

const MAP_FIELD_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "name", label: "ФИО" },
  { value: "object", label: "Объект экспертизы" },
  { value: "area", label: "Область аттестации" },
  { value: "category", label: "Категория" },
  { value: "contacts", label: "Контактные данные" },
];

const toggle = (list: string[], item: string): string[] =>
  list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

interface Props {
  certificates: ExpertCertificate[];
  showOnMap: boolean;
  mapFields: string[];
  onChangeCertificates: (value: ExpertCertificate[]) => void;
  onChangeShowOnMap: (value: boolean) => void;
  onChangeMapFields: (value: string[]) => void;
}

export function ExpertAttestationFields({
  certificates,
  showOnMap,
  mapFields,
  onChangeCertificates,
  onChangeShowOnMap,
  onChangeMapFields,
}: Props) {
  return (
    <div className={s.fields}>
      <div className={s.section}>
        <span className={s.sectionLabel}>Удостоверения</span>
        <span className={s.sectionHint}>
          Добавьте свои удостоверения — область аттестации, объект экспертизы и категорию
        </span>
        <CertificateBuilder value={certificates} onChange={onChangeCertificates} />
      </div>

      <div className={s.section}>
        <Checkbox id="expert-show-on-map" checked={showOnMap} onChange={onChangeShowOnMap}>
          Показывать меня на карте России
        </Checkbox>

        {showOnMap && (
          <div className={s.mapFields}>
            <span className={s.sectionHint}>Что отразить на карте — отметьте нужное</span>
            <div className={s.options}>
              {MAP_FIELD_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${s.option} ${mapFields.includes(opt.value) ? s.optionActive : ""}`}
                  onClick={() => onChangeMapFields(toggle(mapFields, opt.value))}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
