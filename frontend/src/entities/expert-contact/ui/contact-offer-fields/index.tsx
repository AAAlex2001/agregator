import cn from "classnames";
import type { ChangeEvent } from "react";
import { Checkbox } from "@/shared/ui/checkbox";
import { Subtitle } from "@/shared/ui/subtitle";
import { TextInput } from "@/shared/ui/text-input";
import { Title } from "@/shared/ui/title";
import type { ContactOfferFields } from "../../model/types";
import styles from "./style.module.scss";

/** Поля доступа к контактам, их ошибки и необязательный заголовок блока. */
interface ExpertContactOfferFieldsProps {
  idPrefix: string;
  value: ContactOfferFields;
  onChange: (value: ContactOfferFields) => void;
  withHeading?: boolean;
  priceError?: string;
  paymentDetailsError?: string;
  consentError?: string;
}

/** Показывает цену, реквизиты и согласие для регистрации и настройки контактов. */
export function ExpertContactOfferFields({
  idPrefix,
  value,
  onChange,
  withHeading = true,
  priceError,
  paymentDetailsError,
  consentError,
}: ExpertContactOfferFieldsProps) {
  /** Включает или выключает платный доступ, сохраняя заполненные поля. */
  function changeEnabled(enabled: boolean) {
    onChange({
      ...value,
      enabled,
    });
  }

  /** Передаёт введённую стоимость без преобразования до сохранения. */
  function changePrice(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      price: event.target.value,
    });
  }

  /** Обновляет реквизиты для прямого перевода. */
  function changePaymentDetails(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange({
      ...value,
      paymentDetails: event.target.value,
    });
  }

  /** Обновляет согласие на передачу контактов после оплаты. */
  function changeConsent(consent: boolean) {
    onChange({
      ...value,
      consent,
    });
  }

  return (
    <section
      className={styles.section}
      aria-label="Платный доступ к контактам"
    >
      <div className={styles.intro}>
        {withHeading && (
          <div>
            <Title
              text="Платный доступ к контактам"
              as="h2"
              className={styles.title}
            />
            <Subtitle
              text="Телефон и email будут скрыты до подтверждения оплаты по установленной вами цене"
              className={styles.subtitle}
            />
          </div>
        )}
        <Checkbox
          id={`${idPrefix}-contact-sales-enabled`}
          checked={value.enabled}
          onChange={changeEnabled}
          className={styles.checkbox}
        >
          Готов предоставлять контакты за плату
        </Checkbox>
      </div>

      <div
        className={cn(styles.collapse, {
          [styles.collapseOpen]: value.enabled,
        })}
        aria-hidden={!value.enabled}
        inert={!value.enabled}
      >
        <fieldset
          className={styles.collapseInner}
          disabled={!value.enabled}
        >
          <div className={styles.fields}>
            <label className={styles.field}>
              <span>Стоимость доступа, ₽</span>
              <TextInput
                inputMode="numeric"
                value={value.price}
                onChange={changePrice}
                error={priceError}
                required
              />
            </label>

            <label className={styles.field}>
              <span>Реквизиты для прямого перевода</span>
              <textarea
                value={value.paymentDetails}
                onChange={changePaymentDetails}
                placeholder="Например: номер карты или банковские реквизиты"
                maxLength={1000}
                aria-invalid={Boolean(paymentDetailsError)}
                required
              />
              {paymentDetailsError && (
                <span className={styles.error}>{paymentDetailsError}</span>
              )}
            </label>

            <p className={styles.warning}>
              При оплате по СБП не указывайте номер телефона,
              который планируете передать покупателю контакта
            </p>

            <Checkbox
              id={`${idPrefix}-contact-disclosure-consent`}
              checked={value.consent}
              onChange={changeConsent}
              error={consentError}
              className={styles.checkbox}
            >
              Согласен передать телефон и email покупателю после подтверждения оплаты
            </Checkbox>
          </div>
        </fieldset>
      </div>
    </section>
  );
}
