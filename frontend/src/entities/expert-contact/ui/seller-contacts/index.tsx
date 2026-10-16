import type { ReleasedContacts } from "../../model/types";
import styles from "./style.module.scss";

/** Телефон и email исполнителя, открытые после подтверждения оплаты. */
interface SellerContactsProps {
  contacts: ReleasedContacts;
}

/** Показывает открытые контакты исполнителя ссылками для звонка и письма. */
export function SellerContacts({ contacts }: SellerContactsProps) {
  return (
    <section
      className={styles.contacts}
      aria-label="Открытые контакты исполнителя"
    >
      <strong>Контакты исполнителя открыты</strong>
      <div className={styles.links}>
        {contacts.phone && (
          <a href={`tel:${contacts.phone}`}>{contacts.phone}</a>
        )}
        {contacts.email && (
          <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
        )}
      </div>
    </section>
  );
}
