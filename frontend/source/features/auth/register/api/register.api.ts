import { fetchBase } from "@/source/shared/api/base";
import type { RegisterFormData, RegisterResponse } from "../model/types";

export async function registerUser(data: RegisterFormData): Promise<RegisterResponse> {
  return fetchBase<RegisterResponse>("/register/", {
    method: "POST",
    body: {
      role: data.role,
      email: data.login.includes("@") ? data.login : undefined,
      phone: !data.login.includes("@") ? data.login : undefined,
      password: data.password,
      first_name: data.firstName || undefined,
      last_name: data.lastName || undefined,
    },
  });
}
