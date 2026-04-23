import { z } from "zod";

export const forgotEmailSchema = z.object({
  email: z.string().trim().email("Укажите корректный email"),
});
export type ForgotEmailValues = z.infer<typeof forgotEmailSchema>;

export const forgotCodeSchema = z.object({
  code: z.string().regex(/^\d{6}$/u, "Введите 6-значный код"),
});
export type ForgotCodeValues = z.infer<typeof forgotCodeSchema>;

export const forgotNewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Пароль должен быть не менее 6 символов")
      .regex(/[A-Z]/, "Пароль должен содержать заглавную латинскую букву")
      .regex(/[a-z]/, "Пароль должен содержать строчную латинскую букву")
      .regex(/^[A-Za-z0-9!@#$%^&*()\-_+=\[\]{}|;:'",.<>?/`~ ]+$/, "Только латинские буквы, цифры и спецсимволы"),
    repeatPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.repeatPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["repeatPassword"],
        message: "Пароли не совпадают",
      });
    }
  });
export type ForgotNewPasswordValues = z.infer<typeof forgotNewPasswordSchema>;
