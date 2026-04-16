import { z } from "zod";

export const orderFormSchema = z.object({
  title: z.string().trim().min(1, "Введите название"),
  company: z.string(),
  deadline: z.string().min(1, "Укажите срок"),
  responsesDeadline: z.string(),
  budget: z.string(),
  selectedBadgeVariants: z.array(z.string()),
  typicalNamesMap: z.record(z.string(), z.string()),
  comment: z.string(),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;
