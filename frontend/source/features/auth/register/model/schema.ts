import { z } from "zod";
import { isValidRussianPhone } from "@/source/shared/lib/phone";

const passwordSchema = z
  .string()
  .min(6, "Пароль должен быть не менее 6 символов")
  .regex(/[A-Z]/, "Пароль должен содержать заглавную латинскую букву")
  .regex(/[a-z]/, "Пароль должен содержать строчную латинскую букву")
  .regex(/^[A-Za-z0-9!@#$%^&*()\-_+=\[\]{}|;:'",.<>?/`~ ]+$/, "Только латинские буквы, цифры и спецсимволы");

export const registerFormSchema = z
  .object({
    role: z.enum(["CUSTOMER", "EXPERT"]),
    email: z.string().trim().email("Укажите корректный email"),
    phone: z
      .string()
      .trim()
      .refine((v) => v === "" || isValidRussianPhone(v), "Укажите корректный номер в формате +7-999-999-99-12"),
    firstName: z.string().trim(),
    lastName: z.string().trim(),
    password: passwordSchema,
    repeatPassword: z.string(),
    agreePrivacy: z.boolean(),
    agreeTerms: z.boolean(),
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
  })
  .superRefine((data, ctx) => {
    if (!data.repeatPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["repeatPassword"],
        message: "Повторите пароль",
      });
    } else if (data.password !== data.repeatPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["repeatPassword"],
        message: "Пароли не совпадают",
      });
    }

    if (data.role === "EXPERT") {
      if (!data.firstName) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["firstName"], message: "Укажите имя" });
      }
      if (!data.lastName) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["lastName"], message: "Укажите фамилию" });
      }
    }

    if (data.role === "CUSTOMER") {
      const inn = data.companyData?.data?.inn ?? "";
      if (!data.companyData || !inn || !/^\d{10}$|^\d{12}$/.test(inn)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["companyName"],
          message: "Выберите вашу компанию из списка",
        });
      }
    }

    if (!data.agreePrivacy) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["agreePrivacy"],
        message: "Требуется согласие с Политикой конфиденциальности",
      });
    }
    if (!data.agreeTerms) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["agreeTerms"],
        message: "Требуется согласие с Пользовательским соглашением",
      });
    }
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const registerConfirmSchema = z.object({
  code: z.string().regex(/^\d{6}$/u, "Введите 6-значный код"),
});
export type RegisterConfirmValues = z.infer<typeof registerConfirmSchema>;
