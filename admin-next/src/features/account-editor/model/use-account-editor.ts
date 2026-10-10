"use client";

import { useEffect, useReducer } from "react";
import { fetchAccount, updateAccount, type AccountChanges } from "@/entities/account";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { accountEditorReducer } from "./reducers";

/** Профиль учётной записи в админке: загрузка, правка полей и сохранение. */
export const useAccountEditor = (id: number) => {
  const toast = useToast();
  const [state, dispatch] = useReducer(accountEditorReducer, {
    account: null,
    fields: { first_name: "", last_name: "", email: "", email_verified: false, phone: "", inn: "", is_active: true },
    failed: false,
    pending: false,
  });

  useEffect(() => {
    fetchAccount(id)
      .then((account) => dispatch({ type: "load/success", account }))
      .catch(() => dispatch({ type: "load/error" }));
  }, [id]);

  const change = (fields: AccountChanges) => dispatch({ type: "fields/change", fields });

  const save = async () => {
    dispatch({ type: "save/start" });

    try {
      dispatch({ type: "save/success", account: await updateAccount(id, state.fields) });
      toast("Профиль сохранён");
    } catch (failure) {
      dispatch({ type: "save/error" });
      toast(errorMessage(failure, "Не удалось сохранить профиль"), "error");
    }
  };

  return { state, change, save };
};
