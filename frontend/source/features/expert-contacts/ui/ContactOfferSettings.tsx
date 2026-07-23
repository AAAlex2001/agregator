"use client";

import { useState, type FormEvent } from "react";
import {
  ExpertContactOfferFields,
  type ExpertContactOfferData,
} from "@/source/entities/expert-contact";
import { Button } from "@/source/shared/ui";
import { useNotifications } from "@/source/shared/ui/Notifications";
import s from "./ContactOfferSettings.module.scss";

interface ContactOfferSettingsProps {
  offer: ExpertContactOfferData;
  busy: boolean;
  onSave: (payload: {
    enabled: boolean;
    price_rubles?: number;
    payment_details?: string;
    disclosure_consent?: boolean;
  }) => Promise<boolean>;
}

export function ContactOfferSettings({ offer, busy, onSave }: ContactOfferSettingsProps) {
  const { showSuccess } = useNotifications();
  const [enabled, setEnabled] = useState(offer.enabled);
  const [price, setPrice] = useState(String(offer.price_rubles ?? ""));
  const [paymentDetails, setPaymentDetails] = useState(offer.payment_details ?? "");
  const [consent, setConsent] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const saved = await onSave({
      enabled,
      price_rubles: enabled ? Number(price) : undefined,
      payment_details: enabled ? paymentDetails || undefined : undefined,
      disclosure_consent: enabled ? consent : undefined,
    });
    if (!saved) return;
    setConsent(false);
    showSuccess("Настройки продажи контактов сохранены");
  };

  return (
    <section className={s.offerSection} aria-label="Продажа ваших контактов">
      <form className={s.offerForm} onSubmit={submit}>
        <ExpertContactOfferFields
          idPrefix="contacts-page"
          enabled={enabled}
          price={price}
          paymentDetails={paymentDetails}
          consent={consent}
          onEnabledChange={setEnabled}
          onPriceChange={setPrice}
          onPaymentDetailsChange={setPaymentDetails}
          onConsentChange={setConsent}
        />
        <div className={s.offerActions}>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={busy}
            disabled={enabled && !consent}
          >
            Сохранить настройки
          </Button>
        </div>
      </form>
    </section>
  );
}
