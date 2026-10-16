import cn from "classnames";
import { CustomerIcon, DiplomaIcon, ExpertIcon } from "@/shared/ui/icons";
import { toUserRole } from "../../model/role";
import styles from "./style.module.scss";

/** Роль аккаунта и дополнительный класс места размещения. */
interface RoleBadgeProps {
  role: string | null | undefined;
  className?: string;
}

/** Подпись, цвет и значок для каждой роли аккаунта в интерфейсе. */
const ROLE_BADGES = {
  CUSTOMER: {
    label: "Вы — заказчик",
    tone: "blue",
    Icon: CustomerIcon,
  },
  EXPERT: {
    label: "Вы — исполнитель",
    tone: "orange",
    Icon: ExpertIcon,
  },
  LICENSE_HOLDER: {
    label: "Вы — держатель разрешительных документов",
    tone: "green",
    Icon: DiplomaIcon,
  },
};

/** Показывает название и значок роли пользователя. */
export function RoleBadge({ role, className }: RoleBadgeProps) {
  const userRole = toUserRole(role);

  if (!userRole) {
    return null;
  }

  const { label, tone, Icon } = ROLE_BADGES[userRole];

  return (
    <span className={cn(styles.badge, styles[tone], className)}>
      <Icon
        size={20}
        className={styles.icon}
      />
      <span className={styles.label}>{label}</span>
    </span>
  );
}
