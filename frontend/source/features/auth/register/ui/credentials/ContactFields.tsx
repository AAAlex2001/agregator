import type { UseFormReturn } from "react-hook-form";
import { EmailInput, PhoneInput } from "@/source/shared/ui/Inputs";
import type { RegisterFormValues } from "../../model/schema";
import s from "./ContactFields.module.scss";

interface Props {
  form: UseFormReturn<RegisterFormValues>;
  onPhoneChange: (value: string) => void;
  showPhoneHint: boolean;
}

export function ContactFields({ form, onPhoneChange, showPhoneHint }: Props) {
  const { watch, setValue, formState } = form;
  const errors = formState.errors;
  const shouldValidate = formState.isSubmitted;

  return (
    <>
      <EmailInput
        id="email"
        value={watch("email")}
        autoComplete="off"
        onChange={(e) => setValue("email", e.target.value, { shouldValidate })}
        placeholder="Электронная почта"
        error={errors.email?.message}
      />

      <div className={s.phoneBlock}>
        <PhoneInput
          id="phone"
          value={watch("phone")}
          autoComplete="off"
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="+7-999-999-99-12"
          error={errors.phone?.message}
        />
        {showPhoneHint && <p className={s.contactHint}>Номер телефона необязателен</p>}
      </div>
    </>
  );
}
