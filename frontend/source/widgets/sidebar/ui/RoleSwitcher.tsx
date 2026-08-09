"use client";

import { useRoleSwitch, type SessionRoleValue } from "@/source/features/session";
import { CustomerIcon, DiplomaIcon, ExpertIcon } from "@/source/shared/ui/icons";
import { RoleSwitchPasswordModal } from "./RoleSwitchPasswordModal";
import s from "./RoleSwitcher.module.scss";

const LABEL_BY_ROLE: Record<SessionRoleValue, string> = {
  CUSTOMER: "Заказчик",
  EXPERT: "Исполнитель",
  LICENSE_HOLDER: "Держатель разрешительных документов",
};

function renderIcon(role: SessionRoleValue) {
  if (role === "CUSTOMER") return <CustomerIcon size={20} />;
  if (role === "EXPERT") return <ExpertIcon size={20} />;
  return <DiplomaIcon size={20} />;
}

export function RoleSwitcher() {
  const { roles, target, password, setPassword, submitting, error, pick, cancel, submit } =
    useRoleSwitch();

  if (roles.length === 0) {
    return null;
  }

  return (
    <>
      <div className={s.section}>
        <span className={s.heading}>Сменить роль</span>
        {roles.map((item) => {
          const label = LABEL_BY_ROLE[item.role];
          const disabled = !item.email_verified;
          return (
            <button
              key={item.role}
              type="button"
              className={s.item}
              onClick={() => pick(item.role)}
              disabled={disabled}
              title={disabled ? "Сначала подтвердите почту для этой роли" : undefined}
            >
              <span className={s.icon}>{renderIcon(item.role)}</span>
              <span className={s.label}>Войти как {label.toLowerCase()}</span>
            </button>
          );
        })}
      </div>

      <RoleSwitchPasswordModal
        targetRole={target}
        password={password}
        onPasswordChange={setPassword}
        submitting={submitting}
        error={error}
        onClose={cancel}
        onSubmit={() => void submit()}
      />
    </>
  );
}
