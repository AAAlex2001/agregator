"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { contactLaborListing } from "@/entities/labor";
import { useNotifications } from "@/shared/ui/notifications";

/** Откликается на объявление и открывает чат с его автором. */
export function useContactLaborListing(listingId: number) {
  const router = useRouter();
  const { showError } = useNotifications();
  const [isContacting, setIsContacting] = useState(false);

  /** Создаёт или находит чат отклика и переходит в него. */
  async function contact() {
    setIsContacting(true);

    try {
      const chatUuid = await contactLaborListing(listingId);

      router.push(`/chat/${chatUuid}`);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось открыть чат");
    } finally {
      setIsContacting(false);
    }
  }

  return {
    isContacting,
    contact,
  };
}
