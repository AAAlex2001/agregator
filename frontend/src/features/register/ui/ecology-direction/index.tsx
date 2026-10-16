import {
  EcologyProfileFields,
  createEcologyProfileValues,
  useEcologyOptions,
} from "@/entities/ecology";
import type { EcologyRegistration } from "../../model/expert";
import type { RegistrationFiles } from "../../model/files";
import { DirectionOption } from "../direction-option";
import { FilesPicker } from "../files-picker";

/** Анкета направления и локальные документы до отправки регистрации. */
interface EcologyDirectionProps {
  value: EcologyRegistration;
  onChange: (value: EcologyRegistration) => void;
  files: RegistrationFiles;
}

/** Собирает поля направления и его документы в одной карточке выбора. */
export function EcologyDirection({ value, onChange, files }: EcologyDirectionProps) {
  const { options } = useEcologyOptions();

  return (
    <DirectionOption
      id="ECOLOGY"
      title="Экологическое сопровождение предприятий"
      description="Виды экологических работ, практические навыки и подтверждающие документы"
      checked={value.profile !== null}
      onToggle={() => onChange({
        ...value,
        profile: value.profile ? null : createEcologyProfileValues(),
      })}
    >
      {value.profile && (
        <>
          <EcologyProfileFields
            value={value.profile}
            options={options}
            onChange={(profile) => onChange({ ...value, profile })}
          />
          <FilesPicker
            label="Подтверждение квалификационных требований — дипломы, удостоверения, сертификаты"
            value={value.documents}
            onChange={(documents) => onChange({ ...value, documents })}
            files={files}
          />
        </>
      )}
    </DirectionOption>
  );
}

