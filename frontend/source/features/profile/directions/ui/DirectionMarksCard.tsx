"use client";

import { useState } from "react";
import { Checkbox } from "@/source/shared/ui/Checkbox";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { ORDER_WORK_OPTIONS } from "@/source/entities/order";
import { updateDirections } from "@/source/entities/user";
import { useSession } from "@/source/features/session";
import s from "./DirectionMarksCard.module.scss";

const HIDDEN_BY_ROLE: Record<string, string[]> = {
  CUSTOMER: ["AUDIT_SUPB"],
  LICENSE_HOLDER: ["EXPERTISE", "AUDIT_SUPB", "TECH_DIAG", "DESIGN", "ECOLOGY", "SURVEY"],
};

export function DirectionMarksCard() {
  const { user, role, setUser } = useSession();
  const { showError } = useNotifications();
  const [checked, setChecked] = useState<string[]>(user?.directions ?? []);
  const [waiting, setWaiting] = useState(false);

  const options = ORDER_WORK_OPTIONS.filter(
    (option) => !(HIDDEN_BY_ROLE[role ?? ""] ?? []).includes(option.value),
  );

  const toggle = async (key: string) => {
    if (waiting) return;
    const next = checked.includes(key)
      ? checked.filter((item) => item !== key)
      : [...checked, key];
    setChecked(next);
    setWaiting(true);
    try {
      const profile = await updateDirections(next);
      setUser(profile);
    } catch (err) {
      setChecked(checked);
      showError(err instanceof Error ? err.message : "Не удалось сохранить направления");
    } finally {
      setWaiting(false);
    }
  };

  return (
    <div className={s.card}>
      <span className={s.hint}>
        Отметьте направления, по которым работаете, — сохраняются сразу, анкеты для них не нужны.
      </span>

      <ul className={s.list}>
        {options.map((option) => (
          <li key={option.value} className={s.item}>
            <Checkbox
              id={`direction-mark-${option.value.toLowerCase()}`}
              checked={checked.includes(option.value)}
              onChange={() => void toggle(option.value)}
            >
              <span className={s.itemTitle}>{option.label}</span>
              <span className={s.itemText}>{option.description}</span>
            </Checkbox>
          </li>
        ))}
      </ul>
    </div>
  );
}
