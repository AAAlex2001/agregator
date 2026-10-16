import { Button } from "@/shared/ui/button";
import type {
  RegistrationDirection,
  RegistrationRole,
} from "../../model/types";
import styles from "./style.module.scss";

/** Предложение регистрации для выбранной роли и направления. */
interface RegistrationOfferProps {
  role: RegistrationRole;
  direction: RegistrationDirection;
  onRegister: () => void;
}

/** Объясняет пользу направления для выбранного типа аккаунта. */
function getDescription(
  role: RegistrationRole,
  direction: RegistrationDirection,
): string {
  if (role.role === "CUSTOMER") {
    return direction.forCustomer;
  }

  if (role.role === "EXPERT") {
    return direction.forExpert;
  }

  return "Лицензия или членство СРО вашей организации может приносить доход: исполнители "
    + `направления «${direction.label}» используют ваши разрешительные документы `
    + "и платят за это по согласованным условиям.";
}

/** Показывает преимущества выбранной роли и кнопку открытия регистрации. */
export function RegistrationOffer({
  role,
  direction,
  onRegister,
}: RegistrationOfferProps) {
  return (
    <div className={styles.right}>
      <h2 className={styles.roleTitle}>
        {role.title}
      </h2>
      <p className={styles.roleText}>
        {getDescription(role, direction)}
      </p>
      <Button
        variant="primary"
        size="md"
        fullWidth
        showArrow
        className={styles.cta}
        onClick={onRegister}
      >
        {role.button}
      </Button>
    </div>
  );
}
