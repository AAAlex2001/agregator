"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { ExpertContactOfferData } from "@/source/entities/expert-contact";
import { Button, Checkbox, TextInput, Title, Subtitle } from "@/source/shared/ui";
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

  useEffect(() => {
    setEnabled(offer.enabled);
    setPrice(String(offer.price_rubles ?? ""));
    setPaymentDetails(offer.payment_details ?? "");
  }, [offer]);

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
      <div className={s.offerIntro}>
        <div>
          <Title text="Продажа ваших контактов" as="h2" className={s.sectionTitle} />
          <Subtitle
            text="Укажите стоимость и реквизиты прямого перевода. Деньги поступают сразу вам"
            className={s.sectionSubtitle}
          />
        </div>
        <Checkbox id="contact-sales-enabled" checked={enabled} onChange={setEnabled}>
          {enabled ? "Доступ включён" : "Доступ выключен"}
        </Checkbox>
      </div>

      <form className={s.offerForm} onSubmit={submit}>
        {enabled && (
          <div className={s.offerFields}>
            <label className={s.fieldGroup}>
              <span>Стоимость доступа, ₽</span>
              <TextInput
                inputMode="numeric"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
              />
            </label>
            <label className={`${s.fieldGroup} ${s.paymentField}`}>
              <span>Реквизиты прямой оплаты</span>
              <textarea
                value={paymentDetails}
                onChange={(event) => setPaymentDetails(event.target.value)}
                placeholder="Например: перевод по СБП на номер +7..."
                maxLength={1000}
              />
            </label>
            <div className={s.consentRow}>
              <Checkbox
                id="contact-disclosure-consent"
                checked={consent}
                onChange={setConsent}
              >
                Согласен передать телефон и email покупателю после подтверждения оплаты
              </Checkbox>
            </div>
          </div>
        )}
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
