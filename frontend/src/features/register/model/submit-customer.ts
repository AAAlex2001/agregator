import type { AuditCustomerProfileValues } from "@/entities/audit";
import type { CompanySuggestion } from "@/entities/company";
import type { DirectionCode } from "@/entities/direction";
import { registerAccount } from "@/entities/user";
import type { RegistrationAccount } from "./account";
import { getAccountRequestFields } from "./account-request";
import type { RegistrationAccountRequest } from "./account-request";
import type { CustomerRegistration } from "./customer";

/** Payload заказчика: API получает реквизиты выбранной компании и направления работы. */
interface CustomerRegistrationRequest extends RegistrationAccountRequest {
  role: "CUSTOMER";
  first_name?: string;
  last_name?: string;
  inn: string;
  company_data: CompanySuggestion;
  audit_customer_profile: AuditCustomerProfileValues | null;
  directions: DirectionCode[];
}

/** Регистрирует заказчика с проверенной подсказкой организации. */
export async function submitCustomer(
  account: RegistrationAccount,
  customer: CustomerRegistration,
  company: CompanySuggestion,
): Promise<void> {
  const payload: CustomerRegistrationRequest = {
    ...getAccountRequestFields(account),
    role: "CUSTOMER",
    first_name: account.firstName.trim() || undefined,
    last_name: account.lastName.trim() || undefined,
    inn: company.data.inn ?? "",
    company_data: company,
    audit_customer_profile: customer.audit,
    directions: customer.directions,
  };
  const form = new FormData();
  form.append("payload", JSON.stringify(payload));
  await registerAccount(form);
}

