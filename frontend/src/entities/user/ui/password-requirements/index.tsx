import cn from "classnames";
import { PASSWORD_RULES } from "../../config/password";
import styles from "./style.module.scss";

/** Введённый пароль, по которому отмечаются выполненные требования. */
interface PasswordRequirementsProps {
  password: string;
}

/** Подсвечивает требования к паролю по мере его ввода. */
export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  return (
    <ul className={styles.list}>
      {PASSWORD_RULES.map((rule) => (
        <li
          key={rule.label}
          className={cn(styles.rule, { [styles.met]: rule.test(password) })}
        >
          {rule.label}
        </li>
      ))}
    </ul>
  );
}
