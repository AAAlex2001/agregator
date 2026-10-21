import "server-only";

import { cookies } from "next/headers";
import { SERVER_API_URL } from "@/shared/config/server-api";
import type { OrderListPage } from "../model/order-list";

/** Страница архива на сервере с сессией пользователя; без сессии или при ошибке — null. */
export async function getArchivedOrdersOnServer(
  skip: number,
  limit: number,
): Promise<OrderListPage | null> {
  const session = (await cookies()).get("session_id")?.value;

  if (!session) {
    return null;
  }

  const response = await fetch(`${SERVER_API_URL}/orders/archive?skip=${skip}&limit=${limit}`, {
    headers: { Cookie: `session_id=${session}` },
    cache: "no-store",
  });

  return response.ok ? response.json() : null;
}