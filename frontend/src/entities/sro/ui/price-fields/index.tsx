"use client";

import { useId } from "react";
import type { ChangeEvent } from "react";
import { RadioGroup } from "@/shared/ui/radio-group";
import { TextInput } from "@/shared/ui/text-input";
import { SRO_PRICE_OPTIONS } from "../../config/options";
import type { SroPricingKind } from "../../model/types";
import styles from "./style.module.scss";

/** Способ оплаты и редактируемая стоимость услуг члена СРО. */
interface PriceFieldsProps {
  name: string;
  kind: SroPricingKind;
  percent: string;
  fixedAmount: string;
  onKindChange: (kind: SroPricingKind) => void;
  onPercentChange: (percent: string) => void;
  onFixedAmountChange: (amount: string) => void;
}

/** Способ расчёта и стоимость услуг организации — члена СРО. */
export function PriceFields({
  name,
  kind,
  percent,
  fixedAmount,
  onKindChange,
  onPercentChange,
  onFixedAmountChange,
}: PriceFieldsProps) {
  const inputId = useId();

  /** Передаёт выбранный способ расчёта стоимости. */
  function changeKind(value: string) {
    if (value === "PERCENT" || value === "FIXED" || value === "NEGOTIABLE") {
      onKindChange(value);
    }
  }

  /** Передаёт введённый процент от суммы договора. */
  function changePercent(event: ChangeEvent<HTMLInputElement>) {
    onPercentChange(event.target.value);
  }

  /** Передаёт введённую фиксированную стоимость. */
  function changeFixedAmount(event: ChangeEvent<HTMLInputElement>) {
    onFixedAmountChange(event.target.value);
  }

  return (
    <div className={styles.wrap}>
      <RadioGroup
        name={name}
        value={kind}
        options={SRO_PRICE_OPTIONS}
        legend="Стоимость услуг"
        onChange={changeKind}
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
            onChange={changePercent}
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
            onChange={changeFixedAmount}
          />
        </div>
      )}
    </div>
  );
}
