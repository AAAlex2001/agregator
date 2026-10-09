"use client";

import { useRouter } from "next/navigation";
import { useReducer } from "react";
import { ARTICLES_PATH } from "@/shared/lib/admin-paths";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { login } from "../api/auth";
import { loginReducer } from "./reducers";

/** Форма входа: поля и отправка. После входа открывает список статей. */
export const useLogin = () => {
  const router = useRouter();
  const toast = useToast();
  const [state, dispatch] = useReducer(loginReducer, { login: "", password: "", pending: false });

  const changeField = (field: "login" | "password", value: string) =>
    dispatch({ type: "field/change", field, value });

  const submit = async () => {
    dispatch({ type: "submit/start" });

    try {
      await login(state.login.trim(), state.password);
      router.replace(ARTICLES_PATH);
    } catch (failure) {
      dispatch({ type: "submit/error" });
      toast(errorMessage(failure, "Не удалось войти"), "error");
    }
  };

  return { state, changeField, submit };
};
