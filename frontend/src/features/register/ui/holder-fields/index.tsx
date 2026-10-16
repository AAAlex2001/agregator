import { DIRECTIONS } from "@/entities/direction";
import type { RegistrationFiles } from "../../model/files";
import type { HolderRegistration } from "../../model/holder";
import { AuditHolderDirection } from "../audit-holder-direction";
import { DesignHolderDirection } from "../design-holder-direction";
import { DirectionList } from "../direction-list";
import { DirectionOption } from "../direction-option";
import { LicenseDirection } from "../license-direction";
import { SurveyHolderDirection } from "../survey-holder-direction";
import { TechDiagHolderDirection } from "../tech-diag-holder-direction";

/** Направления держателя, для которых при регистрации достаточно галочки. */
const ADDITIONAL_DIRECTIONS = DIRECTIONS.filter((direction) =>
  direction.value === "RESEARCH"
  || direction.value === "LABORATORY"
  || direction.value === "CADASTRAL"
  || direction.value === "FORENSIC",
);

/** Анкета держателя и файлы его разрешительных документов. */
interface HolderFieldsProps {
  value: HolderRegistration;
  onChange: (value: HolderRegistration) => void;
  files: RegistrationFiles;
}

/** Собирает лицензии, членство СРО и остальные направления держателя. */
export function HolderFields({ value, onChange, files }: HolderFieldsProps) {
  return (
    <DirectionList>
      <LicenseDirection
        value={value.license}
        onChange={(license) => onChange({ ...value, license })}
        documents={value.regulatoryDocuments}
        onDocumentsChange={(regulatoryDocuments) => onChange({
          ...value,
          regulatoryDocuments,
        })}
        files={files}
      />
      <AuditHolderDirection
        value={value.audit}
        onChange={(audit) => onChange({ ...value, audit })}
      />
      <TechDiagHolderDirection
        value={value.techDiag}
        onChange={(techDiag) => onChange({ ...value, techDiag })}
      />
      <DesignHolderDirection
        value={value.design}
        onChange={(design) => onChange({ ...value, design })}
      />
      <SurveyHolderDirection
        value={value.survey}
        onChange={(survey) => onChange({ ...value, survey })}
      />
      {ADDITIONAL_DIRECTIONS.map((direction) => (
        <DirectionOption
          key={direction.value}
          id={direction.value}
          title={direction.label}
          description={direction.description}
          checked={value.directions.includes(direction.value)}
          onToggle={() => onChange({
            ...value,
            directions: value.directions.includes(direction.value)
              ? value.directions.filter((code) => code !== direction.value)
              : [...value.directions, direction.value],
          })}
        />
      ))}
    </DirectionList>
  );
}

