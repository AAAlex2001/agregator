import type { BlitzTariff } from "@/entities/blitz-order";
import { formatRub } from "@/shared/lib/format-rub";
import { Field } from "@/shared/ui/field";
import { FormSection } from "@/shared/ui/form-section";
import { TextInput } from "@/shared/ui/text-input";
import { parsePrice } from "../../model/payload";
import styles from "./style.module.scss";

/** Как устроена оплата. */
const PRICE_HINT = "Эксперт возьмёт заявку, если согласен с ценой. "
  + "Аванс 50 % — после договора, остаток — когда заключение готово";

/** Цена из поля, тариф по выбранной паре и изменение цены. */
interface PriceSectionProps {
  price: string;
  tariff: BlitzTariff | undefined;
  onChange: (value: string) => void;
}

/** Цена заказчика с подсказкой тарифа и суммой аванса. */
export function PriceSection({ price, tariff, onChange }: PriceSectionProps) {
  const amount = parsePrice(price);
  const advance = Math.round(amount * 50) / 100;

  return (
    <FormSection
      title="Цена"
      hint={PRICE_HINT}
    >
      <Field label="Ваша цена за экспертизу, ₽">
        <TextInput
          value={price}
          inputMode="decimal"
          placeholder="Например, 45 000"
          onChange={(event) => onChange(event.target.value)}
        />
      </Field>
      <div className={styles.notes}>
        {tariff && (
          <button
            type="button"
            className={styles.tariff}
            onClick={() => onChange(String(tariff.price))}
          >
            Ориентир по тарифу: {formatRub(tariff.price)} — подставить
          </button>
        )}
        {amount > 0 && <span className={styles.advance}>Аванс: {formatRub(advance)}</span>}
      </div>
    </FormSection>
  );
}
