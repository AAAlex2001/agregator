"use client";

const PREFIX = "respond-draft:";

export interface ResponseDraft {
  orderId: number;
  orderTitle: string;
  customer: string;
  deadline: string;
  cost: string;
  vatKind: string;
  comment: string;
  companyName: string;
  companyData: unknown;
  updatedAt: number;
}

function key(orderId: number): string {
  return `${PREFIX}${orderId}`;
}

export function saveDraft(draft: ResponseDraft): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key(draft.orderId), JSON.stringify(draft));
  } catch {
    /* ignore quota errors */
  }
}

export function loadDraft(orderId: number): ResponseDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key(orderId));
    if (!raw) return null;
    return JSON.parse(raw) as ResponseDraft;
  } catch {
    return null;
  }
}

export function deleteDraft(orderId: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key(orderId));
  } catch {
    /* ignore */
  }
}

export function listDrafts(): ResponseDraft[] {
  if (typeof window === "undefined") return [];
  const drafts: ResponseDraft[] = [];
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k || !k.startsWith(PREFIX)) continue;
      const raw = window.localStorage.getItem(k);
      if (!raw) continue;
      try {
        drafts.push(JSON.parse(raw) as ResponseDraft);
      } catch {
        /* skip invalid */
      }
    }
  } catch {
    /* ignore */
  }
  return drafts.sort((a, b) => b.updatedAt - a.updatedAt);
}
