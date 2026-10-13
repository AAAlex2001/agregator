"use client";

import type { UserRole } from "@/source/entities/user";
import { CustomerIcon, DiplomaIcon, ExpertIcon } from "@/source/shared/ui/icons";
import { useSwitchRole } from "../model/useSwitchRole";
import { SwitchRolePasswordModal } from "./SwitchRolePasswordModal";
import s from "./RoleSwitcher.module.scss";

const LABEL_BY_ROLE: Record<UserRole, string> = {
  CUSTOMER: "заказчик",
  EXPERT: "исполнитель",
  LICENSE_HOLDER: "держатель разрешительных документов",
};

function roleIcon(role: UserRole) {
  if (role === "CUSTOMER") return <CustomerIcon size={20} />;
  if (role === "EXPERT") return <ExpertIcon size={20} />;
  return <DiplomaIcon size={20} />;
}

/** Блок «Сменить роль» в меню кабинета: другие роли на эту почту и окно ввода пароля. */
export function RoleSwitcher() {
  const { state, pick, cancel, changePassword, submit } = useSwitchRole();

  if (state.roles.length === 0) return null;

  return (
    <>
      <div className={s.section}>
        <span className={s.heading}>Сменить роль</span>
        {state.roles.map((item) => (
          <button
            key={item.role}
            type="button"
            className={s.item}
            disabled={!item.email_verified}
            title={item.email_verified ? undefined : "Сначала подтвердите почту для этой роли"}
            onClick={() => pick(item.role)}
          >
            <span className={s.icon}>{roleIcon(item.role)}</span>
            <span className={s.label}>Войти как {LABEL_BY_ROLE[item.role]}</span>
          </button>
        ))}
      </div>

      {state.target && (
        <SwitchRolePasswordModal
          role={state.target}
          password={state.password}
          error={state.error}
          isSubmitting={state.isSubmitting}
          onPasswordChange={changePassword}
          onClose={cancel}
          onSubmit={submit}
        />
      )}
    </>
  );
}
