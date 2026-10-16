"use client";

import { useId } from "react";
import { RadioGroup } from "@/shared/ui/radio-group";
import { TextInput } from "@/shared/ui/text-input";
import { RENTAL_PRICE_OPTIONS } from "../../config/rental-pricing";
import type { LicenseRentalKind } from "../../model/types";
import styles from "./style.module.scss";

/** Выбранный способ оплаты, суммы, их ошибки и обработчики изменений. */
interface RentalPriceFieldProps {
  kind: LicenseRentalKind;
  percent: string;
  fixedAmount: string;
  name?: string;
  legend?: string;
  errors?: { percent?: string; fixedAmount?: string };
  onChangeKind: (kind: LicenseRentalKind) => void;
  onChangePercent: (value: string) => void;
  onChangeFixed: (value: string) => void;
}

/** Условия предоставления лицензии: процент, фиксированная цена или договорённость. */
export function RentalPriceField({
  kind,
  percent,
  fixedAmount,
  name = "rentalKind",
  legend = "Стоимость предоставления лицензии",
  errors,
  onChangeKind,
  onChangePercent,
  onChangeFixed,
}: RentalPriceFieldProps) {
  const inputId = useId();

  return (
    <div className={styles.wrap}>
      <RadioGroup
        name={name}
        value={kind}
        options={RENTAL_PRICE_OPTIONS}
        legend={legend}
        onChange={(value) => {
          if (value === "PERCENT" || value === "FIXED" || value === "NEGOTIABLE") {
            onChangeKind(value);
          }
        }}
      />

      {kind === "PERCENT" && (
        <div className={styles.amount}>
          <TextInput
            id={inputId}
            inputMode="numeric"
            value={percent}
            autoComplete="off"
            placeholder="Например, 5"
            suffix="%"
            error={errors?.percent}
            onChange={(event) => onChangePercent(event.target.value)}
          />
        </div>
      )}

      {kind === "FIXED" && (
        <div className={styles.amount}>
          <TextInput
            id={inputId}
            inputMode="numeric"
            value={fixedAmount}
            autoComplete="off"
            placeholder="Например, 50 000"
            suffix="₽"
            error={errors?.fixedAmount}
            onChange={(event) => onChangeFixed(event.target.value)}
          />
        </div>
      )}
    </div>
  );
}
