import Link from "next/link";
import { Checkbox } from "@/source/shared/ui";
import type { StepProps } from "./types";
import s from "./register-form.module.scss";

export function AgreementsBlock({ state, dispatch }: StepProps) {
  return (
    <div className={s.agreements}>
      <Checkbox
        id="agreePrivacy"
        required
        checked={state.consents.privacy}
        onChange={(value) => dispatch({ type: "consent", key: "privacy", value })}
      >
        Я соглашаюсь с{" "}
        <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className={s.link}>
          Политикой конфиденциальности
        </Link>
      </Checkbox>
      <Checkbox
        id="agreeTerms"
        required
        checked={state.consents.terms}
        onChange={(value) => dispatch({ type: "consent", key: "terms", value })}
      >
        Я соглашаюсь с{" "}
        <Link href="/user-agreement" target="_blank" rel="noopener noreferrer" className={s.link}>
          Пользовательским соглашением
        </Link>
      </Checkbox>
      <Checkbox
        id="agreeConsent"
        required
        checked={state.consents.personal}
        onChange={(value) => dispatch({ type: "consent", key: "personal", value })}
      >
        Я даю{" "}
        <Link href="/personal-data-consent" target="_blank" rel="noopener noreferrer" className={s.link}>
          Согласие на обработку персональных данных
        </Link>
      </Checkbox>
    </div>
  );
}
