"use client";

import { useState } from "react";
import {
  createContactDeal,
  getContactDeal,
  useExpertContacts,
} from "@/entities/expert-contact";
import { useNotifications } from "@/shared/ui/notifications";

/** Создаёт заявку на контакты исполнителя или открывает начатую сделку. */
export function useOpenContactDeal() {
  const { showDeal } = useExpertContacts();
  const { showError, showSuccess } = useNotifications();
  const [isOpening, setIsOpening] = useState(false);

  /** Загружает договор, подписи и чеки начатой сделки. */
  async function openDeal(dealId: number) {
    if (isOpening) {
      return;
    }

    setIsOpening(true);

    try {
      const deal = await getContactDeal(dealId);
      await showDeal(deal);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось загрузить сделку");
    } finally {
      setIsOpening(false);
    }
  }

  /** Создаёт договор на покупку контактов и сразу открывает его. */
  async function buyContacts(sellerId: number) {
    if (isOpening) {
      return;
    }

    setIsOpening(true);

    try {
      const deal = await createContactDeal(sellerId);
      await showDeal(deal);
      showSuccess("Заявка на покупку контактов создана");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось создать договор");
    } finally {
      setIsOpening(false);
    }
  }

  return {
    isOpening,
    openDeal,
    buyContacts,
  };
}
