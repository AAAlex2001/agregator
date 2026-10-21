import type { CommissionFormAction, CommissionFormState } from "./types";

/** Пустая аттестация для выбора. */
const EMPTY_DRAFT = { areaCode: "", objectCode: "", category: "" };

/** Пустая заявка кандидата. */
export const INITIAL_COMMISSION_FORM: CommissionFormState = {
  fullName: "",
  phone: "",
  email: "",
  message: "",
  draft: EMPTY_DRAFT,
  attestations: [],
  isSubmitting: false,
  isSent: false,
};

/** Совпадает ли аттестация с уже добавленной. */
function isDuplicate(state: CommissionFormState): boolean {
  return state.attestations.some(
    (item) => item.area_code === state.draft.areaCode
      && item.object_code === state.draft.objectCode
      && item.category === Number(state.draft.category),
  );
}

/** Черновик заявки: контакты и список аттестаций без повторов. */
export function commissionFormReducer(
  state: CommissionFormState,
  action: CommissionFormAction,
): CommissionFormState {
  switch (action.type) {
    case "contact/change":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "draft/change":
      return {
        ...state,
        draft: action.draft,
      };
    case "attestation/add":
      if (isDuplicate(state)) {
        return { ...state, draft: EMPTY_DRAFT };
      }

      return {
        ...state,
        draft: EMPTY_DRAFT,
        attestations: [
          ...state.attestations,
          {
            area_code: state.draft.areaCode,
            object_code: state.draft.objectCode,
            category: Number(state.draft.category),
          },
        ],
      };
    case "attestation/remove":
      return {
        ...state,
        attestations: state.attestations.filter((item, index) => index !== action.index),
      };
    case "submit/start":
      return {
        ...state,
        isSubmitting: true,
      };
    case "submit/success":
      return {
        ...INITIAL_COMMISSION_FORM,
        isSent: true,
      };
    case "submit/error":
      return {
        ...state,
        isSubmitting: false,
      };
  }
}
