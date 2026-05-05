import Link from "next/link";
import type { UseFormReturn } from "react-hook-form";
import Button from "@/source/shared/ui/Button";
import Input from "@/source/shared/ui/Input";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import { Checkbox } from "@/source/shared/ui";
import { PartySuggestInput, type PartySuggestion } from "@/source/features/party-suggest";
import type { RegisterFormValues } from "../model/schema";
import s from "./CredentialsStep.module.scss";

interface Props {
  form: UseFormReturn<RegisterFormValues>;
  selectedRole: number | null;
  isLoading: boolean;
  onPhoneChange: (v: string) => void;
  onSubmit: () => void;
}

export function CredentialsStep({ form, selectedRole, isLoading, onPhoneChange, onSubmit }: Props) {
  const { watch, setValue, formState } = form;
  const isExpert = selectedRole === 2;
  const isCustomer = selectedRole === 1;
  const password = watch("password");
  const agreePrivacy = watch("agreePrivacy");
  const agreeTerms = watch("agreeTerms");

  const shouldValidate = formState.isSubmitted;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className={s.stepContent}>
      <form onSubmit={handleSubmit} className={s.form} autoComplete="off" data-lpignore="true" data-1p-ignore="true">
        <AutofillGuard idPrefix="register" />

        {isExpert && (
          <>
            <Input
              id="lastName"
              variant="text"
              value={watch("lastName")}
              autoComplete="off"
              onChange={(e) => setValue("lastName", e.target.value, { shouldValidate })}
              placeholder="Фамилия"
              error={formState.errors.lastName?.message}
            />
            <Input
              id="firstName"
              variant="text"
              value={watch("firstName")}
              autoComplete="off"
              onChange={(e) => setValue("firstName", e.target.value, { shouldValidate })}
              placeholder="Имя"
              error={formState.errors.firstName?.message}
            />
          </>
        )}

        {isCustomer && (
          <PartySuggestInput
            value={watch("companyName")}
            onChange={(query: string, picked: PartySuggestion | null) => {
              setValue("companyName", picked?.value ?? query, { shouldValidate });
              setValue("companyData", picked, { shouldValidate });
            }}
            placeholder="ИНН или название компании"
            error={formState.errors.companyName?.message as string | undefined}
          />
        )}

        <Input
          id="email"
          type="email"
          variant="email"
          value={watch("email")}
          autoComplete="off"
          onChange={(e) => setValue("email", e.target.value, { shouldValidate })}
          placeholder="Электронная почта"
          error={formState.errors.email?.message}
        />

        <div className={s.phoneBlock}>
          <Input
            id="phone"
            type="tel"
            variant="phone"
            value={watch("phone")}
            autoComplete="off"
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="+7-999-999-99-12"
            error={formState.errors.phone?.message}
          />
          <p className={s.contactHint}>Номер телефона необязателен</p>
        </div>

        <Input
          id="password"
          variant="password"
          value={watch("password")}
          autoComplete="new-password"
          onChange={(e) => setValue("password", e.target.value, { shouldValidate })}
          placeholder="Пароль"
          error={formState.errors.password?.message}
        />

        <Input
          id="repeatPassword"
          variant="password"
          value={watch("repeatPassword")}
          autoComplete="new-password"
          onChange={(e) => setValue("repeatPassword", e.target.value, { shouldValidate })}
          placeholder="Повторите пароль"
          error={formState.errors.repeatPassword?.message}
        />

        <ul className={`${s.passwordRequirements} ${s.fullRow}`}>
          <li className={password.length >= 6 ? s.requirementMet : ""}>Не менее 6 символов</li>
          <li className={/[A-Z]/.test(password) ? s.requirementMet : ""}>Хотя бы одна заглавная буква (A-Z)</li>
          <li className={/[a-z]/.test(password) ? s.requirementMet : ""}>Хотя бы одна строчная буква (a-z)</li>
          <li className={password.length > 0 && /^[A-Za-z0-9!@#$%^&*()\-_+=\[\]{}|;:'",.<>?/`~ ]+$/.test(password) ? s.requirementMet : ""}>
            Только латинские буквы, цифры и спецсимволы
          </li>
        </ul>

        <div className={`${s.agreements} ${s.fullRow}`}>
          <Checkbox
            id="agreePrivacy"
            checked={agreePrivacy}
            onChange={(checked) => setValue("agreePrivacy", checked, { shouldValidate })}
            error={formState.errors.agreePrivacy?.message}
          >
            Я соглашаюсь с{" "}
            <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className={s.agreementLink}>
              Политикой конфиденциальности
            </Link>
          </Checkbox>
          <Checkbox
            id="agreeTerms"
            checked={agreeTerms}
            onChange={(checked) => setValue("agreeTerms", checked, { shouldValidate })}
            error={formState.errors.agreeTerms?.message}
          >
            Я соглашаюсь с{" "}
            <Link href="/user-agreement" target="_blank" rel="noopener noreferrer" className={s.agreementLink}>
              Пользовательским соглашением
            </Link>
          </Checkbox>
        </div>

        <Button type="submit" variant="chat" size="lg" fullWidth isLoading={isLoading} className={s.fullRow}>
          Зарегистрироваться
        </Button>
      </form>
    </div>
  );
}
