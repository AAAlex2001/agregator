import { useEffect, useState } from "react";
import { emitError } from "@/shared/services/error-bus";
import { listPlans, type Plan } from "@/entites/tariff";

export function usePlans() {
  const [plans, setPlans] = useState<Plan[] | null>(null);

  useEffect(() => {
    let active = true;
    listPlans()
      .then((data) => {
        if (active) setPlans(data.plans);
      })
      .catch((e) => {
        emitError(e instanceof Error ? e.message : "Не удалось загрузить тарифы");
        if (active) setPlans([]);
      });
    return () => {
      active = false;
    };
  }, []);

  return { plans };
}
