import { z } from "zod";
import {
  auditCustomerProfileSchema,
  auditExpertProfileSchema,
  auditLicenseHolderProfileSchema,
} from "@/source/features/directions/audit";
import { cadastralProfileSchema } from "@/source/features/directions/cadastral";
import { expertiseProfileSchema } from "@/source/features/directions/expertise";
import { forensicProfileSchema } from "@/source/features/directions/forensic";
import { laboratoryProfileSchema } from "@/source/features/directions/laboratory";
import { researchProfileSchema } from "@/source/features/directions/research";
import { firstSchemaError } from "@/source/features/directions/shared/model/validate";
import type { RegisterFormValues } from "./fields";

export function validateDirections(data: RegisterFormValues, ctx: z.RefinementCtx): void {
  const checks = [
    { path: "expertiseProfile", message: data.expertiseProfile && firstSchemaError(expertiseProfileSchema, data.expertiseProfile) },
    { path: "auditExpertProfile", message: data.auditExpertProfile && firstSchemaError(auditExpertProfileSchema, data.auditExpertProfile) },
    { path: "auditCustomerProfile", message: data.auditCustomerProfile && firstSchemaError(auditCustomerProfileSchema, data.auditCustomerProfile) },
    { path: "auditLicenseHolderProfile", message: data.auditLicenseHolderProfile && firstSchemaError(auditLicenseHolderProfileSchema, data.auditLicenseHolderProfile) },
    { path: "cadastralProfile", message: data.cadastralProfile && firstSchemaError(cadastralProfileSchema, data.cadastralProfile) },
    { path: "forensicProfile", message: data.forensicProfile && firstSchemaError(forensicProfileSchema, data.forensicProfile) },
    { path: "researchProfile", message: data.researchProfile && firstSchemaError(researchProfileSchema, data.researchProfile) },
    { path: "laboratoryProfile", message: data.laboratoryProfile && firstSchemaError(laboratoryProfileSchema, data.laboratoryProfile) },
  ];
  for (const check of checks) {
    if (check.message) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [check.path], message: check.message });
    }
  }
}
