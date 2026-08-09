import { FormSection } from "@/source/shared/ui";
import { ExpertContactOfferFields } from "@/source/entities/expert-contact";
import type { StepProps } from "./types";

export function ExpertContactBlock({ state, dispatch }: StepProps) {
  return (
    <FormSection
      title="Платный доступ к контактам"
      hint="Телефон и email будут скрыты до подтверждения оплаты по установленной вами цене"
      collapsible
    >
      <ExpertContactOfferFields
        idPrefix="registration"
        withHeading={false}
        enabled={state.contactEnabled}
        price={state.contactPrice}
        paymentDetails={state.contactDetails}
        consent={state.contactConsent}
        onEnabledChange={(value) => dispatch({ type: "contactEnabled", value })}
        onPriceChange={(value) => dispatch({ type: "set", key: "contactPrice", value })}
        onPaymentDetailsChange={(value) => dispatch({ type: "set", key: "contactDetails", value })}
        onConsentChange={(value) => dispatch({ type: "contactConsent", value })}
      />
    </FormSection>
  );
}
