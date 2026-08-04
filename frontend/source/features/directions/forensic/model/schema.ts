import { z } from "zod";
import { applicantSchema } from "../../shared/model/applicant";

export const forensicProfileSchema = z
  .object({
    education: z.string().trim().max(5000, "Не более 5000 символов"),
    extra_education: z.string().trim().max(5000, "Не более 5000 символов"),
    has_similar_experience: z.boolean(),
    has_degree: z.boolean(),
    degree: z.string().trim().max(300, "Не более 300 символов"),
    city: z.string().trim().max(200, "Не более 200 символов"),
    workplace_kind: z.enum(["INDIVIDUAL", "ORGANIZATION"]),
    workplace_name: z.string().trim().max(500, "Не более 500 символов"),
  })
  .superRefine((data, ctx) => {
    if (data.has_degree && !data.degree.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["degree"],
        message: "Укажите учёную степень",
      });
    }
  });

export const forensicOrderSchema = applicantSchema.extend({
  expertise_purpose: z
    .string()
    .trim()
    .min(1, "Укажите цель экспертизы")
    .max(5000, "Не более 5000 символов"),
  government_body: z
    .string()
    .trim()
    .min(1, "Укажите государственный орган")
    .max(500, "Не более 500 символов"),
  city: z.string().trim().min(1, "Укажите, где находится предмет экспертизы"),
  education_requirement: z.string().trim().max(5000, "Не более 5000 символов"),
  extra_requirements: z.string().trim().max(5000, "Не более 5000 символов"),
  similar_experience_required: z.boolean(),
  duration: z.string().trim().max(200, "Не более 200 символов"),
});
