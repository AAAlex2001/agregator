"use client";

import { useState } from "react";
import { updateContactOffer } from "../api/update-contact-offer";
import type { UpdateContactOffer } from "./types";

/** Отправляет новые условия доступа и хранит состояние запроса. */
export function useUpdateContactOffer() {
  const [isSaving, setIsSaving] = useState(false);

  /** Возвращает сохранённые сервером условия доступа. */
  async function saveOffer(fields: UpdateContactOffer) {
    setIsSaving(true);

    try {
      return await updateContactOffer(fields);
    } finally {
      setIsSaving(false);
    }
  }

  return {
    isSaving,
    saveOffer,
  };
}
