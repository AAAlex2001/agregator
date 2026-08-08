import { validateAgreements, validatePasswords } from "./common";
import { validateCustomer } from "./customer";
import { validateDirections } from "./directions";
import { validateExpert } from "./expert";
import { registerFormFields } from "./fields";
import { validateLicenseHolder } from "./license-holder";

export const registerFormSchema = registerFormFields.superRefine((data, ctx) => {
  validatePasswords(data, ctx);
  if (data.role === "CUSTOMER") validateCustomer(data, ctx);
  if (data.role === "EXPERT") validateExpert(data, ctx);
  if (data.role === "LICENSE_HOLDER") validateLicenseHolder(data, ctx);
  validateDirections(data, ctx);
  validateAgreements(data, ctx);
});

export type { RegisterFormValues } from "./fields";
export { emptyRegisterFormValues, presetRegisterFormValues } from "./defaults";
export { registerConfirmSchema, type RegisterConfirmValues } from "./confirm";
