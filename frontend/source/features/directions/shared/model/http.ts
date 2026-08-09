import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import { stableMultipartFetch } from "@/source/shared/lib/stableMultipartFetch";

export async function getJson<T>(path: string, fallback: string): Promise<T> {
  const res = await fetchWithSession(`${API_URL}${path}`);
  if (!res.ok) throw new Error(await readErrorMessage(res, fallback));
  return res.json();
}

export async function putJson<T>(path: string, body: object, fallback: string): Promise<T> {
  const res = await fetchWithSession(`${API_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await readErrorMessage(res, fallback));
  return res.json();
}

export async function postFile<T>(path: string, file: File, fallback: string): Promise<T> {
  const res = await stableMultipartFetch({
    input: `${API_URL}${path}`,
    method: "POST",
    files: [file],
    buildBody: (files) => {
      const formData = new FormData();
      formData.append("file", files[0]);
      return formData;
    },
  });
  if (!res.ok) throw new Error(await readErrorMessage(res, fallback));
  return res.json();
}

export async function deleteWithBody<T>(path: string, body: object, fallback: string): Promise<T> {
  const res = await fetchWithSession(`${API_URL}${path}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await readErrorMessage(res, fallback));
  return res.json();
}
