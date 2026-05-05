import { z } from "zod";

export const respondFormSchema = z.object({
  deadline: z.string().trim().min(1, "Укажите срок"),
  cost: z
    .string()
    .trim()
    .regex(/^\d+$/, "Сумма должна быть числом")
    .refine((value) => Number(value) > 0, "Сумма должна быть больше 0"),
  comment: z.string().max(5000),
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
  const inn = data.companyData?.data?.inn ?? "";
  if (!data.companyData || !inn || !/^\d{10}$|^\d{12}$/.test(inn)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["companyName"],
      message: "Выберите вашу компанию из списка",
    });
  }
});

export type RespondFormValues = z.infer<typeof respondFormSchema>;
