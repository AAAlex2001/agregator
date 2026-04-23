import { fetchBase } from "@/source/shared/api/base";
import { toRussianPhoneApiValue } from "@/source/shared/lib/phone";
import type { RegisterApiPayload, RegisterResponse, UserRole } from "../model/types";
import type { RegisterFormValues } from "../model/schema";

function getRoleType(roleId: number): UserRole {
  return roleId === 1 ? "CUSTOMER" : "EXPERT";
}

export function toRegisterPayload(values: RegisterFormValues, roleId: number): RegisterApiPayload {
  return {
    role: getRoleType(roleId),
    email: values.email.trim(),
    password: values.password,
    phone: toRussianPhoneApiValue(values.phone) || undefined,
    first_name: values.firstName || undefined,
    last_name: values.lastName || undefined,
  };
}

export async function registerUser(payload: RegisterApiPayload): Promise<RegisterResponse> {
  return fetchBase<RegisterResponse>("/register/", {
    method: "POST",
    body: {
      role: payload.role,
      email: payload.email,
      password: payload.password,
      phone: payload.phone,
      first_name: payload.first_name,
      last_name: payload.last_name,
    },
  });
}

export async function confirmRegistrationEmail(email: string, code: string): Promise<void> {
  await fetchBase<{ message: string }>("/register/confirm-email", {
    method: "POST",
    body: { email, code },
  });
}
