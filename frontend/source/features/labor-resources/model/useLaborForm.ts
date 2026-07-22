"use client";

import {
  useEffect,
  useReducer,
  type FormEvent,
} from "react";
import {
  createLaborListing,
  type CurrentJobStatus,
  type EmploymentTerm,
  type EmploymentType,
  type LaborCertificate,
  type LaborListingPayload,
} from "@/source/entities/labor";
import type { ExpertiseType } from "@/source/entities/expertise";
import { useSession } from "@/source/features/session";
import { buildExpertiseRequirements } from "../lib/expertiseRequirements";
import { LABOR_PAGE_COPY } from "./config";
import {
  initialLaborFormState,
  laborFormReducer,
} from "./form.reducer";
import type {
  LaborExpertiseMode,
  LaborPageMode,
} from "./types";

interface UseLaborFormOptions {
  mode: LaborPageMode;
  onCreated: () => void;
}

export function useLaborForm({
  mode,
  onCreated,
}: UseLaborFormOptions) {
  const { user } = useSession();
  const [state, dispatch] = useReducer(
    laborFormReducer,
    user?.location_city ?? "",
    initialLaborFormState,
  );

  const copy = LABOR_PAGE_COPY[mode];
  const profileCertificates = (
    user?.expert_certificates ?? []
  ) as LaborCertificate[];
  const selectedCertificates = buildExpertiseRequirements({
    mode: state.expertiseMode,
    certificateCodes: state.certificateCodes,
    expertiseTypes: state.expertiseTypes,
    category: state.category,
  });
  const certificates =
    mode === "expert" && profileCertificates.length > 0
      ? profileCertificates
      : state.otherProfession
        ? []
        : selectedCertificates;

  useEffect(() => {
    if (!state.region && user?.location_city) {
      dispatch({ type: "REGION", value: user.location_city });
    }
  }, [state.region, user?.location_city]);

  const validate = () => {
    if (!state.region.trim()) {
      return "Укажите регион фактического проживания";
    }
    if (state.otherProfession) {
      if (!state.otherProfessionText.trim()) {
        return "Опишите, кого вы ищете";
      }
    } else if (certificates.length === 0) {
      return "Выберите удостоверение или вид экспертизы";
    }
    if (state.term === "FIXED" && !state.fixedTerm.trim()) {
      return "Укажите срок срочного договора";
    }
    if (mode === "license" && !state.startDate) {
      return "Укажите дату выхода на работу";
    }
    return null;
  };

  const buildPayload = (): LaborListingPayload => ({
    kind: copy.ownKind,
    certificates,
    other_profession: state.otherProfession
      ? state.otherProfessionText.trim()
      : null,
    region: state.region.trim(),
    employment_term: state.term,
    fixed_term:
      state.term === "FIXED" ? state.fixedTerm.trim() : null,
    start_date:
      mode === "license" ? state.startDate.slice(0, 10) : null,
    employment_type:
      mode === "license" ? state.employmentType : null,
    current_job_status:
      mode === "expert" ? state.jobStatus : null,
  });

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch({ type: "ERROR", value: null });

    const validationError = validate();
    if (validationError) {
      dispatch({ type: "ERROR", value: validationError });
      return;
    }

    dispatch({ type: "SUBMITTING", value: true });

    try {
      await createLaborListing(buildPayload());
      dispatch({ type: "RESET" });
      onCreated();
    } catch (reason) {
      dispatch({
        type: "ERROR",
        value:
          reason instanceof Error
            ? reason.message
            : "Не удалось создать заявку",
      });
    } finally {
      dispatch({ type: "SUBMITTING", value: false });
    }
  };

  return {
    ...state,
    copy,
    certificates,
    profileCertificates,
    submit,
    setExpertiseMode: (value: LaborExpertiseMode) =>
      dispatch({ type: "EXPERTISE_MODE", value }),
    setCertificateCodes: (value: string[]) =>
      dispatch({ type: "CERTIFICATE_CODES", value }),
    setExpertiseTypes: (value: ExpertiseType[]) =>
      dispatch({ type: "EXPERTISE_TYPES", value }),
    setCategory: (value: string) =>
      dispatch({ type: "CATEGORY", value }),
    setOtherProfession: (value: boolean) =>
      dispatch({ type: "OTHER_PROFESSION", value }),
    setOtherProfessionText: (value: string) =>
      dispatch({ type: "OTHER_PROFESSION_TEXT", value }),
    setRegion: (value: string) =>
      dispatch({ type: "REGION", value }),
    setTerm: (value: EmploymentTerm) =>
      dispatch({ type: "TERM", value }),
    setFixedTerm: (value: string) =>
      dispatch({ type: "FIXED_TERM", value }),
    setStartDate: (value: string) =>
      dispatch({ type: "START_DATE", value }),
    setEmploymentType: (value: EmploymentType) =>
      dispatch({ type: "EMPLOYMENT_TYPE", value }),
    setJobStatus: (value: CurrentJobStatus) =>
      dispatch({ type: "JOB_STATUS", value }),
  };
}
