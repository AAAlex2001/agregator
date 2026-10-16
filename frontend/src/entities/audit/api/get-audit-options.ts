import { request } from "@/shared/api/request";
import type { AuditOptions } from "../model/types";

/** Один код и его название в ответе справочника аудита. */
interface AuditOptionResponse {
  code: string;
  title: string;
}

/** Справочники аудита в исходных именах полей API. */
interface AuditOptionsResponse {
  industrial_safety_areas: AuditOptionResponse[];
  expert_attestation_areas: AuditOptionResponse[];
  audit_qualifications: AuditOptionResponse[];
  accreditation_areas: AuditOptionResponse[];
  audit_areas: AuditOptionResponse[];
}

/** Загружает варианты аттестации, квалификации и аккредитации для анкет аудита. */
export async function getAuditOptions(): Promise<AuditOptions> {
  const response = await request("/directions/audit/catalogs", {
    errorMessage: "Не удалось загрузить справочники аудита",
  });
  const options: AuditOptionsResponse = await response.json();

  return {
    industrialSafetyAreas: options.industrial_safety_areas.map((item) => ({
      value: item.code,
      label: item.title,
    })),
    expertAttestationAreas: options.expert_attestation_areas.map((item) => ({
      value: item.code,
      label: item.title,
    })),
    auditQualifications: options.audit_qualifications.map((item) => ({
      value: item.code,
      label: item.title,
    })),
    accreditationAreas: options.accreditation_areas.map((item) => ({
      value: item.code,
      label: item.title,
    })),
    auditAreas: options.audit_areas.map((item) => ({
      value: item.code,
      label: item.title,
    })),
  };
}
