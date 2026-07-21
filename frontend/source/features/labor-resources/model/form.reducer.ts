import type {
  CurrentJobStatus,
  EmploymentTerm,
  EmploymentType,
} from "@/source/entities/labor";
import type { LaborFormState } from "./types";

export type LaborFormAction =
  | { type: "AREAS"; value: string[] }
  | { type: "CATEGORY"; value: string }
  | { type: "REGION"; value: string }
  | { type: "TERM"; value: EmploymentTerm }
  | { type: "FIXED_TERM"; value: string }
  | { type: "START_DATE"; value: string }
  | { type: "EMPLOYMENT_TYPE"; value: EmploymentType }
  | { type: "JOB_STATUS"; value: CurrentJobStatus }
  | { type: "SUBMITTING"; value: boolean }
  | { type: "ERROR"; value: string | null }
  | { type: "RESET" };

export function initialLaborFormState(region = ""): LaborFormState {
  return {
    areas: [],
    category: "3",
    region,
    term: "PERMANENT",
    fixedTerm: "",
    startDate: "",
    employmentType: "PRIMARY",
    jobStatus: "NONE",
    submitting: false,
    error: null,
  };
}

export function laborFormReducer(
  state: LaborFormState,
  action: LaborFormAction,
): LaborFormState {
  switch (action.type) {
    case "AREAS":
      return { ...state, areas: action.value };
    case "CATEGORY":
      return { ...state, category: action.value };
    case "REGION":
      return { ...state, region: action.value };
    case "TERM":
      return { ...state, term: action.value };
    case "FIXED_TERM":
      return { ...state, fixedTerm: action.value };
    case "START_DATE":
      return { ...state, startDate: action.value };
    case "EMPLOYMENT_TYPE":
      return { ...state, employmentType: action.value };
    case "JOB_STATUS":
      return { ...state, jobStatus: action.value };
    case "SUBMITTING":
      return { ...state, submitting: action.value };
    case "ERROR":
      return { ...state, error: action.value };
    case "RESET":
      return {
        ...initialLaborFormState(state.region),
        category: state.category,
      };
    default:
      return state;
  }
}
