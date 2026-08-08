import { z } from "zod";

export const registerConfirmSchema = z.object({
  code: z.string().regex(/^\d{6}$/u, "Введите 6-значный код"),
});

export type RegisterConfirmValues = z.infer<typeof registerConfirmSchema>;
