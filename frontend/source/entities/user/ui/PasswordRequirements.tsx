import cn from "classnames";
import { PASSWORD_RULES } from "../model/password";
import s from "./PasswordRequirements.module.scss";

interface PasswordRequirementsProps {
  password: string;
}

/** Список требований к паролю: выполненные подсвечиваются зелёной галочкой. */
export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  return (
    <ul className={s.list}>
      {PASSWORD_RULES.map((rule) => (
        <li key={rule.label} className={cn(s.rule, { [s.met]: rule.test(password) })}>
          {rule.label}
        </li>
      ))}
    </ul>
  );
}
