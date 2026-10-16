import type { LicenseHolderListItem } from "../../model/types";
import { LicenseHolderField } from "../license-holder-field";
import styles from "./style.module.scss";

/** Контактные данные компании из каталога. */
interface LicenseHolderContactsProps {
  item: LicenseHolderListItem;
}

/** Показывает телефон и почту компании как ссылки для связи. */
export function LicenseHolderContacts({ item }: LicenseHolderContactsProps) {
  return (
    <>
      {item.phone && (
        <LicenseHolderField label="Телефон:">
          <a
            href={`tel:${item.phone}`}
            className={styles.contact}
          >
            {item.phone}
          </a>
        </LicenseHolderField>
      )}
      {item.email && (
        <LicenseHolderField label="Почта:">
          <a
            href={`mailto:${item.email}`}
            className={styles.contact}
          >
            {item.email}
          </a>
        </LicenseHolderField>
      )}
    </>
  );
}
