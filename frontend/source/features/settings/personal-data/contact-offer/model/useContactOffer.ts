"use client";

import { useEffect, useReducer } from "react";
import { fetchContactOffer, updateContactOffer, type ExpertContactOfferData } from "@/source/entities/expert-contact";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { INITIAL_STATE, contactOfferReducer } from "./reducer";
import type { ContactOfferFields } from "./types";

const toFields = (offer: ExpertContactOfferData): ContactOfferFields => ({
  enabled: offer.enabled,
  price: String(offer.price_rubles ?? ""),
  paymentDetails: offer.payment_details ?? "",
  consent: false,
});

/** Платный доступ к контактам исполнителя: включение, цена, реквизиты и согласие на передачу контактов. */
export function useContactOffer() {
  const { showError, showSuccess } = useNotifications();
  const [state, dispatch] = useReducer(contactOfferReducer, INITIAL_STATE);

  useEffect(() => {
    fetchContactOffer()
      .then((offer) => dispatch({ type: "load/success", fields: toFields(offer) }))
      .catch(() => dispatch({ type: "load/error", error: "Не удалось загрузить настройки контактов" }));
  }, []);

  const save = async () => {
    const { fields } = state;
    if (!fields) return;
    if (fields.enabled && (!fields.price || !fields.paymentDetails.trim())) {
      showError("Укажите стоимость и реквизиты для платного доступа к контактам");
      return;
    }
    if (fields.enabled && !fields.consent) {
      showError("Подтвердите согласие на передачу контактов после оплаты");
      return;
    }

    dispatch({ type: "save/start" });
    try {
      const offer = await updateContactOffer({
        enabled: fields.enabled,
        price_rubles: fields.enabled ? Number(fields.price) : undefined,
        payment_details: fields.enabled ? fields.paymentDetails.trim() : undefined,
        disclosure_consent: fields.enabled ? fields.consent : undefined,
      });
      dispatch({ type: "load/success", fields: toFields(offer) });
      showSuccess("Настройки контактов сохранены");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить настройки контактов");
    } finally {
      dispatch({ type: "save/finish" });
    }
  };

  return { state, change: (fields: ContactOfferFields) => dispatch({ type: "fields/change", fields }), save };
}
