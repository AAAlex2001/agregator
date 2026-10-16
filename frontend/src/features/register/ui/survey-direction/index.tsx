import {
  SurveyProfileFields,
  createSurveyProfileValues,
  useSurveyOptions,
} from "@/entities/survey";
import type { SurveyRegistration } from "../../model/expert";
import type { RegistrationFiles } from "../../model/files";
import { DirectionOption } from "../direction-option";
import { QualificationDocumentsFields } from "../qualification-documents-fields";

/** Анкета направления и локальные документы до отправки регистрации. */
interface SurveyDirectionProps {
  value: SurveyRegistration;
  onChange: (value: SurveyRegistration) => void;
  files: RegistrationFiles;
}

/** Собирает поля направления и его документы в одной карточке выбора. */
export function SurveyDirection({ value, onChange, files }: SurveyDirectionProps) {
  const { options } = useSurveyOptions();

  return (
    <DirectionOption
      id="SURVEY"
      title="Инженерные изыскания"
      description="Направления изысканий, НОК, НРС и аттестация РТН по промышленной безопасности"
      checked={value.profile !== null}
      onToggle={() => onChange({
        ...value,
        profile: value.profile ? null : createSurveyProfileValues(),
      })}
    >
      {value.profile && (
        <>
          <SurveyProfileFields
            value={value.profile}
            options={options}
            onChange={(profile) => onChange({ ...value, profile })}
          />
          <QualificationDocumentsFields
            value={value.documents}
            onChange={(documents) => onChange({ ...value, documents })}
            files={files}
          />
        </>
      )}
    </DirectionOption>
  );
}

