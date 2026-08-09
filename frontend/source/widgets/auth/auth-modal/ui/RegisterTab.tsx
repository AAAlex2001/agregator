"use client";

import { useState } from "react";
import type { AuthPreset } from "@/source/shared/lib/auth-modal";
import { RegisterForm, ConfirmCodeForm, type UserRole } from "@/source/features/auth/register";
import s from "./auth-modal.module.scss";

interface Props {
  onSuccess: () => void;
  preset?: AuthPreset | null;
}

export function RegisterTab({ onSuccess, preset = null }: Props) {
  const [pending, setPending] = useState<{ email: string; role: UserRole } | null>(null);

  return (
    <div className={s.flow}>
      <div className={s.stepHeader}>
        <span className={s.stepIndicator}>{pending ? "Шаг 2. Код" : "Шаг 1. Данные"}</span>
      </div>

      {!pending ? (
        <RegisterForm preset={preset} onRegistered={(email, role) => setPending({ email, role })} />
      ) : (
        <ConfirmCodeForm email={pending.email} role={pending.role} onSuccess={onSuccess} />
      )}
    </div>
  );
}
