import { useEffect, useState } from "react";
import { customerOrderStatus, listArchivedOrders, listOrders, type CustomerOrderStatus, type Order } from "@/entites/order";

export function useCustomerOrders(refreshKey: number) {
  const [tab, setTab] = useState<CustomerOrderStatus>("active");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [archived, setArchived] = useState<Order[] | null>(null);

  useEffect(() => {
    let active = true;
    setOrders(null);
    listOrders(50)
      .then((r) => active && setOrders(r.items))
      .catch(() => active && setOrders([]));
    return () => {
      active = false;
    };
  }, [refreshKey]);

  useEffect(() => {
    if (tab !== "archive" || archived !== null) return;
    let active = true;
    listArchivedOrders(50)
      .then((r) => active && setArchived(r.items))
      .catch(() => active && setArchived([]));
    return () => {
      active = false;
    };
  }, [tab, archived]);

  useEffect(() => {
    setArchived(null);
  }, [refreshKey]);

  const items =
    tab === "archive" ? archived : orders === null ? null : orders.filter((o) => customerOrderStatus(o) === tab);

  return { tab, setTab, items };
}
