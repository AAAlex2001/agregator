import { useEffect, useState } from "react";
import { emitError } from "@/shared/services/error-bus";
import { listOrders, type Order } from "./api";

export function useOrders(limit = 8) {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    let active = true;
    listOrders(limit)
      .then((data) => {
        if (active) setOrders(data.items);
      })
      .catch((e) => {
        emitError(e instanceof Error ? e.message : "Не удалось загрузить заказы");
        if (active) setOrders([]);
      });
    return () => {
      active = false;
    };
  }, [limit]);

  return { orders };
}
