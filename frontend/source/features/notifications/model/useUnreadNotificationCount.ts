"use client";

import { useEffect, useState } from "react";
import { fetchNotifications } from "../api/notifications.api";

const POLL_INTERVAL_MS = 30000;

export function useUnreadNotificationCount(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const tick = async () => {
      try {
        const data = await fetchNotifications(1);
        if (cancelled || !data) return;
        setCount(data.unread_count ?? 0);
      } catch {
        /* ignore */
      }
    };

    void tick();
    const id = window.setInterval(tick, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return count;
}
