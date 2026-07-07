import { ReactNode } from "react";

export type { UserRole, RegisterApiPayload, RegisterResponse } from "@/source/entities/user";

export const ROLE_ID_CUSTOMER = 1;
export const ROLE_ID_EXPERT = 2;
export const ROLE_ID_LICENSE_HOLDER = 3;

export interface Role {
  id: number;
  title: string;
  subtitle?: string;
  icon: ReactNode;
  expandedTitle: string;
  description: string[];
  photo: string;
}
