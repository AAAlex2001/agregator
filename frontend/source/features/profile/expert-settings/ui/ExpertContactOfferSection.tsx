"use client";

import { useEffect, useState } from "react";
import {
  ExpertContactOfferFields,
  fetchContactOffer,
  updateContactOffer,
  type ExpertContactOfferData,
} from "@/source/entities/expert-contact";
import { Loader } from "@/source/shared/ui";
import { useRegisterProfileSave } from "@/source/entities/user";
import s from "./ExpertContactOfferSection.module.scss";

export function ExpertContactOfferSection() {
  const [offer, setOffer] = useState<ExpertContactOfferData | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [price, setPrice] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [consent, setConsent] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const current = await fetchContactOffer();
        setOffer(current);
        setEnabled(current.enabled);
        setPrice(String(current.price_rubles ?? ""));
        setPaymentDetails(current.payment_details ?? "");
      } catch (reason) {
        setLoadError(
          reason instanceof Error ? reason.message : "Не удалось загрузить настройки контактов",
        );
      }
    };
    void load();
  }, []);

  useRegisterProfileSave(async () => {
    if (!isDirty) return;
    if (enabled) {
      if (!price || !paymentDetails.trim()) {
        throw new Error("Укажите стоимость и реквизиты для платного доступа к контактам");
      }
      if (!consent) {
        throw new Error("Подтвердите согласие на передачу контактов после оплаты");
      }
    }
    const updated = await updateContactOffer({
      enabled,
      price_rubles: enabled ? Number(price) : undefined,
      payment_details: enabled ? paymentDetails.trim() : undefined,
      disclosure_consent: enabled ? consent : undefined,
    });
    setOffer(updated);
    setEnabled(updated.enabled);
    setPrice(String(updated.price_rubles ?? ""));
    setPaymentDetails(updated.payment_details ?? "");
    setConsent(false);
    setIsDirty(false);
  });

  if (!offer) {
    return loadError
      ? <p className={s.error}>{loadError}</p>
      : <Loader size="sm" label="Загружаем настройки контактов" />;
  }

  const change = <Value,>(setter: (value: Value) => void) => (value: Value) => {
    setter(value);
    setIsDirty(true);
  };

  return (
    <ExpertContactOfferFields
      idPrefix="profile"
      withHeading={false}
      enabled={enabled}
      price={price}
      paymentDetails={paymentDetails}
      consent={consent}
      onEnabledChange={change(setEnabled)}
      onPriceChange={change(setPrice)}
      onPaymentDetailsChange={change(setPaymentDetails)}
      onConsentChange={change(setConsent)}
    />
  );
}
