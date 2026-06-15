import { z } from "zod";
import { TYPES, type ExpertiseType } from "@/source/entities/expertise";

const expertiseTypeSchema = z.custom<ExpertiseType>(
  (val) => typeof val === "string" && (TYPES as readonly string[]).includes(val as string),
  "Недопустимый код области",
);

export const licenseTermsSchema = z
  .object({
    licenseNumber: z.string().trim().min(1, "Укажите номер лицензии"),
    licenseAreas: z.array(expertiseTypeSchema).min(1, "Выберите хотя бы один объект экспертизы"),
    rentalKind: z.enum(["PERCENT", "FIXED", "NEGOTIABLE"]),
    rentalPercent: z.string().trim(),
    rentalFixedAmount: z.string().trim(),
    miningLicenseNumber: z.string().trim().max(100, "Слишком длинный номер"),
    labAccreditationNumber: z.string().trim().max(100, "Слишком длинный номер"),
  })
  .superRefine((data, ctx) => {
    if (data.rentalKind === "PERCENT") {
      const num = Number(data.rentalPercent.replace(",", "."));
      if (!data.rentalPercent || !Number.isFinite(num) || num <= 0 || num > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["rentalPercent"],
          message: "Укажите процент от 0 до 100",
        });
      }
    }
    if (data.rentalKind === "FIXED") {
      const num = Number(data.rentalFixedAmount.replace(/\s/g, ""));
      if (!data.rentalFixedAmount || !Number.isFinite(num) || num <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["rentalFixedAmount"],
          message: "Укажите минимальную фиксированную цену",
        });
      }
    }
  });

export type LicenseTermsValues = z.infer<typeof licenseTermsSchema>;
