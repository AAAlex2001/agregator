"use client";

import { useUnreadCountContext } from "./UnreadCountContext";

export function useUnreadNotificationCount(): number {
  return useUnreadCountContext().count;
}
