import { ExpertContactOfferFields } from "@/entities/expert-contact";
import type { ContactOfferFields as ContactOfferValues } from "@/entities/expert-contact";
import { FormSection } from "@/shared/ui/form-section";

/** Условия платного раскрытия контактов, заполняемые при регистрации. */
interface ContactOfferFieldsProps {
  value: ContactOfferValues;
  onChange: (value: ContactOfferValues) => void;
}

/** Добавляет общие поля платных контактов в раскрываемый раздел регистрации. */
export function ContactOfferFields({ value, onChange }: ContactOfferFieldsProps) {
  return (
    <FormSection
      title="Платный доступ к контактам"
      hint="Телефон и email будут скрыты до подтверждения оплаты по установленной вами цене"
      collapsible
    >
      <ExpertContactOfferFields
        idPrefix="registration"
        withHeading={false}
        value={value}
        onChange={onChange}
      />
    </FormSection>
  );
}
