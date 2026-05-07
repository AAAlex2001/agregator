import type { NotificationItem } from "@/source/entities/notification";

export type PendingMode = "read" | "dismiss" | null;

export interface NotificationsState {
  items: NotificationItem[];
  total: number;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  pendingId: number | null;
  pendingMode: PendingMode;
  isMarkingAll: boolean;
  isDismissingAll: boolean;
}

export type NotificationsAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_DATA"; items: NotificationItem[]; total: number; unreadCount: number }
  | { type: "SET_PENDING"; id: number | null; mode: PendingMode }
  | { type: "SET_MARKING_ALL"; payload: boolean }
  | { type: "SET_DISMISSING_ALL"; payload: boolean }
  | { type: "UPSERT_ITEM"; payload: NotificationItem }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "SET_UNREAD_COUNT"; payload: number }
  | { type: "MARK_ALL_READ" };