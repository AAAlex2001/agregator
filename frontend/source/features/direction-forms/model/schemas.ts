import { z } from "zod";

const nullableText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Не более ${max} символов`)
    .nullable()
    .transform((value) => value ?? "");

export const expertiseExpertSchema = z.object({
  certificates: z.array(
    z.object({
      area: z.string(),
      object: z.string(),
      category: z.string(),
    }),
  ),
});

export const cadastralExpertSchema = z.object({
  education: z.string().trim().max(5000, "Не более 5000 символов"),
  registry_joined_at: z.string().nullable(),
  certificate_number: nullableText(100),
  registry_number: nullableText(100),
  equipment: z.string().trim().max(5000, "Не более 5000 символов"),
  workplace: z.string().trim().max(500, "Не более 500 символов"),
});

export const forensicExpertSchema = z.object({
  education: z.string().trim().max(5000, "Не более 5000 символов"),
  similar_cases_experience: z.string().trim().max(5000, "Не более 5000 символов"),
  workplace_kind: z.enum(["INDIVIDUAL", "ORGANIZATION"]),
  workplace_name: z.string().trim().max(500, "Не более 500 символов"),
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
    if (data.participant_kind !== "INSPECTION_BODY") return;

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
  });
