import type { AccountList, AccountListQuery } from "@/entities/account";

export type AccountsState = {
  search: string;
  filters: AccountListQuery;
  page: number;
  list: AccountList | null;
  loading: boolean;
  failed: boolean;
};

export type AccountsAction =
  | { type: "search/change"; value: string }
  | { type: "load/start"; filters: AccountListQuery; page: number }
  | { type: "load/success"; list: AccountList }
  | { type: "load/error" };
