import { adminFetch } from "@/shared/api";
import type { AccountList, AccountListQuery } from "../model/types";

/** Страница учётных записей, новые сверху: фильтр по роли, поиск по имени, email, телефону и ИНН. */
export const fetchAccounts = async (query: AccountListQuery, limit: number, offset: number): Promise<AccountList> => {
  const params = new URLSearchParams({ limit: String(limit), skip: String(offset) });

  if (query.role) params.set("role", query.role);
  if (query.query) params.set("q", query.query);

  const response = await adminFetch(`/accounts?${params}`);

  return response.json();
};
