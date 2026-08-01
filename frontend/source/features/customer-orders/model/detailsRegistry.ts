import { z, type ZodTypeAny } from "zod";
import type { OrderWorkType } from "@/source/entities/order";

export type OrderDetails = Record<string, unknown>;

interface DetailsEntry {
  emptyValue: OrderDetails;
  schema: ZodTypeAny;
}

const REGISTRY: Partial<Record<OrderWorkType, DetailsEntry>> = {
  CADASTRAL: {
    emptyValue: { work_location: "" },
    schema: z.object({
      work_location: z
        .string()
        .trim()
        .min(1, "Укажите, где необходимо провести работы")
        .max(500, "Не более 500 символов"),
    }),
  },
  FORENSIC: {
    emptyValue: { government_body: "", expert_requirements: "", subject_location: "" },
    schema: z.object({
      government_body: z
        .string()
        .trim()
        .min(1, "Укажите государственный орган")
        .max(500, "Не более 500 символов"),
      expert_requirements: z
        .string()
        .trim()
        .min(1, "Укажите требования к эксперту")
        .max(5000, "Не более 5000 символов"),
      subject_location: z
        .string()
        .trim()
        .min(1, "Укажите, где находится предмет экспертизы")
        .max(500, "Не более 500 символов"),
    }),
  },
  RESEARCH: {
    emptyValue: { executor_requirements: [""], needs_site_visit: false },
    schema: z.object({
      executor_requirements: z
        .array(z.string())
        .max(20, "Не более 20 требований к исполнителю"),
      needs_site_visit: z.boolean(),
    }),
  },
  LABORATORY: {
    emptyValue: { equipment_requirements: "" },
    schema: z.object({
      equipment_requirements: z.string().trim().max(5000, "Не более 5000 символов"),
    }),
  },
};

export function hasOrderDetails(workType: OrderWorkType): boolean {
  return workType in REGISTRY;
}

export function emptyDetailsFor(workType: OrderWorkType): OrderDetails {
  const entry = REGISTRY[workType];
  return entry ? structuredClone(entry.emptyValue) : {};
}

export function validateOrderDetails(workType: OrderWorkType, value: OrderDetails): string | null {
  const entry = REGISTRY[workType];
  if (!entry) return null;
  const result = entry.schema.safeParse(value);
  return result.success ? null : result.error.issues[0].message;
}

export function normalizeDetails(workType: OrderWorkType, value: OrderDetails): OrderDetails {
  const empty = emptyDetailsFor(workType);
  const expected = Object.keys(empty);
  if (!expected.length) return {};
  if (expected.some((key) => !(key in value))) return empty;
  return Object.fromEntries(expected.map((key) => [key, value[key]]));
}
