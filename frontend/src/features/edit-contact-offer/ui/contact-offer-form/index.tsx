"use client";

import { useContactOffer } from "@/entities/expert-contact";
import { FormSection } from "@/shared/ui/form-section";
import { Loader } from "@/shared/ui/loader";
import { ContactOfferEditor } from "../contact-offer-editor";
import styles from "./style.module.scss";

/** Загружает условия доступа к контактам и открывает их редактирование. */
export function ContactOfferForm() {
  const { offer, isLoading, error } = useContactOffer();

  return (
    <FormSection
      title="Платный доступ к контактам"
      hint="Телефон и email будут скрыты до подтверждения оплаты по установленной вами цене"
      collapsible
    >
      {error && (
        <p
          className={styles.error}
          role="alert"
        >
          {error}
        </p>
      )}
      {isLoading && (
        <Loader
          size="sm"
          label="Загружаем настройки контактов"
        />
      )}
      {offer && (
        <ContactOfferEditor initialOffer={offer} />
      )}
    </FormSection>
  );
}

