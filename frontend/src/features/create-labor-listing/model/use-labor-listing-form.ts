"use client";

import { useReducer } from "react";
import type { FormEvent } from "react";
import type { ExpertiseType } from "@/entities/expertise";
import { createLaborListing } from "@/entities/labor";
import type {
  CurrentJobStatus,
  EmploymentTerm,
  EmploymentType,
  LaborListingKind,
} from "@/entities/labor";
import { useUser } from "@/entities/user";
import { useNotifications } from "@/shared/ui/notifications";
import { createLaborListingRequest } from "./listing-request";
import { INITIAL_LABOR_LISTING_FORM, laborListingFormReducer } from "./reducer";
import type { ExpertiseMode, LaborListingForm, LaborTextField } from "./types";
import { useProfileCertificates } from "./use-profile-certificates";
import { validateLaborListing } from "./validate-listing";

/** Хранит черновик объявления и публикует его от имени текущего аккаунта. */
export function useLaborListingForm(
  kind: LaborListingKind,
  onCreated: () => void,
): LaborListingForm {
  const { user } = useUser();
  const { showSuccess, showError } = useNotifications();
  const [state, dispatch] = useReducer(laborListingFormReducer, INITIAL_LABOR_LISTING_FORM);
  const profile = useProfileCertificates(kind === "EXPERT_AVAILABLE");
  const region = state.fields.region || user?.expert?.location_city || "";

  /** Обновляет одно строковое поле черновика. */
  function changeField(field: LaborTextField, value: string) {
    dispatch({ type: "field/changed", field, value });
  }

  /** Переключает точное удостоверение и любой исполнитель вида. */
  function changeMode(mode: ExpertiseMode) {
    dispatch({ type: "mode/changed", mode });
  }

  /** Сохраняет выбранные коды удостоверений. */
  function changeCodes(codes: string[]) {
    dispatch({ type: "codes/changed", codes });
  }

  /** Сохраняет выбранные виды экспертизы. */
  function changeTypes(types: ExpertiseType[]) {
    dispatch({ type: "types/changed", types });
  }

  /** Включает описание иной профессии вместо удостоверений. */
  function changeOtherProfession(enabled: boolean) {
    dispatch({ type: "other-profession/changed", enabled });
  }

  /** Выбирает постоянную работу или срочный договор. */
  function changeTerm(term: EmploymentTerm) {
    dispatch({ type: "term/changed", term });
  }

  /** Выбирает основное место работы или совместительство. */
  function changeEmploymentType(employmentType: EmploymentType) {
    dispatch({ type: "employment-type/changed", employmentType });
  }

  /** Сохраняет текущую занятость исполнителя. */
  function changeJobStatus(jobStatus: CurrentJobStatus) {
    dispatch({ type: "job-status/changed", jobStatus });
  }

  /** Проверяет и публикует объявление; при ошибке сохраняет черновик. */
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (state.isSubmitting) {
      return;
    }

    const request = createLaborListingRequest(
      kind,
      state.fields,
      region,
      profile.certificates,
    );
    const problem = validateLaborListing(request, state.fields.otherProfession);

    if (problem) {
      showError(problem);
      return;
    }

    const fingerprint = JSON.stringify(request);
    const pendingRequest = state.pendingRequest?.fingerprint === fingerprint
      ? state.pendingRequest
      : { fingerprint, id: crypto.randomUUID() };

    dispatch({ type: "submit/started", request: pendingRequest });

    try {
      await createLaborListing(request, pendingRequest.id);
      dispatch({ type: "submit/succeeded" });
      showSuccess("Заявка опубликована");
      onCreated();
    } catch (error) {
      dispatch({ type: "submit/failed" });
      showError(error instanceof Error ? error.message : "Не удалось создать заявку");
    }
  }

  return {
    state,
    region,
    profile,
    changeField,
    changeMode,
    changeCodes,
    changeTypes,
    changeOtherProfession,
    changeTerm,
    changeEmploymentType,
    changeJobStatus,
    submit,
  };
}
