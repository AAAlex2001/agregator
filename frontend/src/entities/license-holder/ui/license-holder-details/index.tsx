import { formatLicenseRental } from "../../model/card-content";
import type { LicenseHolderListItem } from "../../model/types";
import { LicenseDocument } from "../license-document";
import { LicenseHolderContacts } from "../license-holder-contacts";
import { LicenseHolderField } from "../license-holder-field";
import styles from "./style.module.scss";

/** Реквизиты, контакты и основные документы компании. */
interface LicenseHolderDetailsProps {
  item: LicenseHolderListItem;
}

/** Показывает сведения о компании и условия предоставления лицензии. */
export function LicenseHolderDetails({ item }: LicenseHolderDetailsProps) {
  return (
    <>
      {item.inn && (
        <LicenseHolderField label="ИНН:">
          <span className={styles.value}>{item.inn}</span>
        </LicenseHolderField>
      )}
      {item.license_number && (
        <LicenseHolderField label="Лицензия №:">
          <span className={styles.value}>{item.license_number}</span>
        </LicenseHolderField>
      )}
      <LicenseHolderContacts item={item} />
      <LicenseHolderField label="Стоимость предоставления лицензии:">
        <span className={styles.rental}>{formatLicenseRental(item)}</span>
      </LicenseHolderField>
      <LicenseDocument
        url={item.license_file_url}
        fileId="license-file"
        fileName="Лицензия"
        label="Файл лицензии:"
      />
      <LicenseDocument
        url={item.company_card_url}
        fileId="company-card"
        fileName="Карточка предприятия"
        label="Карточка предприятия:"
      />
    </>
  );
}
