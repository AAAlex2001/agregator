import { Checkbox } from "@/shared/ui";
import { openLink } from "@/shared/services/telegram";
import { type ConsentKey } from "../../model/reducer";
import { type StepProps } from "./types";
import s from "./consents.module.scss";

const SITE = "https://plus-resurs.com";

const CONSENTS: { key: ConsentKey; prefix: string; link: string; url: string }[] = [
  { key: "privacy", prefix: "Я соглашаюсь с ", link: "Политикой конфиденциальности", url: `${SITE}/privacy-policy` },
  { key: "terms", prefix: "Я соглашаюсь с ", link: "Пользовательским соглашением", url: `${SITE}/user-agreement` },
  {
    key: "personal",
    prefix: "Я даю ",
    link: "Согласие на обработку персональных данных",
    url: `${SITE}/personal-data-consent`,
  },
];

export function Consents({ state, dispatch }: StepProps) {
  return (
    <div className={s.wrap}>
      {CONSENTS.map((consent) => (
        <Checkbox
          key={consent.key}
          checked={state.consents[consent.key]}
          onChange={(value) => dispatch({ type: "consent", key: consent.key, value })}
        >
          {consent.prefix}
          <button
            type="button"
            className={s.link}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openLink(consent.url);
            }}
          >
            {consent.link}
          </button>
        </Checkbox>
      ))}
    </div>
  );
}
