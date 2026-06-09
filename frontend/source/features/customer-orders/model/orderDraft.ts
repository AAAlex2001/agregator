import { createDraftStorage } from "@/source/entities/draft";
import type { OrderFormValues } from "./schema";

const FIXED_ID = 0;
const storage = createDraftStorage<OrderFormValues>("create-order-draft");

export const loadDraft = (): OrderFormValues | null => storage.load(FIXED_ID);
export const saveDraft = (values: OrderFormValues): void => storage.save(FIXED_ID, values);
export const clearDraft = (): void => storage.remove(FIXED_ID);
