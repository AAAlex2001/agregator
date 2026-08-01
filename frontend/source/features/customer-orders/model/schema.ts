import { z } from "zod";
import type { OrderWorkType } from "@/source/entities/order";
import { validateOrderDetails } from "./detailsRegistry";

export const orderFormSchema = z.object({
  title: z.string().trim().min(1, "Введите название"),
  company: z.string(),
  startDate: z.string().min(1, "Укажите срок начала"),
  deadline: z.string().min(1, "Укажите срок окончания"),
  responsesDeadline: z.string(),
  budget: z.string(),
  /** Per-type OPO selections: { "ТУ": ["1", "2"], "Д": ["3.1", "10"] }. */
  selectionsByType: z.record(z.string(), z.array(z.string())),
  comment: z.string(),
  requiresExpert: z.boolean(),
  requiresLicense: z.boolean(),
  workType: z.custom<OrderWorkType>(),
  details: z.record(z.string(), z.unknown()),
})
  .refine(
    (values) => values.requiresExpert || values.requiresLicense,
    {
      path: ["requiresExpert"],
      message: "Выберите, что требуется: исполнитель и/или лицензия",
    },
  )
  .superRefine((values, ctx) => {
    const message = validateOrderDetails(values.workType, values.details);
    if (message) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["details"], message });
    }
  });

export type OrderFormValues = z.infer<typeof orderFormSchema>;
