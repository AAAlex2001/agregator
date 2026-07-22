import { Checkbox, TextInput, Title, Subtitle } from "@/source/shared/ui";
import s from "./ExpertContactOfferFields.module.scss";

interface ExpertContactOfferFieldsProps {
  idPrefix: string;
  enabled: boolean;
  price: string;
  paymentDetails: string;
  consent: boolean;
  priceError?: string;
  paymentDetailsError?: string;
  consentError?: string;
  onEnabledChange: (value: boolean) => void;
  onPriceChange: (value: string) => void;
  onPaymentDetailsChange: (value: string) => void;
  onConsentChange: (value: boolean) => void;
}

export function ExpertContactOfferFields({
  idPrefix,
  enabled,
  price,
  paymentDetails,
  consent,
  priceError,
  paymentDetailsError,
  consentError,
  onEnabledChange,
  onPriceChange,
  onPaymentDetailsChange,
  onConsentChange,
}: ExpertContactOfferFieldsProps) {
  return (
    <section className={s.section} aria-label="Платный доступ к контактам">
      <div className={s.intro}>
        <div>
          <Title text="Платный доступ к контактам" as="h2" className={s.title} />
          <Subtitle
            text="Телефон и email будут скрыты до подтверждения оплаты по установленной вами цене"
            className={s.subtitle}
          />
        </div>
        <Checkbox
          id={`${idPrefix}-contact-sales-enabled`}
          checked={enabled}
          onChange={onEnabledChange}
        >
          Готов предоставлять контакты за плату
        </Checkbox>
      </div>

      {enabled && (
        <div className={s.fields}>
          <label className={s.field}>
            <span>Стоимость доступа, ₽</span>
            <TextInput
              inputMode="numeric"
              value={price}
              onChange={(event) => onPriceChange(event.target.value)}
              error={priceError}
              required
            />
          </label>

          <label className={s.field}>
            <span>Реквизиты для прямого перевода</span>
            <textarea
              value={paymentDetails}
              onChange={(event) => onPaymentDetailsChange(event.target.value)}
              placeholder="Например: номер карты или банковские реквизиты"
              maxLength={1000}
              aria-invalid={Boolean(paymentDetailsError)}
              required
            />
            {paymentDetailsError && <span className={s.error}>{paymentDetailsError}</span>}
          </label>

          <p className={s.warning}>
            При оплате по СБП не указывайте номер телефона, который планируете передать покупателю контакта
          </p>

          <Checkbox
            id={`${idPrefix}-contact-disclosure-consent`}
            checked={consent}
            onChange={onConsentChange}
            error={consentError}
          >
            Согласен передать телефон и email покупателю после подтверждения оплаты
          </Checkbox>
        </div>
      )}
    </section>
  );
}
