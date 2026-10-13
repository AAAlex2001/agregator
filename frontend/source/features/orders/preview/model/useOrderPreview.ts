"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchPublicOrder, PENDING_ORDER_UUID_KEY, type PublicOrderPreview } from "@/source/entities/order";
import { useSession } from "@/source/entities/session";

/**
 * Заказ по публичной ссылке. Адрес запоминается, чтобы после входа вернуть сюда;
 * вошедший исполнитель сразу уходит к заказу в своём разделе.
 */
export function useOrderPreview(uuid: string) {
  const router = useRouter();
  const { role, isLoading: isSessionLoading } = useSession();
  const [order, setOrder] = useState<PublicOrderPreview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    sessionStorage.setItem(PENDING_ORDER_UUID_KEY, uuid);
    let cancelled = false;
    fetchPublicOrder(uuid)
      .then((data) => {
        if (!cancelled) setOrder(data);
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Заказ не найден");
      });
    return () => {
      cancelled = true;
    };
  }, [uuid]);

  useEffect(() => {
    if (!order || role !== "EXPERT") return;
    sessionStorage.removeItem(PENDING_ORDER_UUID_KEY);
    router.replace(`/expert/orders?orderId=${order.id}`);
  }, [order, role, router]);

  return { order, error, isLoading: isSessionLoading || role === "EXPERT" || (!order && !error) };
}
