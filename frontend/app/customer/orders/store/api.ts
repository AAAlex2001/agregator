import type {
  CreateOrderPayload,
  CustomerOrdersListResponse,
} from "./types";
import { stableMultipartFetch } from "@/app/utils/stableMultipartFetch";
import { fetchWithSessionRefresh } from "@/app/utils/sessionAuth";

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "/api";
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

  const response = await fetchWithSessionRefresh(`${apiBaseUrl}/orders/?${query.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
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
  const rawFiles = payload.files ?? [];

  const buildFormData = (files: File[]) => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("company", payload.company);
    formData.append("typical_names", payload.typical_names);
    formData.append("comment", payload.comment);
    formData.append("customer_id", String(payload.customer_id));
    formData.append("sum_amount", String(payload.sum_amount));
    formData.append("deadline", payload.deadline);
    if (payload.responses_deadline) {
      formData.append("responses_deadline", payload.responses_deadline);
    }
    formData.append("badges_json", JSON.stringify(payload.badges));
    for (const file of files) {
      formData.append("files", file);
    }
    return formData;
  };

  const response = await stableMultipartFetch({
    input: `${apiBaseUrl}/orders/create-with-files`,
    method: "POST",
    files: rawFiles,
    buildBody: buildFormData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail ?? "Не удалось создать заказ");
  }

  return response.json();
}
