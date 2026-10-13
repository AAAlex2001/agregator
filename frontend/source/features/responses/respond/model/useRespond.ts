"use client";

import { useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderCardData } from "@/source/entities/order";
import { respondToOrder, useBidFiles } from "@/source/entities/response";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { offerReducer } from "./reducer";
import { emptyOffer } from "./types";
import { validateOffer } from "./validateOffer";

/** Предложение исполнителя: поля, файлы и отправка. После отправки — переход к своим откликам. */
export function useRespond(order: OrderCardData) {
  const router = useRouter();
  const { showError } = useNotifications();
  const [offer, dispatch] = useReducer(offerReducer, emptyOffer);
  const bid = useBidFiles();
  const [isSending, setIsSending] = useState(false);

  const submit = async () => {
    const problem = validateOffer(order, offer);
    if (problem) {
      showError(problem);
      return;
    }
    setIsSending(true);
    try {
      await respondToOrder(order.id, {
        comment: offer.comment,
        proposed_sum_amount: Math.round(Number(offer.cost) * 100),
        proposed_start_date: offer.startDate,
        proposed_deadline: offer.deadline,
        vat_kind: offer.vatKind,
        expert_inn: order.requiresLicense ? (offer.company?.data.inn ?? "") : "",
        expert_company_data: order.requiresLicense && offer.company ? offer.company : {},
        files: bid.files,
      });
      router.push("/responses");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось отправить отклик";
      showError(message);
      if (message.toLowerCase().includes("подписк") || message.includes("402")) router.push("/settings?section=subscription");
    } finally {
      setIsSending(false);
    }
  };

  return { offer, dispatch, bid, isSending, submit };
}
