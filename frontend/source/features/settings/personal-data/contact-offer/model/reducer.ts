import type { ContactOfferAction, ContactOfferState } from "./types";

export const INITIAL_STATE: ContactOfferState = { fields: null, loadError: null, isSaving: false };

export function contactOfferReducer(state: ContactOfferState, action: ContactOfferAction): ContactOfferState {
  switch (action.type) {
    case "load/success":
      return { ...state, fields: action.fields };
    case "load/error":
      return { ...state, loadError: action.error };
    case "fields/change":
      return { ...state, fields: action.fields };
    case "save/start":
      return { ...state, isSaving: true };
    case "save/finish":
      return { ...state, isSaving: false };
    default:
      return state;
  }
}
