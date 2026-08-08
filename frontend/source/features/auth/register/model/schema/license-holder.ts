import { z } from "zod";
import { requireCompany } from "./common";
import type { RegisterFormValues } from "./fields";

export function validateLicenseHolder(data: RegisterFormValues, ctx: z.RefinementCtx): void {
  requireCompany(data, ctx);
  validatePermits(data, ctx);
}

function validatePermits(data: RegisterFormValues, ctx: z.RefinementCtx): void {
  if (!data.licenseEnabled && data.auditLicenseHolderProfile === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["licenseEnabled"],
      message: "Выберите хотя бы один разрешительный документ",
    });
    return;
  }
  if (data.licenseEnabled) validateEpbLicense(data, ctx);
}

function validateEpbLicense(data: RegisterFormValues, ctx: z.RefinementCtx): void {
  if (!data.licenseNumber) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["licenseNumber"],
      message: "Укажите номер лицензии",
    });
  }
  if (!data.licenseAreas.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["licenseAreas"],
      message: "Выберите хотя бы один объект экспертизы",
    });
  }
  if (data.rentalKind === "PERCENT") {
    const percent = Number(data.rentalPercent.replace(",", "."));
    if (!data.rentalPercent || !Number.isFinite(percent) || percent <= 0 || percent > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rentalPercent"],
        message: "Укажите процент от 0 до 100",
      });
    }
  }
  if (data.rentalKind === "FIXED") {
    const amount = Number(data.rentalFixedAmount.replace(/\s/g, ""));
    if (!data.rentalFixedAmount || !Number.isFinite(amount) || amount <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rentalFixedAmount"],
        message: "Укажите минимальную фиксированную цену",
      });
    }
  }
}
