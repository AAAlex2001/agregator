import {
  BadgeCodesPicker,
  TypesPicker,
  type ExpertiseType,
} from "@/source/entities/expertise";
import type { LaborExpertiseMode } from "../model/types";
import { ExpertiseCategoryField } from "./ExpertiseCategoryField";
import { ExpertiseModeField } from "./ExpertiseModeField";
import s from "./LaborForm.module.scss";

interface LicenseExpertiseFieldsProps {
  expertiseMode: LaborExpertiseMode;
  certificateCodes: string[];
  expertiseTypes: ExpertiseType[];
  category: string;
  onExpertiseModeChange: (mode: LaborExpertiseMode) => void;
  onCertificateCodesChange: (codes: string[]) => void;
  onExpertiseTypesChange: (types: ExpertiseType[]) => void;
  onCategoryChange: (category: string) => void;
}

export function LicenseExpertiseFields({
  expertiseMode,
  certificateCodes,
  expertiseTypes,
  category,
  onExpertiseModeChange,
  onCertificateCodesChange,
  onExpertiseTypesChange,
  onCategoryChange,
}: LicenseExpertiseFieldsProps) {
  return (
    <div className={s.fieldGroup}>
      <ExpertiseModeField
        value={expertiseMode}
        onChange={onExpertiseModeChange}
      />

      {expertiseMode === "EXACT" ? (
        <BadgeCodesPicker
          value={certificateCodes}
          onChange={onCertificateCodesChange}
          typeLabel="Выберите вид удостоверения"
          areaLabel="Выберите точную область аттестации"
          resultLabel="Требуемые удостоверения"
        />
      ) : (
        <TypesPicker
          value={expertiseTypes}
          onChange={onExpertiseTypesChange}
          label="Выберите вид экспертизы"
          hint="Область Э не уточняется — подойдёт любой эксперт выбранного вида"
        />
      )}

      <ExpertiseCategoryField
        value={category}
        onChange={onCategoryChange}
      />
    </div>
  );
}
