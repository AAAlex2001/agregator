import { useState } from "react";
import { subscribe, type Plan } from "@/entites/tariff";
import { emitError } from "@/shared/services/error-bus";
import { openLink } from "@/shared/services/telegram";

const RETURN_URL = "https://tg.plus-resurs.com";

export function useBuyTariff() {
  const [payingId, setPayingId] = useState<number | null>(null);

  const buy = async (plan: Plan) => {
    setPayingId(plan.id);
    try {
      const res = await subscribe(plan.id, RETURN_URL);
      openLink(res.confirmation_url);
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось оформить тариф");
    } finally {
      setPayingId(null);
    }
  };

  return { buy, payingId };
}
