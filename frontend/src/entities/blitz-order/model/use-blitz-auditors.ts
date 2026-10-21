"use client";

import { useEffect, useState } from "react";
import { getBlitzAuditors } from "../api/get-blitz-auditors";
import type { BlitzTeamMember } from "./audit-types";

/** Аудиторы и ошибка их загрузки. */
interface BlitzAuditorsState {
  auditors: BlitzTeamMember[] | null;
  error: string | null;
}

/** Загружает аудиторов для набора группы. */
export function useBlitzAuditors() {
  const [state, setState] = useState<BlitzAuditorsState>({ auditors: null, error: null });

  useEffect(() => {
    let isActive = true;

    getBlitzAuditors()
      .then((auditors) => {
        if (isActive) {
          setState({ auditors, error: null });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            auditors: [],
            error: error instanceof Error ? error.message : "Не удалось загрузить аудиторов",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}