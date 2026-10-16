"use client";

import { useState } from "react";
import { useUpdateContactOffer } from "@/entities/expert-contact";
import type {
  ContactOfferFields,
  ExpertContactOffer,
} from "@/entities/expert-contact";
import { useNotifications } from "@/shared/ui/notifications";

/** Готовит сохранённые условия к редактированию с новым подтверждением согласия. */
function toContactOfferFields(offer: ExpertContactOffer): ContactOfferFields {
  return {
    enabled: offer.enabled,
    price: String(offer.price_rubles ?? ""),
    paymentDetails: offer.payment_details ?? "",
    consent: false,
  };
}

/** Проверяет условия доступа и передаёт подтверждённые сервером изменения наружу. */
export function useEditContactOffer(
  initialOffer: ExpertContactOffer,
  successMessage: string,
  onSaved?: (offer: ExpertContactOffer) => void,
) {
  const [fields, change] = useState(toContactOfferFields(initialOffer));
  const { isSaving, saveOffer } = useUpdateContactOffer();
  const { showError, showSuccess } = useNotifications();

  /** Сохраняет условия; при ошибке оставляет введённые поля для повторной попытки. */
  async function save() {
    if (isSaving) {
      return;
    }

    if (fields.enabled && (!fields.price || !fields.paymentDetails.trim())) {
      showError("Укажите стоимость и реквизиты для платного доступа к контактам");
      return;
    }

    if (fields.enabled && !fields.consent) {
      showError("Подтвердите согласие на передачу контактов после оплаты");
      return;
    }

    try {
      const savedOffer = await saveOffer({
        enabled: fields.enabled,
        price_rubles: fields.enabled ? Number(fields.price) : undefined,
        payment_details: fields.enabled ? fields.paymentDetails.trim() : undefined,
        disclosure_consent: fields.enabled ? fields.consent : undefined,
      });

      change(toContactOfferFields(savedOffer));
      onSaved?.(savedOffer);
      showSuccess(successMessage);
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Не удалось сохранить настройки контактов",
      );
    }
  }

  return {
    fields,
    isSaving,
    change,
    save,
  };
}

