"use client";

import { useState } from "react";
import type { DirectionCode } from "@/entities/direction";
import { useUpdateDirections } from "@/entities/user";
import type { UserProfile } from "@/entities/user";
import { useNotifications } from "@/shared/ui/notifications";
import { getDirectionOptions } from "./directions";

/** Сохраняет отметку сразу, возвращая прежний выбор при ошибке запроса. */
export function useEditDirections(profile: UserProfile) {
  const { isSaving, saveDirections } = useUpdateDirections();
  const { showError } = useNotifications();
  const [selectedDirections, setSelectedDirections] = useState(profile.directions);
  const options = getDirectionOptions(profile.role);

  /** Меняет одну отметку, не удаляя направления с отдельными анкетами. */
  async function toggleDirection(direction: DirectionCode) {
    if (isSaving) {
      return;
    }

    const previousDirections = selectedDirections;
    const nextDirections = selectedDirections.includes(direction)
      ? selectedDirections.filter((selected) => selected !== direction)
      : [...selectedDirections, direction];

    setSelectedDirections(nextDirections);

    try {
      await saveDirections(nextDirections);
    } catch (error) {
      setSelectedDirections(previousDirections);
      showError(
        error instanceof Error
          ? error.message
          : "Не удалось сохранить направления",
      );
    }
  }

  return {
    options,
    selectedDirections,
    toggleDirection,
  };
}
