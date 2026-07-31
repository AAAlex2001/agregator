import Link from "next/link";
import type { UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/source/shared/ui";
import type { RegisterFormValues } from "../../model/schema";
import s from "./AgreementsFields.module.scss";

interface Props {
  form: UseFormReturn<RegisterFormValues>;
}

export function AgreementsFields({ form }: Props) {
  const { watch, setValue, formState } = form;
  const errors = formState.errors;
  const shouldValidate = formState.isSubmitted;

  return (
    <div className={s.agreements}>
      <Checkbox
        id="agreePrivacy"
        checked={watch("agreePrivacy")}
        onChange={(checked) => setValue("agreePrivacy", checked, { shouldValidate })}
        error={errors.agreePrivacy?.message}
      >
        Я соглашаюсь с{" "}
        <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className={s.link}>
          Политикой конфиденциальности
        </Link>
      </Checkbox>
      <Checkbox
        id="agreeTerms"
        checked={watch("agreeTerms")}
        onChange={(checked) => setValue("agreeTerms", checked, { shouldValidate })}
        error={errors.agreeTerms?.message}
      >
        Я соглашаюсь с{" "}
        <Link href="/user-agreement" target="_blank" rel="noopener noreferrer" className={s.link}>
          Пользовательским соглашением
        </Link>
      </Checkbox>
      <Checkbox
        id="agreeConsent"
        checked={watch("agreeConsent")}
        onChange={(checked) => setValue("agreeConsent", checked, { shouldValidate })}
        error={errors.agreeConsent?.message}
      >
        Я даю{" "}
        <Link href="/personal-data-consent" target="_blank" rel="noopener noreferrer" className={s.link}>
          Согласие на обработку персональных данных
        </Link>
      </Checkbox>
    </div>
  );
}
