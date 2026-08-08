import { z } from "zod";
import type { RegisterFormValues } from "./fields";

export function validatePasswords(data: RegisterFormValues, ctx: z.RefinementCtx): void {
  if (!data.repeatPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["repeatPassword"],
      message: "Повторите пароль",
    });
    return;
  }
  if (data.password !== data.repeatPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["repeatPassword"],
      message: "Пароли не совпадают",
    });
  }
}

export function requireFullName(data: RegisterFormValues, ctx: z.RefinementCtx): void {
  if (!data.firstName) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["firstName"], message: "Укажите имя" });
  }
  if (!data.lastName) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["lastName"], message: "Укажите фамилию" });
  }
}

export function requireCompany(data: RegisterFormValues, ctx: z.RefinementCtx): void {
  const inn = data.companyData?.data?.inn ?? "";
  if (!data.companyData || !inn || !/^\d{10}$|^\d{12}$/.test(inn)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["companyName"],
      message: "Выберите вашу организацию из списка",
    });
  }
}

export function validateAgreements(data: RegisterFormValues, ctx: z.RefinementCtx): void {
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
  if (!data.agreeConsent) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["agreeConsent"],
      message: "Требуется согласие на обработку персональных данных",
    });
  }
}
