"use client";

import type { EmailPreferences } from "@/entities/user";
import { Switch } from "@/shared/ui/switch";
import type { EmailEvent } from "../../model/types";

/** Одно почтовое событие и его текущее состояние. */
interface EmailEventSwitchProps {
  event: EmailEvent;
  checked: boolean;
  disabled: boolean;
  onChange: (key: keyof EmailPreferences, enabled: boolean) => void;
}

/** Показывает подпись события и передаёт переключение с его ключом. */
export function EmailEventSwitch({
  event,
  checked,
  disabled,
  onChange,
}: EmailEventSwitchProps) {
  /** Передаёт выбранное состояние конкретного события. */
  function changeChecked(enabled: boolean) {
    onChange(event.key, enabled);
  }

  return (
    <li>
      <Switch
        id={`pref-${event.key}`}
        checked={checked}
        onChange={changeChecked}
        label={event.label}
        description={event.description}
        disabled={disabled}
      />
    </li>
  );
}
