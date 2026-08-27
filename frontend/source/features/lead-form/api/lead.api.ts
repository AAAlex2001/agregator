import { API_URL } from "@/source/shared/api/config";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import type { LeadFormValues } from "../model/types";

export async function submitLead(values: LeadFormValues, sourceUrl: string): Promise<void> {
  const response = await fetch(`${API_URL}/public/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      direction: values.direction,
      name: values.name,
      phone: values.phone,
      email: values.email,
      company: values.company,
      inn: values.inn,
      region: values.region,
      work_kinds: values.workKinds.join(", "),
      object_name: values.objectName,
      task: values.task,
      deadline: values.deadline,
      budget: values.budget,
      source_url: sourceUrl,
    }),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response, "Не удалось отправить заявку"));
}
