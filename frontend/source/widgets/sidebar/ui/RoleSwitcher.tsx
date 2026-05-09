"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAvailableRoles, useSession, type SessionRoleValue } from "@/source/features/session";
import { CustomerIcon, DiplomaIcon, ExpertIcon } from "@/source/shared/ui/icons";
import { RoleSwitchPasswordModal } from "./RoleSwitchPasswordModal";
import s from "./RoleSwitcher.module.scss";

const LABEL_BY_ROLE: Record<SessionRoleValue, string> = {
  CUSTOMER: "Заказчик",
  EXPERT: "Эксперт",
  LICENSE_HOLDER: "Лицензиат",
};

const HOMEPAGE_BY_ROLE: Record<SessionRoleValue, string> = {
  CUSTOMER: "/customer/orders",
  EXPERT: "/expert/orders",
  LICENSE_HOLDER: "/settings",
};

function renderIcon(role: SessionRoleValue) {
  if (role === "CUSTOMER") return <CustomerIcon size={20} />;
  if (role === "EXPERT") return <ExpertIcon size={20} />;
  return <DiplomaIcon size={20} />;
}

export function RoleSwitcher() {
  const { role, reload } = useSession();
  const { roles } = useAvailableRoles(role);
  const router = useRouter();
  const [target, setTarget] = useState<SessionRoleValue | null>(null);

  if (roles.length === 0) {
    return null;
  }

  async function handleSwitched(newRole: SessionRoleValue) {
    setTarget(null);
    await reload();
    router.push(HOMEPAGE_BY_ROLE[newRole]);
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
              onClick={() => setTarget(item.role)}
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
        open={target !== null}
        targetRole={target}
        onClose={() => setTarget(null)}
        onSwitched={handleSwitched}
      />
    </>
  );
}
