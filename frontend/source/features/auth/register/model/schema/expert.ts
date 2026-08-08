import { z } from "zod";
import { requireFullName } from "./common";
import type { RegisterFormValues } from "./fields";

export function validateExpert(data: RegisterFormValues, ctx: z.RefinementCtx): void {
  requireFullName(data, ctx);
  validateContactSales(data, ctx);
}

function validateContactSales(data: RegisterFormValues, ctx: z.RefinementCtx): void {
  if (!data.contactSalesEnabled) return;

  const price = Number(data.contactPriceRubles.replace(/\s/g, ""));
  if (!Number.isInteger(price) || price < 1 || price > 1_000_000) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["contactPriceRubles"],
      message: "Укажите стоимость от 1 до 1 000 000 ₽",
    });
  }
  if (!data.contactPaymentDetails) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["contactPaymentDetails"],
      message: "Укажите реквизиты для прямого перевода",
    });
  }
  if (!data.contactDisclosureConsent) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["contactDisclosureConsent"],
      message: "Подтвердите согласие на передачу контактов после оплаты",
    });
  }
}
