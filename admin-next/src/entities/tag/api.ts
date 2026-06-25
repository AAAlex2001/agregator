import { Tag } from "./model";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const listTags = async (): Promise<Tag[]> => {
  const response = await fetch(`${base}/api/tags`);
  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) throw new Error("Не удалось загрузить теги");
  return response.json();
};

export const createTag = async (name: string): Promise<Tag> => {
  const response = await fetch(`${base}/api/tags`, {
    method: "POST",
    body: JSON.stringify({ name }),
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Не удалось добавить тег");
  return response.json();
};

export const renameTag = async (id: number, name: string): Promise<Tag> => {
  const response = await fetch(`${base}/api/tags/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
    headers: { "Content-Type": "application/json" },
  });
  if (response.status === 409) throw new Error("Тег с таким именем уже есть");
  if (!response.ok) throw new Error("Не удалось переименовать тег");
  return response.json();
};

export const deleteTag = async (id: number) => {
  const response = await fetch(`${base}/api/tags/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Не удалось удалить тег");
};
