import type { LiningReportFormAction, LiningReportFormState } from "./types";

/** Пустой черновик: значения по умолчанию берутся из справочника. */
export const INITIAL_LINING_REPORT_FORM: LiningReportFormState = {
  selections: {},
  elementCategories: {},
  expertScores: {},
  serviceLife: "5",
  reportName: "Оценка крепи горной выработки",
  header: {
    author: "",
    intro_line1: "",
    intro_line2: "",
    intro_line3: "",
    justification: "",
    manufacturer: "",
  },
  isSubmitting: false,
};

/** Хранит выбор эксперта поверх значений справочника и поля шапки PDF. */
export function liningReportFormReducer(
  state: LiningReportFormState,
  action: LiningReportFormAction,
): LiningReportFormState {
  switch (action.type) {
    case "option/select":
      return {
        ...state,
        selections: {
          ...state.selections,
          [action.code]: action.value,
        },
      };
    case "element/select":
      return {
        ...state,
        elementCategories: {
          ...state.elementCategories,
          [action.elementId]: action.category,
        },
      };
    case "score/select":
      return {
        ...state,
        expertScores: {
          ...state.expertScores,
          [action.criterionId]: action.score,
        },
      };
    case "service-life/change":
      return {
        ...state,
        serviceLife: action.serviceLife,
      };
    case "report-name/change":
      return {
        ...state,
        reportName: action.reportName,
      };
    case "header/change":
      return {
        ...state,
        header: {
          ...state.header,
          [action.field]: action.value,
        },
      };
    case "submit/start":
      return {
        ...state,
        isSubmitting: true,
      };
    case "submit/finish":
      return {
        ...state,
        isSubmitting: false,
      };
  }
}
