"use client";

import { useState } from "react";
import { ORDER_WORK_OPTIONS } from "@/source/entities/order";
import { updateDirections } from "@/source/entities/user";
import { useSession } from "@/source/entities/session";
import { useNotifications } from "@/source/shared/ui/Notifications";

/** Направления, для которых у роли есть анкета: их не отмечают галочкой, анкета заполняется отдельно. */
function directionsWithProfile(role: string | null): string[] {
  if (role === "CUSTOMER") return ["AUDIT_SUPB"];
  if (role === "LICENSE_HOLDER") return ["EXPERTISE", "AUDIT_SUPB", "TECH_DIAG", "DESIGN", "ECOLOGY", "SURVEY"];
  return [];
}

/** Отметки «работаю по направлению» без анкеты: каждая галочка сохраняется сразу. */
export function useDirectionMarks() {
  const { user, role, setUser } = useSession();
  const { showError } = useNotifications();
  const [checked, setChecked] = useState(user?.directions ?? []);
  const [isSaving, setIsSaving] = useState(false);

  const options = ORDER_WORK_OPTIONS.filter((option) => !directionsWithProfile(role).includes(option.value));

  const toggle = async (direction: string) => {
    if (isSaving) return;

    const previous = checked;
    const next = checked.includes(direction) ? checked.filter((item) => item !== direction) : [...checked, direction];

    setChecked(next);
    setIsSaving(true);
    try {
      setUser(await updateDirections(next));
    } catch (error) {
      setChecked(previous);
      showError(error instanceof Error ? error.message : "Не удалось сохранить направления");
    } finally {
      setIsSaving(false);
    }
  };

  return { options, checked, toggle };
}
