import { z } from "zod";
import type { OrderWorkType } from "@/source/entities/order";
import type { AuditOrderDetails } from "@/source/features/directions/audit";
import type { CadastralOrderDetails } from "@/source/features/directions/cadastral";
import type { ForensicOrderDetails } from "@/source/features/directions/forensic";
import type { LaboratoryOrderDetails } from "@/source/features/directions/laboratory";
import type { ResearchOrderDetails } from "@/source/features/directions/research";
import { validateDirectionDetails } from "./orderDetails";

export const orderFormSchema = z.object({
  title: z.string().trim().min(1, "Введите название"),
  company: z.string(),
  startDate: z.string().min(1, "Укажите срок начала"),
  deadline: z.string().min(1, "Укажите срок окончания"),
  responsesDeadline: z.string(),
  budget: z.string(),
  selectionsByType: z.record(z.string(), z.array(z.string())),
  comment: z.string(),
  requiresExpert: z.boolean(),
  requiresLicense: z.boolean(),
  workType: z.custom<OrderWorkType>(),
  cadastralDetails: z.custom<CadastralOrderDetails>(),
  forensicDetails: z.custom<ForensicOrderDetails>(),
  researchDetails: z.custom<ResearchOrderDetails>(),
  laboratoryDetails: z.custom<LaboratoryOrderDetails>(),
  auditDetails: z.custom<AuditOrderDetails>(),
})
  .refine(
    (values) => values.requiresExpert || values.requiresLicense,
    {
      path: ["requiresExpert"],
      message: "Выберите, что требуется: исполнитель и/или лицензия",
    },
  )
  .superRefine((values, ctx) => {
    const issue = validateDirectionDetails(values.workType, values);
    if (issue) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [issue.path], message: issue.message });
    }
  });

export type OrderFormValues = z.infer<typeof orderFormSchema>;
