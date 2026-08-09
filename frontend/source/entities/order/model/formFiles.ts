import { MAX_ORDER_DOCUMENTS, type OrderDocuments } from "./types";

export interface SingleFileSlot {
  newFile: File | null;
  existing: string | null;
}

export interface OtherFilesSlot {
  newFiles: File[];
  existing: string[];
}

export interface DocumentsFormState {
  copySourceOrderId: number | null;
  technical: SingleFileSlot;
  contract: SingleFileSlot;
  company: SingleFileSlot;
  other: OtherFilesSlot;
}

export function initialDocumentsFormState(existing?: OrderDocuments, copySourceOrderId: number | null = null): DocumentsFormState {
  return {
    copySourceOrderId,
    technical: { newFile: null, existing: existing?.technical[0] ?? null },
    contract:  { newFile: null, existing: existing?.contract[0]  ?? null },
    company:   { newFile: null, existing: existing?.company[0]   ?? null },
    other:     { newFiles: [], existing: [...(existing?.other ?? [])] },
  };
}

export function singleSlotIsFilled(slot: SingleFileSlot): boolean {
  return slot.newFile !== null || slot.existing !== null;
}

export function totalDocumentsCount(state: DocumentsFormState): number {
  return [state.technical, state.contract, state.company].filter(singleSlotIsFilled).length
    + state.other.newFiles.length + state.other.existing.length;
}

export function freeSlots(state: DocumentsFormState): number {
  return Math.max(0, MAX_ORDER_DOCUMENTS - totalDocumentsCount(state));
}

export function canAddMoreOther(state: DocumentsFormState): boolean {
  return freeSlots(state) > 0;
}

export function totalNewFilesBytes(state: DocumentsFormState): number {
  const singles = [state.technical, state.contract, state.company]
    .map((slot) => slot.newFile?.size ?? 0)
    .reduce((acc, size) => acc + size, 0);
  const others = state.other.newFiles.reduce((acc, file) => acc + file.size, 0);
  return singles + others;
}
