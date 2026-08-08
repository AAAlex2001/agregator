import type { z } from "zod";
import { requireCompany, requireFullName } from "./common";
import type { RegisterFormValues } from "./fields";

export function validateCustomer(data: RegisterFormValues, ctx: z.RefinementCtx): void {
  requireFullName(data, ctx);
  requireCompany(data, ctx);
}
