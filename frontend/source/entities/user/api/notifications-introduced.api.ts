import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import { readErrorMessage } from "@/source/shared/api/errorMessage";

export async function markNotificationsIntroduced(): Promise<void> {
  const response = await fetchWithSession(`${API_URL}/settings/notifications-introduced`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось сохранить отметку об ознакомлении"));
  }
}
