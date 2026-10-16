import type { LaborListingFormAction, LaborListingFormState } from "./types";

/** Пустой черновик: точные удостоверения, постоянная работа, основное место. */
export const INITIAL_LABOR_LISTING_FORM: LaborListingFormState = {
  fields: {
    expertiseMode: "EXACT",
    certificateCodes: [],
    expertiseTypes: [],
    category: "",
    otherProfession: false,
    otherProfessionText: "",
    region: "",
    term: "PERMANENT",
    fixedTerm: "",
    startDate: "",
    employmentType: "PRIMARY",
    jobStatus: "NONE",
  },
  isSubmitting: false,
  pendingRequest: null,
};

/** Меняет черновик; после публикации очищает его, оставляя регион. */
export function laborListingFormReducer(
  state: LaborListingFormState,
  action: LaborListingFormAction,
): LaborListingFormState {
  switch (action.type) {
    case "field/changed":
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.field]: action.value,
        },
      };
    case "mode/changed":
      return {
        ...state,
        fields: {
          ...state.fields,
          expertiseMode: action.mode,
        },
      };
    case "codes/changed":
      return {
        ...state,
        fields: {
          ...state.fields,
          certificateCodes: action.codes,
        },
      };
    case "types/changed":
      return {
        ...state,
        fields: {
          ...state.fields,
          expertiseTypes: action.types,
        },
      };
    case "other-profession/changed":
      return {
        ...state,
        fields: {
          ...state.fields,
          otherProfession: action.enabled,
        },
      };
    case "term/changed":
      return {
        ...state,
        fields: {
          ...state.fields,
          term: action.term,
        },
      };
    case "employment-type/changed":
      return {
        ...state,
        fields: {
          ...state.fields,
          employmentType: action.employmentType,
        },
      };
    case "job-status/changed":
      return {
        ...state,
        fields: {
          ...state.fields,
          jobStatus: action.jobStatus,
        },
      };
    case "submit/started":
      return {
        ...state,
        isSubmitting: true,
        pendingRequest: action.request,
      };
    case "submit/succeeded":
      return {
        ...INITIAL_LABOR_LISTING_FORM,
        fields: {
          ...INITIAL_LABOR_LISTING_FORM.fields,
          region: state.fields.region,
        },
      };
    case "submit/failed":
      return {
        ...state,
        isSubmitting: false,
      };
  }
}
