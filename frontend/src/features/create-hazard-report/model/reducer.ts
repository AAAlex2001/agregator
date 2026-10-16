import { DEFAULT_HAZARD_REPORT_HEADER } from "../config/report-header";
import type { HazardReportFormAction, HazardReportFormState } from "./types";

/** Пустой черновик: факторы берут значения по умолчанию из справочника. */
export const INITIAL_HAZARD_REPORT_FORM: HazardReportFormState = {
  profile: "rudnik",
  selections: {},
  excludedGroups: [],
  reportName: "Оценка опасности аварий",
  header: DEFAULT_HAZARD_REPORT_HEADER,
  isSubmitting: false,
};

/** Хранит черновик отчёта; другой профиль начинает выбор факторов заново. */
export function hazardReportFormReducer(
  state: HazardReportFormState,
  action: HazardReportFormAction,
): HazardReportFormState {
  switch (action.type) {
    case "profile/change":
      return {
        ...state,
        profile: action.profile,
        selections: {},
        excludedGroups: [],
      };
    case "option/select":
      return {
        ...state,
        selections: {
          ...state.selections,
          [action.code]: action.value,
        },
      };
    case "group/toggle":
      return {
        ...state,
        excludedGroups: state.excludedGroups.includes(action.group)
          ? state.excludedGroups.filter((group) => group !== action.group)
          : [...state.excludedGroups, action.group],
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
