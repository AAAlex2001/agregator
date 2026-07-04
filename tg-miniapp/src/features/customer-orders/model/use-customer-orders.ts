import { useEffect, useState } from "react";
import { customerOrderStatus, listArchivedOrders, listOrders, type Order } from "@/entites/order";

export type CustomerTab = "active" | "inwork";

export function useCustomerOrders(view: "orders" | "archive", refreshKey: number) {
  const [tab, setTab] = useState<CustomerTab>("active");
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
    if (view !== "archive" || archived !== null) return;
    let active = true;
    listArchivedOrders(50)
      .then((r) => active && setArchived(r.items))
      .catch(() => active && setArchived([]));
    return () => {
      active = false;
    };
  }, [view, archived]);

  useEffect(() => {
    setArchived(null);
  }, [refreshKey]);

  const items =
    view === "archive" ? archived : orders === null ? null : orders.filter((o) => customerOrderStatus(o) === tab);

  return { tab, setTab, items };
}
