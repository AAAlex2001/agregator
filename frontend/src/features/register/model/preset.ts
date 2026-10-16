import {
  createAuditCustomerProfileValues,
  createAuditExpertProfileValues,
  createAuditHolderProfileValues,
} from "@/entities/audit";
import { createCadastralProfileValues } from "@/entities/cadastral";
import { createDesignProfileValues } from "@/entities/design";
import type { DirectionCode } from "@/entities/direction";
import { createEcologyProfileValues } from "@/entities/ecology";
import { createExpertiseProfileValues } from "@/entities/expertise";
import { createForensicProfileValues } from "@/entities/forensic";
import { createLaboratoryProfileValues } from "@/entities/laboratory";
import { createResearchProfileValues } from "@/entities/research";
import { createSroProfileValues } from "@/entities/sro";
import { createSurveyProfileValues } from "@/entities/survey";
import { createTechDiagHolderProfile, createTechDiagProfileValues } from "@/entities/tech-diag";
import type { ExpertRegistration } from "./expert";
import type { HolderRegistration } from "./holder";
import type { RegisterState, RegistrationPreset } from "./types";

/** Заполняет только анкету направления, с которого исполнитель открыл регистрацию. */
function selectExpertDirection(
  expert: ExpertRegistration,
  direction: DirectionCode,
): ExpertRegistration {
  switch (direction) {
    case "EXPERTISE":
      return { ...expert, expertise: createExpertiseProfileValues() };
    case "AUDIT_SUPB":
      return {
        ...expert,
        audit: { ...expert.audit, profile: createAuditExpertProfileValues() },
      };
    case "CADASTRAL":
      return {
        ...expert,
        cadastral: { ...expert.cadastral, profile: createCadastralProfileValues() },
      };
    case "FORENSIC":
      return {
        ...expert,
        forensic: { ...expert.forensic, profile: createForensicProfileValues() },
      };
    case "RESEARCH":
      return { ...expert, research: createResearchProfileValues() };
    case "LABORATORY":
      return { ...expert, laboratory: createLaboratoryProfileValues() };
    case "TECH_DIAG":
      return {
        ...expert,
        techDiag: { ...expert.techDiag, profile: createTechDiagProfileValues() },
      };
    case "DESIGN":
      return {
        ...expert,
        design: { ...expert.design, profile: createDesignProfileValues() },
      };
    case "SURVEY":
      return {
        ...expert,
        survey: { ...expert.survey, profile: createSurveyProfileValues() },
      };
    case "ECOLOGY":
      return {
        ...expert,
        ecology: { ...expert.ecology, profile: createEcologyProfileValues() },
      };
  }
}

/** Выбирает лицензию, членство СРО или направление держателя со страницы входа. */
function selectHolderDirection(
  holder: HolderRegistration,
  direction: DirectionCode,
): HolderRegistration {
  switch (direction) {
    case "EXPERTISE":
      return {
        ...holder,
        license: { ...holder.license, enabled: true },
      };
    case "AUDIT_SUPB":
      return { ...holder, audit: createAuditHolderProfileValues() };
    case "TECH_DIAG":
      return { ...holder, techDiag: createTechDiagHolderProfile() };
    case "DESIGN":
      return { ...holder, design: createSroProfileValues() };
    case "SURVEY":
      return { ...holder, survey: createSroProfileValues() };
    case "ECOLOGY":
      return holder;
    default:
      return { ...holder, directions: [direction] };
  }
}

/** Применяет выбор со страницы, сохраняя особые анкеты каждой роли. */
export function applyRegistrationPreset(
  state: RegisterState,
  preset: RegistrationPreset,
): RegisterState {
  const direction = preset.direction;

  if (!direction) {
    return state;
  }

  if (preset.role === "EXPERT") {
    return {
      ...state,
      expert: selectExpertDirection(state.expert, direction),
    };
  }

  if (preset.role === "LICENSE_HOLDER") {
    return {
      ...state,
      holder: selectHolderDirection(state.holder, direction),
    };
  }

  return {
    ...state,
    customer: direction === "AUDIT_SUPB"
      ? { directions: [], audit: createAuditCustomerProfileValues() }
      : { directions: [direction], audit: null },
  };
}

