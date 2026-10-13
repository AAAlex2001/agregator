"use client";

import { useEffect, useState } from "react";
import { fetchFollowingUnseen, markFollowingSeen } from "@/source/entities/posts";
import { useNotifications } from "@/source/shared/ui/Notifications";

/** Сколько новых публикаций в подписках; при открытии вкладки счётчик обнуляется. */
export function useFollowingUnseen(userId: number | undefined) {
  const { showError } = useNotifications();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    fetchFollowingUnseen()
      .then((result) => {
        if (!cancelled) setCount(result.count);
      })
      .catch((error) => {
        if (!cancelled) showError(error instanceof Error ? error.message : "Не удалось загрузить новые публикации");
      });
    return () => {
      cancelled = true;
    };
  }, [userId, showError]);

  const markSeen = async () => {
    try {
      await markFollowingSeen();
      setCount(0);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось отметить подписки просмотренными");
    }
  };

  return { count, markSeen };
}
