"use client";

import { useAvailableRoles } from "@/entities/user";
import type { UserRole } from "@/entities/user";
import { CustomerIcon, DiplomaIcon, ExpertIcon } from "@/shared/ui/icons";
import { useSwitchRole } from "../../model/use-switch-role";
import type { SwitchRoleFormOptions } from "../../model/types";
import { SwitchRolePasswordModal } from "../switch-role-password-modal";
import styles from "./style.module.scss";

/** Возвращает подпись роли для приглашения войти в другой аккаунт. */
function roleLabel(role: UserRole): string {
  if (role === "CUSTOMER") {
    return "заказчик";
  }

  if (role === "EXPERT") {
    return "исполнитель";
  }

  return "держатель разрешительных документов";
}

/** Сохраняет значок роли из меню кабинета. */
function RoleIcon({ role }: { role: UserRole }) {
  if (role === "CUSTOMER") {
    return <CustomerIcon size={20} />;
  }

  if (role === "EXPERT") {
    return <ExpertIcon size={20} />;
  }

  return <DiplomaIcon size={20} />;
}

/** Показывает другие роли и окно ввода пароля выбранного аккаунта. */
export function RoleSwitcher(props: SwitchRoleFormOptions) {
  const roles = useAvailableRoles();
  const form = useSwitchRole(props);
  const { state } = form;

  return (
    <>
      {roles.length > 0 && (
        <div className={styles.section}>
          <span className={styles.heading}>Сменить роль</span>
          {roles.map((item) => (
            <button
              key={item.role}
              type="button"
              className={styles.item}
              disabled={state.isSubmitting || !item.email_verified}
              title={
                item.email_verified
                  ? undefined
                  : "Сначала подтвердите почту для этой роли"
              }
              onClick={() => form.selectRole(item)}
            >
              <span className={styles.icon}>
                <RoleIcon role={item.role} />
              </span>
              <span className={styles.label}>Войти как {roleLabel(item.role)}</span>
            </button>
          ))}
        </div>
      )}

      {state.selectedRole && (
        <SwitchRolePasswordModal
          role={state.selectedRole}
          password={state.password}
          error={state.error}
          isSubmitting={state.isSubmitting}
          canRetryProfile={form.canRetryProfile}
          onPasswordInput={form.setPasswordInput}
          onClose={form.cancel}
          onSubmit={form.submit}
        />
      )}
    </>
  );
}
