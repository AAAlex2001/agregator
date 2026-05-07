"use client";

import { createDraftStorage } from "@/source/entities/draft";

export interface ResponseDraft {
  orderId: number;
  orderTitle: string;
  customer: string;
  step: "details" | "tender" | "offer";
  deadline: string;
  cost: string;
  vatKind: string;
  comment: string;
  companyName: string;
  companyData: unknown;
  updatedAt: number;
}

const storage = createDraftStorage<ResponseDraft>("respond-draft");

export const saveDraft = (draft: ResponseDraft): void => storage.save(draft.orderId, draft);
export const loadDraft = (orderId: number): ResponseDraft | null => storage.load(orderId);
export const deleteDraft = (orderId: number): void => storage.remove(orderId);
export const listDrafts = (): ResponseDraft[] =>
  storage.list().sort((a, b) => b.updatedAt - a.updatedAt);
