"use client";

import type { FormEvent } from "react";
import {
  ExpertContactOfferFields,
  useExpertContacts,
} from "@/entities/expert-contact";
import type { ExpertContactOffer } from "@/entities/expert-contact";
import { Button } from "@/shared/ui/button";
import { useEditContactOffer } from "../../model/use-edit-contact-offer";
import styles from "./style.module.scss";

/** Условия, загруженные вместе с каталогом контактов. */
interface ContactOfferSettingsProps {
  initialOffer: ExpertContactOffer;
}

/** Настраивает продажу своих контактов прямо на странице каталога. */
export function ContactOfferSettings({ initialOffer }: ContactOfferSettingsProps) {
  const { syncOffer } = useExpertContacts();
  const { fields, isSaving, change, save } = useEditContactOffer(
    initialOffer,
    "Настройки продажи контактов сохранены",
    syncOffer,
  );

  /** Сохраняет условия без перезагрузки страницы. */
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void save();
  }

  return (
    <section
      className={styles.section}
      aria-label="Продажа ваших контактов"
    >
      <form
        className={styles.form}
        onSubmit={submit}
      >
        <ExpertContactOfferFields
          idPrefix="contacts-page"
          value={fields}
          onChange={change}
        />
        <div className={styles.actions}>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSaving}
            disabled={fields.enabled && !fields.consent}
          >
            Сохранить настройки
          </Button>
        </div>
      </form>
    </section>
  );
}
