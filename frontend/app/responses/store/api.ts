import type {
  CreateResponsePayload,
  ResponseTabKey,
  ResponseApiItem,
  ResponsesApiList,
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
    if (stored) {
      const parsed = Number(stored);
      if (Number.isInteger(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }

  const fallback = Number(process.env.NEXT_PUBLIC_EXPERT_ID ?? "1");
  if (Number.isInteger(fallback) && fallback > 0) {
    return fallback;
  }

  throw new Error("Не удалось определить пользователя");
}

function getHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "X-User-Id": String(getCurrentUserId()),
  };
}

export async function fetchResponses(tab: ResponseTabKey, skip = 0, limit = 50): Promise<ResponsesApiList> {
  const apiBaseUrl = getApiBaseUrl();

  const query = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  });

  if (tab !== "all") {
    query.set("tab", tab);
  }

  const response = await fetch(`${apiBaseUrl}/responses?${query.toString()}`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    let message = "Не удалось загрузить отклики";
    try {
      const body = (await response.json()) as { detail?: string };
      if (body?.detail) {
        message = body.detail;
      }
    } catch {
    }
    throw new Error(message);
  }

  return (await response.json()) as ResponsesApiList;
}

export async function createResponseForOrder(orderId: number, payload: CreateResponsePayload): Promise<void> {
  const apiBaseUrl = getApiBaseUrl();

  const formData = new FormData();
  formData.append("comment", payload.comment);
  formData.append("proposed_sum_amount", String(payload.proposed_sum_amount));
  formData.append("proposed_deadline", payload.proposed_deadline);

  for (const file of payload.files ?? []) {
    formData.append("files", file);
  }

  const response = await fetch(`${apiBaseUrl}/orders/${orderId}/responses`, {
    method: "POST",
    headers: {
      "X-User-Id": String(getCurrentUserId()),
    },
    body: formData,
  });

  if (!response.ok) {
    let message = "Не удалось отправить отклик";
    try {
      const body = (await response.json()) as { detail?: string };
      if (body?.detail) {
        message = body.detail;
      }
    } catch {
    }
    throw new Error(message);
  }
}

export async function updateResponseStatus(
  responseId: number,
  newStatus: ResponseApiItem["status"]
): Promise<void> {
  const apiBaseUrl = getApiBaseUrl();

  const response = await fetch(`${apiBaseUrl}/responses/${responseId}/status?new_status=${newStatus}`, {
    method: "PATCH",
    headers: {
      "X-User-Id": String(getCurrentUserId()),
    },
  });

  if (!response.ok) {
    let message = "Не удалось обновить статус отклика";
    try {
      const body = (await response.json()) as { detail?: string };
      if (body?.detail) {
        message = body.detail;
      }
    } catch {
    }
    throw new Error(message);
  }
}
