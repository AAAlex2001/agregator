import { apiJson } from "@/shared/services/api";
import type { Role } from "@/shared/services/api";

export interface Profile {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  role: Role;
}

export const getProfile = () => apiJson<Profile>("/settings/profile");
