import cn from "classnames";
import { CheckIcon } from "@/shared/ui/icons/interface";
import { PASSWORD_RULES } from "../../model/password-rules";
import s from "./password-rules.module.scss";

export function PasswordRules({ password }: { password: string }) {
  return (
    <ul className={s.rules}>
      {PASSWORD_RULES.map((rule) => (
        <li key={rule.label} className={cn(s.rule, { [s.ok]: password !== "" && rule.test(password) })}>
          <CheckIcon width={13} height={13} className={s.icon} />
          {rule.label}
        </li>
      ))}
    </ul>
  );
}
