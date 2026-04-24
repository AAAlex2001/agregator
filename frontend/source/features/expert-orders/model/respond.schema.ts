import { z } from "zod";

export const respondFormSchema = z.object({
  deadline: z.string().trim().min(1, "Укажите срок"),
  cost: z
    .string()
    .trim()
    .regex(/^\d+$/, "Сумма должна быть числом")
    .refine((value) => Number(value) > 0, "Сумма должна быть больше 0"),
  comment: z.string().max(5000),
});

export type RespondFormValues = z.infer<typeof respondFormSchema>;
