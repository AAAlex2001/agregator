import type { ChangeEvent } from "react";
import type { LicenseHolderProfileData } from "@/entities/user";
import { TextInput } from "@/shared/ui/text-input";
import { DOCUMENT_ACCEPT, DOCUMENT_HINT } from "../../config/documents";
import { LicenseDocumentField } from "../license-document-field";
import styles from "./style.module.scss";

/** Дополнительные разрешения держателя и редактируемые номера документов. */
interface AdditionalDocumentsProps {
  holder: LicenseHolderProfileData | null | undefined;
  miningLicenseNumber: string;
  labAccreditationNumber: string;
  onMiningLicenseNumberChange: (value: string) => void;
  onLabAccreditationNumberChange: (value: string) => void;
}

/** Показывает лицензию маркшейдера, выписки СРО и аккредитацию лаборатории. */
export function AdditionalDocuments({
  holder,
  miningLicenseNumber,
  labAccreditationNumber,
  onMiningLicenseNumberChange,
  onLabAccreditationNumberChange,
}: AdditionalDocumentsProps) {
  /** Передаёт номер лицензии маркшейдера в поля формы. */
  function changeMiningLicenseNumber(event: ChangeEvent<HTMLInputElement>) {
    onMiningLicenseNumberChange(event.target.value);
  }

  /** Передаёт номер аккредитации лаборатории в поля формы. */
  function changeLabAccreditationNumber(event: ChangeEvent<HTMLInputElement>) {
    onLabAccreditationNumberChange(event.target.value);
  }

  return (
    <div className={styles.extras}>
      <h3 className={styles.title}>Дополнительные разрешительные документы</h3>
      <p className={styles.hint}>
        Заполняйте только если применимо к вашей деятельности.
      </p>
      <div className={styles.item}>
        <TextInput
          id="miningLicenseNumber"
          placeholder="Лицензия на маркшейдерские работы №"
          autoComplete="off"
          value={miningLicenseNumber}
          onChange={changeMiningLicenseNumber}
        />
        <LicenseDocumentField
          kind="miningLicense"
          label="Файл лицензии маркшейдера"
          hint={DOCUMENT_HINT}
          accept={DOCUMENT_ACCEPT}
          fileUrl={holder?.mining_license_file_url ?? null}
        />
      </div>
      <div className={styles.item}>
        <LicenseDocumentField
          kind="sroDesign"
          label="Выписка из реестра членов СРО в области проектирования"
          hint={DOCUMENT_HINT}
          accept={DOCUMENT_ACCEPT}
          fileUrl={holder?.sro_design_file_url ?? null}
        />
      </div>
      <div className={styles.item}>
        <LicenseDocumentField
          kind="sroSurvey"
          label="Выписка из реестра членов СРО в области инженерных изысканий"
          hint={DOCUMENT_HINT}
          accept={DOCUMENT_ACCEPT}
          fileUrl={holder?.sro_survey_file_url ?? null}
        />
      </div>
      <div className={styles.item}>
        <TextInput
          id="labAccreditationNumber"
          placeholder="Свидетельство об аккредитации лаборатории №"
          autoComplete="off"
          value={labAccreditationNumber}
          onChange={changeLabAccreditationNumber}
        />
        <LicenseDocumentField
          kind="labAccreditation"
          label="Файл свидетельства аккредитации"
          hint={DOCUMENT_HINT}
          accept={DOCUMENT_ACCEPT}
          fileUrl={holder?.lab_accreditation_file_url ?? null}
        />
      </div>
    </div>
  );
}
