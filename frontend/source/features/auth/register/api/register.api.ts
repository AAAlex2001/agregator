import { fetchBase } from "@/source/shared/api/base";
import { toRussianPhoneApiValue } from "@/source/shared/lib/phone";
import type { RegisterFormData, RegisterResponse } from "../model/types";

export async function registerUser(data: RegisterFormData): Promise<RegisterResponse> {
  return fetchBase<RegisterResponse>("/register/", {
    method: "POST",
    body: {
      role: data.role,
      inn: data.inn,
      company_data: data.companyData ?? undefined,
      email: data.email.trim() || undefined,
      phone: toRussianPhoneApiValue(data.phone) || undefined,
      password: data.password,
      first_name: data.firstName || undefined,
      last_name: data.lastName || undefined,
    },
  });
}
