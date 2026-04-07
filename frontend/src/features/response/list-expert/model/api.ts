import type { CreateResponsePayload } from "@/features/response/shared/model/types";
import { stableMultipartFetch } from "@/shared/lib/stableMultipartFetch";
import { fetchWithSessionRefresh } from "@/shared/lib/sessionAuth";

export { fetchResponses, updateResponseStatus } from "@/features/response/shared/model/api";

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "/api";
}

export async function createResponseForOrder(orderId: number, payload: CreateResponsePayload): Promise<void> {
  const apiBaseUrl = getApiBaseUrl();
  const rawFiles = payload.files ?? [];

  const buildFormData = (files: File[]) => {
    const formData = new FormData();
    formData.append("comment", payload.comment);
    formData.append("proposed_sum_amount", String(payload.proposed_sum_amount));
    formData.append("proposed_deadline", payload.proposed_deadline);
    for (const file of files) {
      formData.append("files", file);
    }
    return formData;
  };

  const response = await stableMultipartFetch({
    input: `${apiBaseUrl}/orders/${orderId}/responses`,
    method: "POST",
    files: rawFiles,
    buildBody: buildFormData,
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

export async function updateExistingResponse(
  responseId: number,
  payload: CreateResponsePayload,
): Promise<void> {
  const apiBaseUrl = getApiBaseUrl();
  const rawFiles = payload.files ?? [];

  const buildFormData = (files: File[]) => {
    const formData = new FormData();
    formData.append("comment", payload.comment);
    formData.append("proposed_sum_amount", String(payload.proposed_sum_amount));
    formData.append("proposed_deadline", payload.proposed_deadline);
    formData.append("keep_files", JSON.stringify(payload.keepFiles ?? []));
    for (const file of files) {
      formData.append("files", file);
    }
    return formData;
  };

  const response = await stableMultipartFetch({
    input: `${apiBaseUrl}/responses/${responseId}`,
    method: "PUT",
    files: rawFiles,
    buildBody: buildFormData,
  });

  if (!response.ok) {
    let message = "Не удалось обновить отклик";
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

export async function withdrawResponse(responseId: number): Promise<void> {
  const apiBaseUrl = getApiBaseUrl();

  const response = await fetchWithSessionRefresh(`${apiBaseUrl}/responses/${responseId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    let message = "Не удалось отозвать отклик";
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
