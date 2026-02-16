import type {
  CreateOrderPayload,
  CustomerOrdersListResponse,
} from "./types";

function getApiBaseUrl(): string {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  return apiBaseUrl;
}

function getCurrentUserId(): number {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem("user_id");
    if (stored) return Number(stored);
  }
  const fallback = process.env.NEXT_PUBLIC_EXPERT_ID;
  return fallback ? Number(fallback) : 0;
}

export async function fetchCustomerOrders(
  skip = 0,
  limit = 50,
): Promise<CustomerOrdersListResponse> {
  const apiBaseUrl = getApiBaseUrl();
  const query = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  });

  const response = await fetch(`${apiBaseUrl}/orders/?${query.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": String(getCurrentUserId()),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail ?? "Не удалось загрузить заказы");
  }

  return response.json();
}

export async function createCustomerOrder(
  payload: CreateOrderPayload,
): Promise<{ id: number }> {
  const apiBaseUrl = getApiBaseUrl();
  const userId = getCurrentUserId();

  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("company", payload.company);
  formData.append("typical_names", payload.typical_names);
  formData.append("comment", payload.comment);
  formData.append("customer_id", String(payload.customer_id));
  formData.append("sum_amount", String(payload.sum_amount));
  formData.append("deadline", payload.deadline);
  formData.append("badges_json", JSON.stringify(payload.badges));

  if (payload.files && payload.files.length > 0) {
    for (const file of payload.files) {
      formData.append("files", file);
    }
  }

  const response = await fetch(
    `${apiBaseUrl}/orders/create-with-files`,
    {
      method: "POST",
      headers: { "X-User-Id": String(userId) },
      body: formData,
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail ?? "Не удалось создать заказ");
  }

  return response.json();
}
