import { adminFetch, jsonBody } from "@/shared/api";
import type { AccountChanges, AccountDetail, AccountList, AccountListQuery } from "../model/types";

/** Страница учётных записей, новые сверху: фильтр по роли, поиск по имени, email, телефону и ИНН. */
export const fetchAccounts = async (query: AccountListQuery, limit: number, offset: number): Promise<AccountList> => {
  const params = new URLSearchParams({ limit: String(limit), skip: String(offset) });

  if (query.role) params.set("role", query.role);
  if (query.query) params.set("q", query.query);

  const response = await adminFetch(`/accounts?${params}`);

  return response.json();
};

/** Профиль учётной записи: контакты, компания, активность и действующая подписка. */
export const fetchAccount = async (id: number): Promise<AccountDetail> => {
  const response = await adminFetch(`/accounts/${id}`);

  return response.json();
};

/** Сохранить имя, контакты, ИНН и доступ. При смене ИНН карточка компании обновится из DaData. */
export const updateAccount = async (id: number, changes: AccountChanges): Promise<AccountDetail> => {
  const response = await adminFetch(`/accounts/${id}`, jsonBody("PUT", changes));

  return response.json();
};
