import type { Order } from "./types";

export type CustomerOrderStatus = "active" | "inwork" | "archive";

export function customerOrderStatus(order: Order): CustomerOrderStatus {
  if (order.status === "ARCHIVED") return "archive";
  if (order.assigned_expert_id !== null) return "inwork";
  return "active";
}
