import { fetchPublicOrder } from "./api";
import { fetchProfile } from "@/features/profile/settings/model/api";
import type { OrderData } from "./types";

export async function loadPublicOrder(
  uuid: string,
  onSuccess: (data: OrderData) => void,
  onError: (message: string) => void,
): Promise<void> {
  try {
    const data = await fetchPublicOrder(uuid);
    onSuccess(data);
  } catch (err) {
    onError(err instanceof Error ? err.message : "Заказ не найден");
  }
}

export async function checkAuthAndRedirect(
  orderId: number,
  onExpert: (redirectUrl: string) => void,
  onNotExpert: () => void,
): Promise<void> {
  try {
    const profile = await fetchProfile();
    if (profile.role === "EXPERT") {
      sessionStorage.removeItem("pendingOrderUuid");
      onExpert(`/expert/orders?orderId=${orderId}`);
    } else {
      onNotExpert();
    }
  } catch {
    onNotExpert();
  }
}
