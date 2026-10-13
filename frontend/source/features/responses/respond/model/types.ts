import type { PartySuggestion } from "@/source/entities/party";
import type { VatKind } from "@/source/entities/response";

export type RespondStep = "details" | "tender" | "offer";

export interface OfferState {
  startDate: string;
  deadline: string;
  cost: string;
  vatKind: VatKind;
  comment: string;
  companyName: string;
  company: PartySuggestion | null;
}

export type OfferAction =
  | { type: "field"; field: "startDate" | "deadline" | "comment"; value: string }
  | { type: "cost"; value: string }
  | { type: "vatKind"; value: VatKind }
  | { type: "company"; name: string; company: PartySuggestion | null };

export const emptyOffer: OfferState = {
  startDate: "",
  deadline: "",
  cost: "",
  vatKind: "NONE",
  comment: "",
  companyName: "",
  company: null,
};
