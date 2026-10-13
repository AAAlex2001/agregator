import type { UserRole } from "@/source/entities/user";
import Button from "@/source/shared/ui/Button";
import { RoleBadge } from "@/source/shared/ui";
import s from "./RoleChoice.module.scss";

interface RoleChoiceProps {
  roles: UserRole[];
  isSubmitting: boolean;
  onChoose: (role: UserRole) => void;
  onCancel: () => void;
}

/** Выбор роли, когда на одну почту зарегистрировано несколько аккаунтов. */
export function RoleChoice({ roles, isSubmitting, onChoose, onCancel }: RoleChoiceProps) {
  return (
    <div className={s.choice}>
      <h2 className={s.title}>Под какой ролью войти?</h2>
      <p className={s.subtitle}>На эти данные зарегистрировано несколько аккаунтов.</p>

      <div className={s.list}>
        {roles.map((role) => (
          <button key={role} type="button" className={s.option} disabled={isSubmitting} onClick={() => onChoose(role)}>
            <RoleBadge role={role} />
          </button>
        ))}
      </div>

      <Button type="button" variant="outline" fullWidth disabled={isSubmitting} onClick={onCancel}>
        Назад
      </Button>
    </div>
  );
}
