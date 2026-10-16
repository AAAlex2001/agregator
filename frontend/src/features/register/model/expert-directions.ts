import type { DirectionCode } from "@/entities/direction";
import type { ExpertRegistration } from "./expert";

/** Возвращает выбранные направления для проверки формы и публичной карты. */
export function getExpertDirections(value: ExpertRegistration): DirectionCode[] {
  const directions: DirectionCode[] = [];

  if (value.expertise) directions.push("EXPERTISE");
  if (value.audit.profile) directions.push("AUDIT_SUPB");
  if (value.techDiag.profile) directions.push("TECH_DIAG");
  if (value.design.profile) directions.push("DESIGN");
  if (value.ecology.profile) directions.push("ECOLOGY");
  if (value.survey.profile) directions.push("SURVEY");
  if (value.research) directions.push("RESEARCH");
  if (value.laboratory) directions.push("LABORATORY");
  if (value.cadastral.profile) directions.push("CADASTRAL");
  if (value.forensic.profile) directions.push("FORENSIC");

  return directions;
}

