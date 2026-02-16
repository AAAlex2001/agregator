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

  const body = {
    title: payload.title,
    company: payload.company,
    typical_names: payload.typical_names,
    comment: payload.comment,
    customer_id: payload.customer_id,
    sum_amount: payload.sum_amount,
    deadline: payload.deadline,
    badges: payload.badges,
  };

  const response = await fetch(`${apiBaseUrl}/orders/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": String(userId),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail ?? "Не удалось создать заказ");
  }

  const created = await response.json();

  if (payload.files && payload.files.length > 0) {
    const formData = new FormData();
    for (const file of payload.files) {
      formData.append("files", file);
    }

    const uploadResponse = await fetch(
      `${apiBaseUrl}/orders/${created.id}/files`,
      {
        method: "POST",
        headers: {
          "X-User-Id": String(userId),
        },
        body: formData,
      },
    );

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json().catch(() => null);
      throw new Error(
        errorData?.detail ?? "Заказ создан, но файлы не загружены",
      );
    }
  }

  return created;
}
