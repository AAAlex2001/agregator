import cn from "classnames";
import type { MouseEvent } from "react";
import { ChatChevronDownIcon } from "@/shared/ui/icons";
import type { LicenseHolderListItem } from "../../model/types";
import { LicenseDocument } from "../license-document";
import { LicenseHolderField } from "../license-holder-field";
import styles from "./style.module.scss";

/** Документы компании и управляемое раскрытие дополнительного раздела. */
interface AdditionalLicenseDocumentsProps {
  item: LicenseHolderListItem;
  isOpen: boolean;
  onToggle: () => void;
}

/** Раскрывает лицензии, выписки СРО и аккредитацию лаборатории. */
export function AdditionalLicenseDocuments({
  item,
  isOpen,
  onToggle,
}: AdditionalLicenseDocumentsProps) {
  const hasDocuments = Boolean(
    item.mining_license_number ||
    item.lab_accreditation_number ||
    item.mining_license_file_url ||
    item.sro_design_file_url ||
    item.sro_survey_file_url ||
    item.lab_accreditation_file_url,
  );

  /** Раскрывает документы, не передавая нажатие родительским блокам. */
  function handleToggle(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onToggle();
  }

  if (!hasDocuments) {
    return null;
  }

  return (
    <div className={styles.extras}>
      <button
        type="button"
        className={styles.extrasToggle}
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <span>Дополнительные разрешительные документы</span>
        <ChatChevronDownIcon
          className={cn(styles.chevron, {
            [styles.chevronOpen]: isOpen,
          })}
        />
      </button>
      {isOpen && (
        <div className={styles.extrasBody}>
          {(item.mining_license_number || item.mining_license_file_url) && (
            <div className={styles.extrasItem}>
              {item.mining_license_number && (
                <LicenseHolderField label="Лицензия на маркшейдерские работы №:">
                  <span className={styles.value}>
                    {item.mining_license_number}
                  </span>
                </LicenseHolderField>
              )}
              <LicenseDocument
                url={item.mining_license_file_url}
                fileId="mining-license"
                fileName="Лицензия маркшейдера"
                label="Файл лицензии:"
              />
            </div>
          )}
          {item.sro_design_file_url && (
            <div className={styles.extrasItem}>
              <LicenseDocument
                url={item.sro_design_file_url}
                fileId="sro-design"
                fileName="Выписка из реестра членов СРО в области проектирования"
                label="Выписка из реестра членов СРО в области проектирования:"
              />
            </div>
          )}
          {item.sro_survey_file_url && (
            <div className={styles.extrasItem}>
              <LicenseDocument
                url={item.sro_survey_file_url}
                fileId="sro-survey"
                fileName="Выписка из реестра членов СРО в области инженерных изысканий"
                label="Выписка из реестра членов СРО в области инженерных изысканий:"
              />
            </div>
          )}
          {(item.lab_accreditation_number || item.lab_accreditation_file_url) && (
            <div className={styles.extrasItem}>
              {item.lab_accreditation_number && (
                <LicenseHolderField label="Свидетельство об аккредитации лаборатории №:">
                  <span className={styles.value}>
                    {item.lab_accreditation_number}
                  </span>
                </LicenseHolderField>
              )}
              <LicenseDocument
                url={item.lab_accreditation_file_url}
                fileId="lab-accreditation"
                fileName="Аккредитация лаборатории"
                label="Файл свидетельства:"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
