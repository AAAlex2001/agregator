"use client";

import { ExpertContactOfferFields } from "@/source/entities/expert-contact";
import Button from "@/source/shared/ui/Button";
import { FormSection, Loader } from "@/source/shared/ui";
import { useContactOffer } from "../model/useContactOffer";
import s from "./ContactOfferForm.module.scss";

/** Блок «Платный доступ к контактам»: цена, реквизиты, согласие и кнопка сохранения. */
export function ContactOfferForm() {
  const { state, change, save } = useContactOffer();
  const { fields, loadError, isSaving } = state;

  return (
    <FormSection
      title="Платный доступ к контактам"
      hint="Телефон и email будут скрыты до подтверждения оплаты по установленной вами цене"
      collapsible
    >
      {loadError && (
        <p className={s.error} role="alert">
          {loadError}
        </p>
      )}
      {!loadError && !fields && <Loader size="sm" label="Загружаем настройки контактов" />}
      {fields && (
        <div className={s.body}>
          <ExpertContactOfferFields
            idPrefix="profile"
            withHeading={false}
            enabled={fields.enabled}
            price={fields.price}
            paymentDetails={fields.paymentDetails}
            consent={fields.consent}
            onEnabledChange={(enabled) => change({ ...fields, enabled })}
            onPriceChange={(price) => change({ ...fields, price })}
            onPaymentDetailsChange={(paymentDetails) => change({ ...fields, paymentDetails })}
            onConsentChange={(consent) => change({ ...fields, consent })}
          />

          <Button variant="chat" size="md" fullWidth isLoading={isSaving} onClick={save}>
            Сохранить
          </Button>
        </div>
      )}
    </FormSection>
  );
}
