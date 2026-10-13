import type { NotificationItem } from "@/source/entities/notification";

export type PendingKind = "read" | "dismiss";

export interface InboxState {
  items: NotificationItem[];
  hasMore: boolean;
  isLoading: boolean;
  loadError: string | null;
  isLoadingMore: boolean;
  pending: { id: number; kind: PendingKind } | null;
  bulk: PendingKind | null;
}

export type InboxAction =
  | { type: "load/success"; items: NotificationItem[]; hasMore: boolean }
  | { type: "load/error"; error: string }
  | { type: "more/start" }
  | { type: "more/success"; items: NotificationItem[]; hasMore: boolean }
  | { type: "more/finish" }
  | { type: "item/start"; id: number; kind: PendingKind }
  | { type: "item/finish" }
  | { type: "item/read"; item: NotificationItem }
  | { type: "item/removed"; id: number }
  | { type: "bulk/start"; kind: PendingKind }
  | { type: "bulk/finish" }
  | { type: "bulk/read" }
  | { type: "bulk/removed" };
