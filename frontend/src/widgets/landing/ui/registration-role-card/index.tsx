import type { DirectionCode } from "@/entities/direction";
import type { UserRole } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import type { ServiceRole } from "../../model/types";
import styles from "./style.module.scss";

/** Описание роли и действие открытия регистрации в приложении. */
interface RegistrationRoleCardProps {
  role: ServiceRole;
  onRegister: (role: UserRole, direction?: DirectionCode) => void;
}

/** Возвращает единый заголовок карточки регистрации для выбранной роли. */
function getRoleTitle(role: UserRole): string {
  if (role === "CUSTOMER") {
    return "Заказчик";
  }

  if (role === "EXPERT") {
    return "Исполнитель";
  }

  return "Держатель разрешительных документов";
}

/** Показывает условия выбранной роли и передаёт её в форму регистрации. */
export function RegistrationRoleCard({
  role,
  onRegister,
}: RegistrationRoleCardProps) {
  /** Открывает регистрацию с ролью и направлением этой карточки. */
  function register() {
    onRegister(role.role, role.direction);
  }

  return (
    <li className={styles.card}>
      <h3 className={styles.cardTitle}>{getRoleTitle(role.role)}</h3>
      <p className={styles.cardSubtitle}>{role.subtitle}</p>
      <p className={styles.cardText}>{role.description}</p>
      <ul className={styles.fields}>
        {role.fields.map((field) => (
          <li key={field}>{field}</li>
        ))}
      </ul>
      <Button
        variant="primary"
        fullWidth
        className={styles.cardButton}
        onClick={register}
      >
        Выбрать
      </Button>
    </li>
  );
}
