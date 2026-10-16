"use client";

import { useEffect, useState } from "react";
import { getExpertiseProfile } from "@/entities/expertise";
import type { ExpertCertificate } from "@/entities/expertise";
import type { ProfileCertificates } from "./types";

/** Удостоверения из анкеты ЭПБ и состояние их загрузки. */
interface ProfileCertificatesState {
  certificates: ExpertCertificate[];
  isLoading: boolean;
  error: string | null;
}

/** Удостоверения из анкеты ЭПБ, которые исполнитель прикладывает к объявлению. */
export function useProfileCertificates(isExpert: boolean): ProfileCertificates {
  const [state, setState] = useState<ProfileCertificatesState>({
    certificates: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!isExpert) {
      return;
    }

    let isActive = true;

    getExpertiseProfile()
      .then((profile) => {
        if (isActive) {
          setState({
            certificates: profile.certificates,
            isLoading: false,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            certificates: [],
            isLoading: false,
            error: error instanceof Error ? error.message : "Не удалось загрузить анкету",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [isExpert]);

  return {
    certificates: state.certificates,
    isLoading: isExpert && state.isLoading,
    hasError: isExpert && state.error !== null,
  };
}
