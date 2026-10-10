import type { AccountChanges, AccountDetail } from "@/entities/account";
import type { AccountEditorAction, AccountEditorState } from "./types";

/** Поля формы из профиля: пустые значения — пустые строки. */
export const toFields = (account: AccountDetail): AccountChanges => ({
  first_name: account.first_name ?? "",
  last_name: account.last_name ?? "",
  email: account.email ?? "",
  email_verified: account.email_verified,
  phone: account.phone ?? "",
  inn: account.inn ?? "",
  is_active: account.is_active,
});

export const accountEditorReducer = (state: AccountEditorState, action: AccountEditorAction): AccountEditorState => {
  switch (action.type) {
    case "load/success":
    case "save/success":
      return { account: action.account, fields: toFields(action.account), failed: false, pending: false };

    case "load/error":
      return { ...state, failed: true };

    case "fields/change":
      return { ...state, fields: action.fields };

    case "save/start":
      return { ...state, pending: true };

    case "save/error":
      return { ...state, pending: false };

    default:
      return state;
  }
};
