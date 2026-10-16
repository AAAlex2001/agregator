import {
  CadastralProfileFields,
  createCadastralProfileValues,
} from "@/entities/cadastral";
import type { CadastralRegistration } from "../../model/expert";
import type { RegistrationFiles } from "../../model/files";
import { DirectionOption } from "../direction-option";
import { FilePicker } from "../file-picker";
import { FilesPicker } from "../files-picker";

/** Анкета специалиста с отдельными обязательными видами документов. */
interface CadastralDirectionProps {
  value: CadastralRegistration;
  onChange: (value: CadastralRegistration) => void;
  files: RegistrationFiles;
}

/** Собирает анкету и подтверждающие квалификацию файлы направления. */
export function CadastralDirection({ value, onChange, files }: CadastralDirectionProps) {
  return (
    <DirectionOption
      id="CADASTRAL"
      title="Кадастровые работы"
      description="Аттестат кадастрового инженера, оборудование и место работы"
      checked={value.profile !== null}
      onToggle={() => onChange({
        ...value,
        profile: value.profile ? null : createCadastralProfileValues(),
      })}
    >
      {value.profile && (
        <>
          <CadastralProfileFields
            value={value.profile}
            onChange={(profile) => onChange({ ...value, profile })}
          />
          <FilePicker
            label="Диплом об образовании"
            value={value.diploma}
            onChange={(diploma) => onChange({ ...value, diploma })}
            files={files}
          />
          <FilePicker
            label="Квалификационный аттестат"
            value={value.certificate}
            onChange={(certificate) => onChange({ ...value, certificate })}
            files={files}
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

