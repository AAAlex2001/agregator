import { z } from "zod";
import { applicantSchema } from "../../shared/model/applicant";

export const auditCustomerProfileSchema = z.object({
  position: z.string().trim().max(200, "Не более 200 символов"),
  opo_license_number: z.string().trim().max(100, "Не более 100 символов"),
});

export const auditExpertProfileSchema = z
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

const opoItemSchema = z.object({
  registration_number: z.string().trim().min(1, "Укажите регистрационный номер ОПО"),
  name: z.string().trim().min(1, "Укажите наименование ОПО"),
  hazard_class: z.string().trim().max(50, "Не более 50 символов"),
  address: z.string().trim().max(500, "Не более 500 символов"),
  industry: z.string().trim().max(500, "Не более 500 символов"),
  hazard_signs: z.string().trim().max(1000, "Не более 1000 символов"),
});

const fileSchema = z.object({ name: z.string(), url: z.string() });

export const auditOrderSchema = applicantSchema
  .extend({
    audit_scale: z.enum(["SINGLE_OPO", "ALL_OPO", "SELECTED_OPO"]),
    opo_items: z.array(opoItemSchema).max(50, "Не более 50 объектов"),
    opo_total: z.number().int().min(1).max(10_000).nullable(),
    opo_class_1: z.number().int().min(0).max(10_000).nullable(),
    opo_class_2: z.number().int().min(0).max(10_000).nullable(),
    opo_class_3: z.number().int().min(0).max(10_000).nullable(),
    opo_class_4: z.number().int().min(0).max(10_000).nullable(),
    main_industry: z.string().trim().max(500, "Не более 500 символов"),
    multiple_regions: z.boolean().nullable(),
    registration_certificate: fileSchema.nullable(),
    audit_kind: z.enum(["BASIC", "INTERIM", "SELECTIVE", "CONSULTATION"]),
    considers_sto: z.boolean().nullable(),
    sto_name: z.string().trim().max(500, "Не более 500 символов"),
    sto_file: fileSchema.nullable(),
    audit_areas: z.array(z.string()).max(18, "Не более 18 направлений"),
    desired_timeline: z.enum(["MONTH_URGENT", "CURRENT_QUARTER", "NEXT_QUARTER", "CONSULTATION"]),
    comments: z.string().trim().max(5000, "Не более 5000 символов"),
  })
  .superRefine((data, ctx) => {
    if (data.audit_scale === "SINGLE_OPO" && data.opo_items.length !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["opo_items"],
        message: "Для аудита одного ОПО укажите ровно один объект",
      });
    }
    if (data.audit_scale === "SELECTED_OPO" && data.opo_items.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["opo_items"],
        message: "Для аудита выборочных ОПО добавьте хотя бы один объект",
      });
    }
    if (data.audit_scale === "ALL_OPO") {
      if (data.opo_total === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["opo_total"],
          message: "Укажите общее количество ОПО",
        });
      } else {
        const byClass =
          (data.opo_class_1 ?? 0) +
          (data.opo_class_2 ?? 0) +
          (data.opo_class_3 ?? 0) +
          (data.opo_class_4 ?? 0);
        if (byClass > data.opo_total) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["opo_total"],
            message: "Сумма ОПО по классам больше общего количества",
          });
        }
      }
    }
    if (data.audit_kind === "BASIC" || data.audit_kind === "INTERIM") {
      if (data.considers_sto === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["considers_sto"],
          message: "Укажите, учитывать ли внутренние стандарты организации",
        });
      }
      if (data.considers_sto && !data.sto_name.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sto_name"],
          message: "Укажите наименование и реквизиты СТО",
        });
      }
      if (data.considers_sto && data.sto_file === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sto_file"],
          message: "Приложите файл СТО",
        });
      }
    }
    if (data.audit_kind === "SELECTIVE" && data.audit_areas.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["audit_areas"],
        message: "Выберите направление аудита по пункту 17 Приказа 318",
      });
    }
  });
