import type { AccountChanges, AccountDetail } from "@/entities/account";

export type AccountEditorState = {
  account: AccountDetail | null;
  fields: AccountChanges;
  failed: boolean;
  pending: boolean;
};

export type AccountEditorAction =
  | { type: "load/success"; account: AccountDetail }
  | { type: "load/error" }
  | { type: "fields/change"; fields: AccountChanges }
  | { type: "save/start" }
  | { type: "save/success"; account: AccountDetail }
  | { type: "save/error" };
