import { API_URL } from "@/source/shared/api/config";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import type { OrderWorkType } from "@/source/entities/order";

interface GuestOrderPayload {
  customer: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
  };
  work_type: Extract<OrderWorkType, "RESEARCH" | "LABORATORY">;
  title: string;
  comment: string;
  sum_amount: number;
  start_date: string | null;
  deadline: string;
  responses_deadline: string | null;
  details: Record<string, unknown>;
}

export interface GuestOrderResult {
  order_public_id: string;
  email: string;
  role: string;
}

export async function createGuestOrder(
  payload: GuestOrderPayload,
  documents: File[],
): Promise<GuestOrderResult> {
  const body = new FormData();
  body.append("payload", JSON.stringify(payload));
  documents.forEach((file) => body.append("documents", file));

  const res = await fetch(`${API_URL}/orders/guest`, {
    method: "POST",
    credentials: "include",
    body,
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res, "Не удалось отправить заявку"));
  }

  return res.json();
}
