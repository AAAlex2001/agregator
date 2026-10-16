import type { FormEvent } from "react";
import type { ExpertCertificate, ExpertiseType } from "@/entities/expertise";
import type {
  CurrentJobStatus,
  EmploymentTerm,
  EmploymentType,
} from "@/entities/labor";

/** Как организация задаёт требование: точное удостоверение или любой исполнитель вида. */
export type ExpertiseMode = "EXACT" | "GENERAL";

/** Черновик объявления до отправки на сервер. */
export interface LaborListingFields {
  expertiseMode: ExpertiseMode;
  certificateCodes: string[];
  expertiseTypes: ExpertiseType[];
  category: string;
  otherProfession: boolean;
  otherProfessionText: string;
  region: string;
  term: EmploymentTerm;
  fixedTerm: string;
  startDate: string;
  employmentType: EmploymentType;
  jobStatus: CurrentJobStatus;
}

/** Строковые поля черновика; выбор вариантов меняется отдельными действиями. */
export type LaborTextField =
  | "category"
  | "otherProfessionText"
  | "region"
  | "fixedTerm"
  | "startDate";

/** Отправленные данные и идентификатор, который повторяется при повторе тех же данных. */
export interface PendingLaborRequest {
  fingerprint: string;
  id: string;
}

/** Черновик, состояние отправки и последний неподтверждённый запрос. */
export interface LaborListingFormState {
  fields: LaborListingFields;
  isSubmitting: boolean;
  pendingRequest: PendingLaborRequest | null;
}

/** Удостоверения из анкеты ЭПБ и результат их загрузки. */
export interface ProfileCertificates {
  certificates: ExpertCertificate[];
  isLoading: boolean;
  hasError: boolean;
}

/** Черновик объявления, удостоверения из анкеты и действия заполнения и публикации. */
export interface LaborListingForm {
  state: LaborListingFormState;
  region: string;
  profile: ProfileCertificates;
  changeField: (field: LaborTextField, value: string) => void;
  changeMode: (mode: ExpertiseMode) => void;
  changeCodes: (codes: string[]) => void;
  changeTypes: (types: ExpertiseType[]) => void;
  changeOtherProfession: (enabled: boolean) => void;
  changeTerm: (term: EmploymentTerm) => void;
  changeEmploymentType: (employmentType: EmploymentType) => void;
  changeJobStatus: (jobStatus: CurrentJobStatus) => void;
  submit: (event: FormEvent<HTMLFormElement>) => void;
}

/** Изменения черновика и результаты публикации объявления. */
export type LaborListingFormAction =
  | { type: "field/changed"; field: LaborTextField; value: string }
  | { type: "mode/changed"; mode: ExpertiseMode }
  | { type: "codes/changed"; codes: string[] }
  | { type: "types/changed"; types: ExpertiseType[] }
  | { type: "other-profession/changed"; enabled: boolean }
  | { type: "term/changed"; term: EmploymentTerm }
  | { type: "employment-type/changed"; employmentType: EmploymentType }
  | { type: "job-status/changed"; jobStatus: CurrentJobStatus }
  | { type: "submit/started"; request: PendingLaborRequest }
  | { type: "submit/succeeded" }
  | { type: "submit/failed" };
