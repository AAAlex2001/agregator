import type { OrderFormValues } from "./schema";

const KEY = "create-order-form-draft";

const safeParse = (raw: string | null): OrderFormValues | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && parsed.selectionsByType
      ? (parsed as OrderFormValues)
      : null;
  } catch {
    return null;
  }
};

const storage = () => (typeof window === "undefined" ? null : window.localStorage);

export const loadDraft = () => safeParse(storage()?.getItem(KEY) ?? null);
export const hasDraft = () => loadDraft() !== null;
export const saveDraft = (values: OrderFormValues) => storage()?.setItem(KEY, JSON.stringify(values));
export const clearDraft = () => storage()?.removeItem(KEY);
