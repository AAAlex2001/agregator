"use client";

import { TextInput } from "@/source/shared/ui/Inputs";
import { RadioGroup, type RadioOption } from "@/source/shared/ui/RadioGroup";
import type { LicenseRentalKind } from "@/source/entities/user";
import s from "./RentalPriceField.module.scss";

interface Props {
  kind: LicenseRentalKind;
  percent: string;
  fixedAmount: string;
  errors?: { percent?: string; fixedAmount?: string };
  onChangeKind: (next: LicenseRentalKind) => void;
  onChangePercent: (value: string) => void;
  onChangeFixed: (value: string) => void;
}

const OPTIONS: RadioOption<LicenseRentalKind>[] = [
  {
    value: "PERCENT",
    label: "От суммы договора",
    description: "Указываете процент, который удерживаете с каждой сделки",
  },
  {
    value: "FIXED",
    label: "Фиксированная цена",
    description: "Минимальная стоимость аренды за один договор",
  },
  {
    value: "NEGOTIABLE",
    label: "Договорная",
    description: "Стоимость обсуждается с заказчиком в чате",
  },
];

export function RentalPriceField({
  kind,
  percent,
  fixedAmount,
  errors,
  onChangeKind,
  onChangePercent,
  onChangeFixed,
}: Props) {
  return (
    <div className={s.wrap}>
      <RadioGroup
        name="rentalKind"
        value={kind}
        options={OPTIONS}
        onChange={onChangeKind}
        legend="Стоимость аренды лицензии"
      />

      {kind === "PERCENT" && (
        <div className={s.amount}>
          <TextInput
            id="rentalPercent"
            inputMode="numeric"
            value={percent}
            autoComplete="off"
            onChange={(e) => onChangePercent(e.target.value)}
            placeholder="Например, 5"
            error={errors?.percent}
            suffix="%"
          />
        </div>
      )}

      {kind === "FIXED" && (
        <div className={s.amount}>
          <TextInput
            id="rentalFixedAmount"
            inputMode="numeric"
            value={fixedAmount}
            autoComplete="off"
            onChange={(e) => onChangeFixed(e.target.value)}
            placeholder="Например, 50 000"
            error={errors?.fixedAmount}
            suffix="₽"
          />
        </div>
      )}
    </div>
  );
}
