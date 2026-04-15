"use client";

import { useReducer } from "react";
import { requestPasswordReset, confirmResetCode, resetPassword } from "../api/forgot-password.api";
import { forgotPasswordReducer, initialForgotPasswordState } from "./reducer";

export function useForgotPassword() {
  const [state, dispatch] = useReducer(forgotPasswordReducer, initialForgotPasswordState);

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.email.trim()) {
      dispatch({ type: "SET_ERROR", payload: "Введите электронную почту" });
      return;
    }
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await requestPasswordReset(state.email);
      dispatch({ type: "SET_STEP", payload: 2 });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err instanceof Error ? err.message : "Произошла ошибка" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const submitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.code.trim()) {
      dispatch({ type: "SET_ERROR", payload: "Введите код" });
      return;
    }
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await confirmResetCode(state.email, state.code);
      dispatch({ type: "SET_STEP", payload: 3 });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err instanceof Error ? err.message : "Произошла ошибка" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.password.trim()) {
      dispatch({ type: "SET_ERROR", payload: "Введите пароль" });
      return;
    }
    if (state.password.length < 6) {
      dispatch({ type: "SET_ERROR", payload: "Пароль должен быть не менее 6 символов" });
      return;
    }
    if (state.password !== state.repeatPassword) {
      dispatch({ type: "SET_ERROR", payload: "Пароли не совпадают" });
      return;
    }
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await resetPassword(state.email, state.code, state.password);
      dispatch({ type: "SET_STEP", payload: 4 });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err instanceof Error ? err.message : "Произошла ошибка" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return {
    ...state,
    setEmail: (v: string) => dispatch({ type: "SET_FIELD", field: "email", value: v }),
    setCode: (v: string) => dispatch({ type: "SET_FIELD", field: "code", value: v }),
    setPassword: (v: string) => dispatch({ type: "SET_FIELD", field: "password", value: v }),
    setRepeatPassword: (v: string) => dispatch({ type: "SET_FIELD", field: "repeatPassword", value: v }),
    submitEmail,
    submitCode,
    submitPassword,
  };
}
