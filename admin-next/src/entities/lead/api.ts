import { Lead, LeadStatus } from "./model";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const toLead = (raw: any): Lead => ({
  id: raw.id,
  direction: raw.direction,
  name: raw.name,
  phone: raw.phone,
  email: raw.email,
  company: raw.company,
  inn: raw.inn,
  region: raw.region,
  objectName: raw.object_name,
  task: raw.task,
  deadline: raw.deadline,
  budget: raw.budget,
  sourceUrl: raw.source_url,
  comment: raw.comment,
  status: raw.status,
  createdAt: raw.created_at,
});

export const listLeads = async (status?: LeadStatus): Promise<Lead[]> => {
  const qs = status ? `?status=${status}` : "";
  const response = await fetch(`${base}/api/leads${qs}`);
  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) throw new Error("Не удалось загрузить заявки");
  const data = await response.json();
  return data.items.map(toLead);
};

export const updateLead = async (
  id: number,
  patch: { status?: LeadStatus; comment?: string },
): Promise<Lead> => {
  const response = await fetch(`${base}/api/leads/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) throw new Error("Не удалось обновить заявку");
  return toLead(await response.json());
};
