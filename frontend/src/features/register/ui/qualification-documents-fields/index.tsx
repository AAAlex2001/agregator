import type { QualificationDocuments } from "../../model/expert";
import type { RegistrationFiles } from "../../model/files";
import { FilesPicker } from "../files-picker";

/** Пять отдельных групп документов проектировщика или изыскателя. */
interface QualificationDocumentsFieldsProps {
  value: QualificationDocuments;
  onChange: (value: QualificationDocuments) => void;
  files: RegistrationFiles;
}

/** Показывает документы с одинаковыми лимитами и отдельными назначениями. */
export function QualificationDocumentsFields({
  value,
  onChange,
  files,
}: QualificationDocumentsFieldsProps) {
  return (
    <>
      <FilesPicker
        label="Диплом об образовании — до 5 документов"
        value={value.education}
        onChange={(education) => onChange({ ...value, education })}
        maxFiles={5}
        files={files}
      />
      <FilesPicker
        label="Свидетельства НОК — до 5 документов"
        value={value.nok}
        onChange={(nok) => onChange({ ...value, nok })}
        maxFiles={5}
        files={files}
      />
      <FilesPicker
        label="Уведомления о включении в НРС — до 5 документов"
        value={value.nrs}
        onChange={(nrs) => onChange({ ...value, nrs })}
        maxFiles={5}
        files={files}
      />
      <FilesPicker
        label="Повышение квалификации, курсы — до 5 документов"
        value={value.qualification}
        onChange={(qualification) => onChange({ ...value, qualification })}
        maxFiles={5}
        files={files}
      />
      <FilesPicker
        label="Протоколы аттестации РТН — до 5 документов"
        value={value.rtn}
        onChange={(rtn) => onChange({ ...value, rtn })}
        maxFiles={5}
        files={files}
      />
    </>
  );
}

