import { RoleBadge } from "@/entities/user";
import type { UserRole } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import styles from "./style.module.scss";

interface RoleChoiceProps {
  roles: UserRole[];
  isSubmitting: boolean;
  onChoose: (role: UserRole) => void;
  onCancel: () => void;
}

/** Предлагает роли, доступные для введённых данных входа. */
export function RoleChoice({
  roles,
  isSubmitting,
  onChoose,
  onCancel,
}: RoleChoiceProps) {
  return (
    <div className={styles.choice}>
      <h2 className={styles.title}>Под какой ролью войти?</h2>
      <p className={styles.subtitle}>
        На эти данные зарегистрировано несколько аккаунтов.
      </p>

      <div className={styles.list}>
        {roles.map((role) => (
          <button
            key={role}
            type="button"
            className={styles.option}
            disabled={isSubmitting}
            onClick={() => onChoose(role)}
          >
            <RoleBadge role={role} />
          </button>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        fullWidth
        disabled={isSubmitting}
        onClick={onCancel}
      >
        Назад
      </Button>
    </div>
  );
}
