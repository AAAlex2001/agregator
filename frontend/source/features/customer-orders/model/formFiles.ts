import type { OrderDocuments } from "@/source/entities/order";
import { MAX_ORDER_DOCUMENTS } from "@/source/entities/order";

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

export type DocumentsFormAction =
  | { type: "SET_SINGLE"; category: "technical" | "contract" | "company"; file: File | null }
  | { type: "REMOVE_SINGLE_EXISTING"; category: "technical" | "contract" | "company" }
  | { type: "ADD_OTHER"; files: File[] }
  | { type: "REMOVE_OTHER_NEW"; index: number }
  | { type: "REMOVE_OTHER_EXISTING"; index: number };

export function initialDocumentsFormState(existing?: OrderDocuments, copySourceOrderId: number | null = null): DocumentsFormState {
  return {
    copySourceOrderId,
    technical: { newFile: null, existing: existing?.technical[0] ?? null },
    contract:  { newFile: null, existing: existing?.contract[0]  ?? null },
    company:   { newFile: null, existing: existing?.company[0]   ?? null },
    other:     { newFiles: [], existing: [...(existing?.other ?? [])] },
  };
}

export function documentsFormReducer(
  state: DocumentsFormState,
  action: DocumentsFormAction,
): DocumentsFormState {
  switch (action.type) {
    case "SET_SINGLE":
      return {
        ...state,
        [action.category]: {
          newFile: action.file,
          existing: action.file ? null : state[action.category].existing,
        },
      };
    case "REMOVE_SINGLE_EXISTING":
      return { ...state, [action.category]: { newFile: state[action.category].newFile, existing: null } };
    case "ADD_OTHER":
      return { ...state, other: { ...state.other, newFiles: [...state.other.newFiles, ...action.files] } };
    case "REMOVE_OTHER_NEW":
      return { ...state, other: { ...state.other, newFiles: state.other.newFiles.filter((_, i) => i !== action.index) } };
    case "REMOVE_OTHER_EXISTING":
      return { ...state, other: { ...state.other, existing: state.other.existing.filter((_, i) => i !== action.index) } };
    default:
      return state;
  }
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
