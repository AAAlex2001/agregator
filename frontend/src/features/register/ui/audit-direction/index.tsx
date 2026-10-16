import {
  AuditExpertProfileFields,
  createAuditExpertProfileValues,
  useAuditOptions,
} from "@/entities/audit";
import type { AuditRegistration } from "../../model/expert";
import type { RegistrationFiles } from "../../model/files";
import { DirectionOption } from "../direction-option";
import { FilesPicker } from "../files-picker";

/** Анкета направления и локальные документы до отправки регистрации. */
interface AuditDirectionProps {
  value: AuditRegistration;
  onChange: (value: AuditRegistration) => void;
  files: RegistrationFiles;
}

/** Собирает поля направления и его документы в одной карточке выбора. */
export function AuditDirection({ value, onChange, files }: AuditDirectionProps) {
  const { options } = useAuditOptions();

  return (
    <DirectionOption
      id="AUDIT_SUPB"
      title="Аудит СУПБ"
      description="Аудитор с независимой оценкой квалификации или инспекционный орган типа А"
      checked={value.profile !== null}
      onToggle={() => onChange({
        ...value,
        profile: value.profile ? null : createAuditExpertProfileValues(),
      })}
    >
      {value.profile && (
        <>
          <AuditExpertProfileFields
            value={value.profile}
            options={options}
            onChange={(profile) => onChange({ ...value, profile })}
          />
          <FilesPicker
            label="Дипломы, аттестаты, курсы"
            value={value.documents}
            onChange={(documents) => onChange({ ...value, documents })}
            files={files}
          />
        </>
      )}
    </DirectionOption>
  );
}

