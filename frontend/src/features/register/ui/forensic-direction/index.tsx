import {
  ForensicProfileFields,
  createForensicProfileValues,
} from "@/entities/forensic";
import type { ForensicRegistration } from "../../model/expert";
import type { RegistrationFiles } from "../../model/files";
import { DirectionOption } from "../direction-option";
import { FilePicker } from "../file-picker";
import { FilesPicker } from "../files-picker";

/** Анкета специалиста с отдельными обязательными видами документов. */
interface ForensicDirectionProps {
  value: ForensicRegistration;
  onChange: (value: ForensicRegistration) => void;
  files: RegistrationFiles;
}

/** Собирает анкету и подтверждающие квалификацию файлы направления. */
export function ForensicDirection({ value, onChange, files }: ForensicDirectionProps) {
  return (
    <DirectionOption
      id="FORENSIC"
      title="Судебная экспертиза"
      description="Образование, опыт аналогичных экспертиз и кто выдаёт заключение"
      checked={value.profile !== null}
      onToggle={() => onChange({
        ...value,
        profile: value.profile ? null : createForensicProfileValues(),
      })}
    >
      {value.profile && (
        <>
          <ForensicProfileFields
            value={value.profile}
            onChange={(profile) => onChange({ ...value, profile })}
          />
          <FilePicker
            label="Диплом об образовании"
            value={value.diploma}
            onChange={(diploma) => onChange({ ...value, diploma })}
            files={files}
          />
          <FilesPicker
            label="Документы о дополнительном образовании"
            value={value.documents}
            onChange={(documents) => onChange({ ...value, documents })}
            files={files}
          />
        </>
      )}
    </DirectionOption>
  );
}

