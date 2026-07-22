"use client";

import { useEffect, useState } from "react";
import {
  ExpertContactOfferFields,
  fetchContactOffer,
  updateContactOffer,
  type ExpertContactOfferData,
} from "@/source/entities/expert-contact";
import { Button, Loader } from "@/source/shared/ui";
import { useNotifications } from "@/source/shared/ui/Notifications";
import s from "./ExpertContactOfferSection.module.scss";

export function ExpertContactOfferSection() {
  const { showError, showSuccess } = useNotifications();
  const [offer, setOffer] = useState<ExpertContactOfferData | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [price, setPrice] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [consent, setConsent] = useState(false);
  const [saving, setSaving] = useState(false);
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

  const submit = async () => {
    setSaving(true);
    try {
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
      showSuccess("Настройки платного доступа сохранены");
    } catch (reason) {
      showError(reason instanceof Error ? reason.message : "Не удалось сохранить настройки контактов");
    } finally {
      setSaving(false);
    }
  };

  if (!offer) {
    return loadError
      ? <p className={s.error}>{loadError}</p>
      : <Loader size="sm" label="Загружаем настройки контактов" />;
  }

  return (
    <section className={s.form}>
      <ExpertContactOfferFields
        idPrefix="profile"
        enabled={enabled}
        price={price}
        paymentDetails={paymentDetails}
        consent={consent}
        onEnabledChange={setEnabled}
        onPriceChange={setPrice}
        onPaymentDetailsChange={setPaymentDetails}
        onConsentChange={setConsent}
      />
      <div className={s.actions}>
        <Button
          type="button"
          variant="primary"
          size="sm"
          isLoading={saving}
          disabled={enabled && (!consent || !price || !paymentDetails.trim())}
          onClick={() => void submit()}
        >
          Сохранить настройки контактов
        </Button>
      </div>
    </section>
  );
}
