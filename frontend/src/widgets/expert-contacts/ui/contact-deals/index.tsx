"use client";

import { useExpertContacts } from "@/entities/expert-contact";
import { FormSection } from "@/shared/ui/form-section";
import { ContactDealRow } from "../contact-deal-row";
import styles from "./style.module.scss";

/** Показывает сворачиваемый список сделок, где пользователь покупает или продаёт контакты. */
export function ContactDeals() {
  const { deals } = useExpertContacts();

  if (deals.length === 0) {
    return null;
  }

  return (
    <FormSection
      title="Мои сделки"
      collapsible
      className={styles.section}
      titleClassName={styles.title}
    >
      <div className={styles.rows}>
        {deals.map((deal) => (
          <ContactDealRow
            key={deal.id}
            deal={deal}
          />
        ))}
      </div>
    </FormSection>
  );
}
