import { z } from "zod";
import { isValidInn } from "@/source/shared/lib/inn";

export const VAT_KIND_VALUES = ["NONE", "VAT_5", "VAT_7", "VAT_22"] as const;

export const respondFormSchema = z.object({
  startDate: z.string().trim().min(1, "Укажите срок начала"),
  deadline: z.string().trim().min(1, "Укажите срок окончания"),
  cost: z
    .string()
    .trim()
    .regex(/^\d+$/, "Сумма должна быть числом")
    .refine((value) => Number(value) > 0, "Сумма должна быть больше 0"),
  vatKind: z.enum(VAT_KIND_VALUES),
  comment: z.string().max(5000),
  requiresCompany: z.boolean(),
  companyName: z.string().trim(),
  companyData: z
    .object({
      value: z.string(),
      unrestricted_value: z.string(),
      data: z
        .object({
          inn: z.string().nullable().optional(),
        })
        .passthrough(),
    })
    .passthrough()
    .nullable(),
}).superRefine((data, ctx) => {
  if (!data.requiresCompany) return;

  const inn = data.companyData?.data?.inn ?? "";
  if (!data.companyData || !isValidInn(inn)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["companyName"],
      message: "Выберите вашу компанию из списка",
    });
  }
});

export type RespondFormValues = z.infer<typeof respondFormSchema>;
