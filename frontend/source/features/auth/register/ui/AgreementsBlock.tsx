import Link from "next/link";
import { Checkbox } from "@/source/shared/ui";
import type { ConsentKey } from "../model/types";
import type { StepProps } from "./types";
import s from "./AgreementsBlock.module.scss";

const AGREEMENTS: { key: ConsentKey; prefix: string; href: string; label: string }[] = [
  { key: "privacy", prefix: "Я соглашаюсь с", href: "/privacy-policy", label: "Политикой конфиденциальности" },
  { key: "terms", prefix: "Я соглашаюсь с", href: "/user-agreement", label: "Пользовательским соглашением" },
  {
    key: "personal",
    prefix: "Я даю",
    href: "/personal-data-consent",
    label: "Согласие на обработку персональных данных",
  },
];

/** Три обязательных согласия со ссылками на документы. */
export function AgreementsBlock({ state, dispatch }: StepProps) {
  return (
    <div className={s.agreements}>
      {AGREEMENTS.map((item) => (
        <Checkbox
          key={item.key}
          id={`register-consent-${item.key}`}
          required
          checked={state.consents[item.key]}
          onChange={(value) => dispatch({ type: "consent", key: item.key, value })}
        >
          {item.prefix}{" "}
          <Link href={item.href} target="_blank" rel="noopener noreferrer" className={s.link}>
            {item.label}
          </Link>
        </Checkbox>
      ))}
    </div>
  );
}
