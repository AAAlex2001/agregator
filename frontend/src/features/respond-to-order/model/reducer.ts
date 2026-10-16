import type { OfferAction, OfferFields } from "./types";

/** Начальное предложение без сроков, цены, комментария и выбранной организации. */
export const INITIAL_OFFER_FIELDS: OfferFields = {
  startDate: "",
  deadline: "",
  cost: "",
  vatKind: "NONE",
  comment: "",
  companyName: "",
  company: null,
};

/** Меняет поля предложения и оставляет в стоимости только цифры. */
export function offerReducer(
  state: OfferFields,
  action: OfferAction,
): OfferFields {
  switch (action.type) {
    case "field/changed":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "cost/changed":
      return {
        ...state,
        cost: action.value.replace(/\D/g, ""),
      };
    case "vat/changed":
      return {
        ...state,
        vatKind: action.value,
      };
    case "company/changed":
      return {
        ...state,
        companyName: action.name,
        company: action.company,
      };
  }
}
