import { z } from "zod";

export const expertiseExpertSchema = z.object({
  certificates: z
    .array(
      z.object({
        area: z.string().trim().min(1),
        object: z.string().trim().min(1),
        category: z.string().trim().min(1),
      }),
    )
    .min(1, "Добавьте хотя бы одну область аттестации"),
  show_on_map: z.boolean(),
  map_fields: z.array(z.string()),
});

export const auditCustomerSchema = z.object({
  position: z.string().trim().max(200, "Не более 200 символов"),
  opo_license_number: z.string().trim().max(100, "Не более 100 символов"),
});

export const auditExpertSchema = z
  .object({
    participant_kind: z.enum(["AUDITOR", "INSPECTION_BODY"]),
    industrial_safety_areas: z.array(z.string()),
    expert_attestation_areas: z.array(z.string()),
    audit_qualifications: z.array(z.string()),
    full_name: z.string().trim().max(500, "Не более 500 символов"),
    short_name: z.string().trim().max(300, "Не более 300 символов"),
    inn: z.string().trim().regex(/^$|^\d{10}$|^\d{12}$/, "ИНН должен содержать 10 или 12 цифр"),
    certificate_number: z.string().trim().max(100, "Не более 100 символов"),
    accreditation_areas: z.array(z.string()),
  })
  .superRefine((data, ctx) => {
    if (data.participant_kind === "AUDITOR") {
      const hasAttestation =
        data.industrial_safety_areas.length ||
        data.expert_attestation_areas.length ||
        data.audit_qualifications.length;
      if (!hasAttestation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["audit_qualifications"],
          message: "Укажите хотя бы одну аттестацию или независимую оценку квалификации",
        });
      }
      return;
    }

    if (!data.full_name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["full_name"],
        message: "Укажите полное наименование инспекционного органа",
      });
    }
    if (!data.inn) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["inn"],
        message: "Выберите организацию из подсказок, чтобы подставился ИНН",
      });
    }
    if (!data.certificate_number) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["certificate_number"],
        message: "Укажите номер свидетельства об аккредитации",
      });
    }
    if (!data.accreditation_areas.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["accreditation_areas"],
        message: "Выберите хотя бы одну область аккредитации",
      });
    }
  });
