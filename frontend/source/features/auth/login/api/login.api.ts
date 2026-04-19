import { fetchBase } from "@/source/shared/api/base";
import type { LoginFormData, LoginResponse } from "../model/types";

export async function loginUser(data: LoginFormData): Promise<LoginResponse> {
  return fetchBase<LoginResponse>("/login/", {
    method: "POST",
    credentials: "include",
    body: {
      inn: data.inn,
      password: data.password,
      role: data.role,
    },
  });
}
