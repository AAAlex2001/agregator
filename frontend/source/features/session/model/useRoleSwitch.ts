"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { switchSessionRole, type SessionRoleValue } from "@/source/entities/session";
import { useSession } from "./useSession";
import { useAvailableRoles } from "./useAvailableRoles";

const HOMEPAGE_BY_ROLE: Record<SessionRoleValue, string> = {
  CUSTOMER: "/customer/orders",
  EXPERT: "/expert/orders",
  LICENSE_HOLDER: "/settings",
};

export function useRoleSwitch() {
  const { role, reload } = useSession();
  const { roles } = useAvailableRoles(role);
  const router = useRouter();
  const [target, setTarget] = useState<SessionRoleValue | null>(null);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = (nextTarget: SessionRoleValue) => {
    setTarget(nextTarget);
    setPassword("");
    setError(null);
  };

  const cancel = () => {
    setTarget(null);
    setPassword("");
    setError(null);
  };

  const submit = async () => {
    if (!target || password.length === 0 || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await switchSessionRole(target, password);
      const newRole = target;
      setTarget(null);
      await reload();
      router.push(HOMEPAGE_BY_ROLE[newRole]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось переключить роль");
    } finally {
      setSubmitting(false);
    }
  };

  return { roles, target, password, setPassword, submitting, error, pick, cancel, submit };
}
