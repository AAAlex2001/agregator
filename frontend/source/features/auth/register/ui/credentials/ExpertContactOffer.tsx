import type { UseFormReturn } from "react-hook-form";
import { ExpertContactOfferFields } from "@/source/entities/expert-contact";
import type { RegisterFormValues } from "../../model/schema";

interface Props {
  form: UseFormReturn<RegisterFormValues>;
}

export function ExpertContactOffer({ form }: Props) {
  const { watch, setValue, formState } = form;
  const errors = formState.errors;
  const shouldValidate = formState.isSubmitted;

  return (
    <ExpertContactOfferFields
      idPrefix="registration"
      enabled={watch("contactSalesEnabled")}
      price={watch("contactPriceRubles")}
      paymentDetails={watch("contactPaymentDetails")}
      consent={watch("contactDisclosureConsent")}
      priceError={errors.contactPriceRubles?.message}
      paymentDetailsError={errors.contactPaymentDetails?.message}
      consentError={errors.contactDisclosureConsent?.message}
      onEnabledChange={(value) => setValue("contactSalesEnabled", value, { shouldValidate })}
      onPriceChange={(value) => setValue("contactPriceRubles", value, { shouldValidate })}
      onPaymentDetailsChange={(value) => setValue("contactPaymentDetails", value, { shouldValidate })}
      onConsentChange={(value) => setValue("contactDisclosureConsent", value, { shouldValidate })}
    />
  );
}
