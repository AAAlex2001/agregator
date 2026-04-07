import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadPublicOrder, checkAuthAndRedirect } from "./actions";
import type { OrderData } from "./types";

export function useOrderPreviewState() {
  const params = useParams();
  const router = useRouter();
  const uuid = params.uuid as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Save pending order UUID to session storage
  useEffect(() => {
    if (uuid) sessionStorage.setItem("pendingOrderUuid", uuid);
  }, [uuid]);

  // Fetch the public order
  useEffect(() => {
    if (!uuid) return;
    setIsLoading(true);
    void loadPublicOrder(uuid,
      (data) => { setOrder(data); setIsLoading(false); },
      (msg) => { setError(msg); setIsLoading(false); },
    );
  }, [uuid]);

  // Check auth and redirect experts
  useEffect(() => {
    if (!order) return;
    void checkAuthAndRedirect(order.id,
      (url) => router.replace(url),
      () => setCheckingAuth(false),
    );
  }, [order]);

  return { order, isLoading, error, checkingAuth };
}
