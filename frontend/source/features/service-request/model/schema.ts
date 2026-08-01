import { z } from "zod";

const requiredDate = (message: string) => z.string().trim().min(1, message);

const baseSchema = z.object({
  firstName: z.string().trim().min(1, "Укажите имя").max(100),
  lastName: z.string().trim().min(1, "Укажите фамилию").max(100),
  phone: z
    .string()
    .trim()
    .refine((value) => value.replace(/\D/g, "").length >= 10, "Укажите корректный телефон"),
  email: z.string().trim().email("Укажите корректный email"),
  description: z.string().trim().min(1, "Опишите задачу").max(5000),
  responsesDeadline: requiredDate("Укажите срок приёма откликов"),
  startDate: requiredDate("Укажите срок начала работ"),
  dueDate: requiredDate("Укажите срок сдачи работ"),
  maxPrice: z
    .string()
    .trim()
    .min(1, "Укажите начальную максимальную цену")
    .refine((value) => Number(value.replace(/\s/g, "")) > 0, "Цена должна быть больше нуля"),
  agreePrivacy: z.literal(true, {
    error: "Требуется согласие с Политикой конфиденциальности",
  }),
  agreeTerms: z.literal(true, {
    error: "Требуется согласие с Пользовательским соглашением",
  }),
  agreeConsent: z.literal(true, {
    error: "Требуется согласие на обработку персональных данных",
  }),
});

export const nirRequestSchema = baseSchema.extend({
  variant: z.literal("nir"),
  topic: z.string().trim().min(1, "Укажите тему НИР").max(500),
});

export const labRequestSchema = baseSchema.extend({
  variant: z.literal("lab"),
  researchName: z.string().trim().min(1, "Укажите наименование исследований").max(500),
});

export const serviceRequestSchema = z.discriminatedUnion("variant", [
  nirRequestSchema,
  labRequestSchema,
]);

export type ServiceRequestValues = z.infer<typeof serviceRequestSchema>;
