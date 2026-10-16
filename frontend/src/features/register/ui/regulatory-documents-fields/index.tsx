import { FormSection } from "@/shared/ui/form-section";
import { TextInput } from "@/shared/ui/text-input";
import type { RegistrationFiles } from "../../model/files";
import type { RegulatoryDocuments } from "../../model/holder";
import { FilePicker } from "../file-picker";
import styles from "./style.module.scss";

/** Дополнительные лицензии, выписки СРО и свидетельство лаборатории. */
interface RegulatoryDocumentsFieldsProps {
  value: RegulatoryDocuments;
  onChange: (value: RegulatoryDocuments) => void;
  files: RegistrationFiles;
}

/** Показывает необязательные разрешительные документы держателя. */
export function RegulatoryDocumentsFields({
  value,
  onChange,
  files,
}: RegulatoryDocumentsFieldsProps) {
  return (
    <FormSection
      title="Дополнительные разрешительные документы"
      collapsible
    >
      <div className={styles.rows}>
        <div className={styles.row}>
          <TextInput
            id="register-mining-number"
            value={value.miningNumber}
            autoComplete="off"
            onChange={(event) => onChange({ ...value, miningNumber: event.target.value })}
            placeholder="Лицензия на маркшейдерские работы №"
          />
          <FilePicker
            label="Файл лицензии маркшейдера"
            value={value.miningFile}
            onChange={(miningFile) => onChange({ ...value, miningFile })}
            files={files}
          />
        </div>
        <FilePicker
          label="Выписка из реестра членов СРО в области проектирования"
          value={value.sroDesignFile}
          onChange={(sroDesignFile) => onChange({ ...value, sroDesignFile })}
          files={files}
        />
        <FilePicker
          label="Выписка из реестра членов СРО в области инженерных изысканий"
          value={value.sroSurveyFile}
          onChange={(sroSurveyFile) => onChange({ ...value, sroSurveyFile })}
          files={files}
        />
        <div className={styles.row}>
          <TextInput
            id="register-lab-number"
            value={value.laboratoryNumber}
            autoComplete="off"
            onChange={(event) => onChange({
              ...value,
              laboratoryNumber: event.target.value,
            })}
            placeholder="Свидетельство об аккредитации лаборатории №"
          />
          <FilePicker
            label="Файл свидетельства аккредитации"
            value={value.laboratoryFile}
            onChange={(laboratoryFile) => onChange({ ...value, laboratoryFile })}
            files={files}
          />
        </div>
      </div>
    </FormSection>
  );
}

