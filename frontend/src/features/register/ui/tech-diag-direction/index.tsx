import {
  TechDiagProfileFields,
  createTechDiagProfileValues,
  useTechDiagOptions,
} from "@/entities/tech-diag";
import type { TechDiagRegistration } from "../../model/expert";
import type { RegistrationFiles } from "../../model/files";
import { DirectionOption } from "../direction-option";
import { FilesPicker } from "../files-picker";

/** Анкета направления и локальные документы до отправки регистрации. */
interface TechDiagDirectionProps {
  value: TechDiagRegistration;
  onChange: (value: TechDiagRegistration) => void;
  files: RegistrationFiles;
}

/** Собирает поля направления и его документы в одной карточке выбора. */
export function TechDiagDirection({ value, onChange, files }: TechDiagDirectionProps) {
  const { options } = useTechDiagOptions();

  return (
    <DirectionOption
      id="TECH_DIAG"
      title="Техническое освидетельствование и диагностирование"
      description="Специалист НК: квалификационные удостоверения, виды и объекты контроля"
      checked={value.profile !== null}
      onToggle={() => onChange({
        ...value,
        profile: value.profile ? null : createTechDiagProfileValues(),
      })}
    >
      {value.profile && (
        <>
          <TechDiagProfileFields
            value={value.profile}
            options={options}
            onChange={(profile) => onChange({ ...value, profile })}
          />
          <FilesPicker
            label="Квалификационные удостоверения — до 10 документов"
            value={value.documents}
            onChange={(documents) => onChange({ ...value, documents })}
            files={files}
          />
        </>
      )}
    </DirectionOption>
  );
}

