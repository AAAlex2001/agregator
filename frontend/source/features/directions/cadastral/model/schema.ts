import { z } from "zod";
import { applicantSchema } from "../../shared/model/applicant";

export const cadastralProfileSchema = z.object({
  education: z.string().trim().max(5000, "Не более 5000 символов"),
  registry_joined_at: z.string().nullable(),
  certificate_number: z.string().trim().max(100, "Не более 100 символов").nullable(),
  registry_number: z.string().trim().max(100, "Не более 100 символов").nullable(),
  has_equipment: z.boolean(),
  city: z.string().trim().max(200, "Не более 200 символов"),
  workplace: z.string().trim().max(500, "Не более 500 символов"),
});

export const cadastralOrderSchema = applicantSchema.extend({
  work_purpose: z.string().trim().min(1, "Укажите цель работ").max(5000, "Не более 5000 символов"),
  city: z.string().trim().min(1, "Укажите, где находится объект"),
  education_requirement: z.string().trim().max(5000, "Не более 5000 символов"),
  sro_required: z.boolean(),
  duration: z.string().trim().max(200, "Не более 200 символов"),
});
