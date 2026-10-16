"use client";

import { useEffect, useState } from "react";
import { getSroProfile } from "../api/get-sro-profile";
import type { SroDirection, SroProfile } from "./types";

/** Анкета последнего завершённого запроса и направление, для которого она загружена. */
interface SroProfileState {
  direction: SroDirection | null;
  profile: SroProfile | null;
  error: string | null;
}

/** Загружает анкету члена СРО выбранного направления для её редактирования. */
export function useLoadSroProfile(direction: SroDirection) {
  const [state, setState] = useState<SroProfileState>({
    direction: null,
    profile: null,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getSroProfile(direction)
      .then((profile) => {
        if (isActive) {
          setState({ direction, profile, error: null });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            direction,
            profile: null,
            error:
              error instanceof Error
                ? error.message
                : "Не удалось загрузить анкету члена СРО",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [direction]);

  const isLoading = state.direction !== direction;

  return {
    profile: isLoading ? null : state.profile,
    error: isLoading ? null : state.error,
    isLoading,
  };
}
