"use client";

import { useEffect, useState } from "react";
import { getContactOffer } from "../api/get-contact-offer";
import type { ExpertContactOffer } from "./types";

/** Условия доступа к контактам и состояние их загрузки. */
interface ContactOfferState {
  offer: ExpertContactOffer | null;
  isLoading: boolean;
  error: string | null;
}

/** Загружает настройки контактов на время открытия формы текущего аккаунта. */
export function useContactOffer(): ContactOfferState {
  const [state, setState] = useState<ContactOfferState>({
    offer: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getContactOffer()
      .then((offer) => {
        if (isActive) {
          setState({
            offer,
            isLoading: false,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            offer: null,
            isLoading: false,
            error: error instanceof Error
              ? error.message
              : "Не удалось загрузить настройки контактов",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
