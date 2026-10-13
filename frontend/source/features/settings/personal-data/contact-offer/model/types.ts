export interface ContactOfferFields {
  enabled: boolean;
  price: string;
  paymentDetails: string;
  consent: boolean;
}

export interface ContactOfferState {
  fields: ContactOfferFields | null;
  loadError: string | null;
  isSaving: boolean;
}

export type ContactOfferAction =
  | { type: "load/success"; fields: ContactOfferFields }
  | { type: "load/error"; error: string }
  | { type: "fields/change"; fields: ContactOfferFields }
  | { type: "save/start" }
  | { type: "save/finish" };
