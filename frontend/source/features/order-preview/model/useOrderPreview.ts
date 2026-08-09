"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchPublicOrder, PENDING_ORDER_UUID_KEY, type PublicOrderPreview } from "@/source/entities/order";
import { fetchProfile } from "@/source/entities/user";

export function useOrderPreview() {
  const params = useParams();
  const router = useRouter();
  const uuid = params?.uuid as string | undefined;
  const [order, setOrder] = useState<PublicOrderPreview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (uuid) sessionStorage.setItem(PENDING_ORDER_UUID_KEY, uuid);
  }, [uuid]);

  useEffect(() => {
    if (!uuid) return;
    setIsLoading(true);
    fetchPublicOrder(uuid)
      .then((data) => setOrder(data))
      .catch((e) => setError(e instanceof Error ? e.message : "Заказ не найден"))
      .finally(() => setIsLoading(false));
  }, [uuid]);

  useEffect(() => {
    if (!order) return;
    fetchProfile()
      .then((profile) => {
        if (profile.role === "EXPERT") {
          sessionStorage.removeItem(PENDING_ORDER_UUID_KEY);
          router.replace(`/expert/orders?orderId=${order.id}`);
        } else {
          setCheckingAuth(false);
        }
      })
      .catch(() => setCheckingAuth(false));
  }, [order, router]);

  return { order, isLoading, error, checkingAuth };
}
