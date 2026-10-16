import {
  DesignProfileFields,
  createDesignProfileValues,
  useDesignOptions,
} from "@/entities/design";
import type { DesignRegistration } from "../../model/expert";
import type { RegistrationFiles } from "../../model/files";
import { DirectionOption } from "../direction-option";
import { QualificationDocumentsFields } from "../qualification-documents-fields";

/** Анкета направления и локальные документы до отправки регистрации. */
interface DesignDirectionProps {
  value: DesignRegistration;
  onChange: (value: DesignRegistration) => void;
  files: RegistrationFiles;
}

/** Собирает поля направления и его документы в одной карточке выбора. */
export function DesignDirection({ value, onChange, files }: DesignDirectionProps) {
  const { options } = useDesignOptions();

  return (
    <DirectionOption
      id="DESIGN"
      title="Проектирование промышленных и гражданских объектов"
      description={
        "Специальности по разделам ПД, НОК, НРС и аттестация РТН "
        + "по промышленной безопасности"
      }
      checked={value.profile !== null}
      onToggle={() => onChange({
        ...value,
        profile: value.profile ? null : createDesignProfileValues(),
      })}
    >
      {value.profile && (
        <>
          <DesignProfileFields
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

