"use client";

import { TextInput } from "@/source/shared/ui/Inputs";
import { RadioGroup } from "@/source/shared/ui/RadioGroup";
import { RentalPriceField } from "@/source/shared/ui";
import { YesNoField } from "@/source/shared/ui/YesNoField";
import { NOPRIZ_SRO_REGISTRY_URL } from "@/source/shared/config/externalLinks";
import { DESIGN_LIABILITY_LEVELS, type DesignHolderProfile } from "../model/types";
import s from "../../shared/ui/fields.module.scss";

interface Props {
  value: DesignHolderProfile;
  onChange: (value: DesignHolderProfile) => void;
}

export function DesignHolderProfileFields({ value, onChange }: Props) {
  return (
    <div className={s.form}>
      <label className={s.field}>
        <span className={s.label}>Наименование СРО проектировщиков</span>
        <TextInput
          value={value.sro_name}
          onChange={(event) => onChange({ ...value, sro_name: event.target.value })}
          placeholder="Полное наименование саморегулируемой организации"
        />
      </label>

      <div className={s.field}>
        <span className={s.label}>Номер в реестре членов СРО</span>
        <TextInput
          value={value.sro_registry_number}
          onChange={(event) => onChange({ ...value, sro_registry_number: event.target.value })}
          placeholder="Регистрационный номер в реестре членов"
        />
        <a className={s.link} href={NOPRIZ_SRO_REGISTRY_URL} target="_blank" rel="noopener noreferrer">
          Проверить организацию в едином реестре НОПРИЗ
        </a>
      </div>

      <div className={s.field}>
        <span className={s.label}>
          Право подготовки проектной документации в отношении особо опасных, технически сложных и
          уникальных объектов капитального строительства (кроме объектов использования атомной
          энергии)
        </span>
        <YesNoField
          value={value.hazardous_objects_right}
          onChange={(next) => onChange({ ...value, hazardous_objects_right: next })}
        />
      </div>

      <div className={s.field}>
        <span className={s.label}>
          Право подготовки проектной документации в отношении объектов использования атомной энергии
        </span>
        <YesNoField
          value={value.nuclear_objects_right}
          onChange={(next) => onChange({ ...value, nuclear_objects_right: next })}
        />
      </div>

      <div className={s.field}>
        <span className={s.label}>Компенсационный фонд возмещения вреда — уровень ответственности</span>
        <RadioGroup
          name="design-liability-level"
          value={value.liability_level}
          options={[...DESIGN_LIABILITY_LEVELS]}
          onChange={(next) => onChange({ ...value, liability_level: next })}
        />
      </div>

      <div className={s.field}>
        <RentalPriceField
          kind={value.pricing_kind}
          percent={value.pricing_percent}
          fixedAmount={value.pricing_fixed_amount}
          name="design-pricing-kind"
          legend="Стоимость услуг"
          onChangeKind={(next) => onChange({ ...value, pricing_kind: next })}
          onChangePercent={(next) => onChange({ ...value, pricing_percent: next })}
          onChangeFixed={(next) => onChange({ ...value, pricing_fixed_amount: next })}
        />
      </div>
    </div>
  );
}
