import "server-only";

import { cookies } from "next/headers";
import { toUserRole, type UserRole } from "@/entities/user";

/** Читает сохранённую роль для серверного перехода до загрузки страницы. */
export async function readSessionRole(): Promise<UserRole | null> {
  const cookieStore = await cookies();

  return toUserRole(cookieStore.get("user_role")?.value);
}
