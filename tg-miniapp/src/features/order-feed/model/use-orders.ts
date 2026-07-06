import { useEffect, useState } from "react";
import { emitError } from "@/shared/services/error-bus";
import { listOrders, listArchivedOrders, type Order } from "@/entites/order";

export function useOrders(limit = 8, archived = false) {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    let active = true;
    const fetcher = archived ? listArchivedOrders : listOrders;
    fetcher(limit)
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
  }, [limit, archived]);

  return { orders };
}
