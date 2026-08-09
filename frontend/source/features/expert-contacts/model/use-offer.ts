"use client";

import { updateContactOffer } from "@/source/entities/expert-contact";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { useExpertContactsContext } from "./provider";

export function useOffer() {
  const { state, dispatch } = useExpertContactsContext();
  const { showError } = useNotifications();

  const saveOffer = async (payload: Parameters<typeof updateContactOffer>[0]): Promise<boolean> => {
    if (state.busy) return false;
    dispatch({ type: "BUSY", value: true });
    try {
      const offer = await updateContactOffer(payload);
      dispatch({ type: "SYNC_OFFER", value: offer });
      return true;
    } catch (reason) {
      showError(reason instanceof Error ? reason.message : "Не удалось сохранить настройки");
      return false;
    } finally {
      dispatch({ type: "BUSY", value: false });
    }
  };

  return { offer: state.offer, busy: state.busy, saveOffer };
}
