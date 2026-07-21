"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { ExpertContactOfferData } from "@/source/entities/expert-contact";
import { Button, TextInput } from "@/source/shared/ui";
import s from "./ExpertContacts.module.scss";

interface ContactOfferSettingsProps {
  offer: ExpertContactOfferData;
  busy: boolean;
  onSave: (payload: {
    enabled: boolean;
    price_rubles?: number;
    payment_details?: string;
    disclosure_consent?: boolean;
  }) => Promise<void>;
}

export function ContactOfferSettings({ offer, busy, onSave }: ContactOfferSettingsProps) {
  const [enabled, setEnabled] = useState(offer.enabled);
  const [price, setPrice] = useState(String(offer.price_rubles ?? ""));
  const [paymentDetails, setPaymentDetails] = useState("");
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    setEnabled(offer.enabled);
    setPrice(String(offer.price_rubles ?? ""));
  }, [offer]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await onSave({
      enabled,
      price_rubles: enabled ? Number(price) : undefined,
      payment_details: enabled ? paymentDetails || undefined : undefined,
      disclosure_consent: enabled ? consent : undefined,
    });
    setPaymentDetails("");
    setConsent(false);
  };

  return (
    <section className={s.offerSection} aria-labelledby="contact-offer-title">
      <div className={s.offerIntro}>
        <div>
          <h2 id="contact-offer-title">Продажа ваших контактов</h2>
          <p>Установите цену и реквизиты прямого перевода. Площадка деньги не принимает.</p>
        </div>
        <label className={s.switchLabel}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(event) => setEnabled(event.target.checked)}
          />
          <span>{enabled ? "Доступ включён" : "Доступ выключен"}</span>
        </label>
      </div>

      <form className={s.offerForm} onSubmit={submit}>
        {enabled && (
          <>
            <label>
              <span>Стоимость доступа, ₽</span>
              <TextInput
                inputMode="numeric"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
              />
            </label>
            <label className={s.paymentField}>
              <span>Реквизиты прямой оплаты</span>
              <textarea
                value={paymentDetails}
                onChange={(event) => setPaymentDetails(event.target.value)}
                placeholder={
                  offer.has_payment_details
                    ? "Оставьте пустым, чтобы сохранить текущие реквизиты"
                    : "Например: перевод по СБП на номер +7..."
                }
                maxLength={1000}
              />
            </label>
            <label className={s.consentRow}>
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                required
              />
              <span>Согласен передать телефон и email покупателю после подтверждения оплаты</span>
            </label>
          </>
        )}
        <Button type="submit" variant="primary" size="sm" isLoading={busy}>
          Сохранить настройки
        </Button>
      </form>
    </section>
  );
}
