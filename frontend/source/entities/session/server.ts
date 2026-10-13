import "server-only";

import { cookies } from "next/headers";
import type { UserRole } from "@/source/entities/user";
import { toUserRole } from "./model/role";

/** Роль из cookie прошлого визита — для серверных редиректов и первого рендера кабинета. */
export async function readSessionRole(): Promise<UserRole | null> {
  return toUserRole((await cookies()).get("user_role")?.value);
}
