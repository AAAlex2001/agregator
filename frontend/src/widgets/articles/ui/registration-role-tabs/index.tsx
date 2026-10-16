import cn from "classnames";
import { REGISTRATION_ROLES } from "../../config/registration-roles";
import type { RegistrationRole } from "../../model/types";
import styles from "./style.module.scss";

/** Выбранная роль и событие переключения вкладки. */
interface RegistrationRoleTabsProps {
  selected: RegistrationRole;
  onChange: (role: RegistrationRole) => void;
}

/** Предлагает заказчику, исполнителю и держателю документов свою регистрацию. */
export function RegistrationRoleTabs({
  selected,
  onChange,
}: RegistrationRoleTabsProps) {
  return (
    <div
      className={styles.tabs}
      role="tablist"
      aria-label="Ваша роль"
    >
      {REGISTRATION_ROLES.map((option) => (
        <button
          key={option.role}
          type="button"
          role="tab"
          aria-selected={selected.role === option.role}
          className={cn(styles.tab, {
            [styles.tabActive]: selected.role === option.role,
          })}
          onClick={() => onChange(option)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
