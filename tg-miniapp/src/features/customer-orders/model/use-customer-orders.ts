import { useEffect, useState } from "react";
import { listArchivedOrders, listOrders, type Order } from "@/entites/order";

export function useCustomerOrders(view: "orders" | "archive", refreshKey: number) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [archived, setArchived] = useState<Order[] | null>(null);

  useEffect(() => {
    let active = true;
    setOrders(null);
    listOrders(100)
      .then((r) => active && setOrders(r.items))
      .catch(() => active && setOrders([]));
    return () => {
      active = false;
    };
  }, [refreshKey]);

  useEffect(() => {
    if (view !== "archive" || archived !== null) return;
    let active = true;
    listArchivedOrders(100)
      .then((r) => active && setArchived(r.items))
      .catch(() => active && setArchived([]));
    return () => {
      active = false;
    };
  }, [view, archived]);

  useEffect(() => {
    setArchived(null);
  }, [refreshKey]);

  const items = view === "archive" ? archived : orders;

  return { items };
}
