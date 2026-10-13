import { PENDING_ORDER_UUID_KEY } from "@/source/entities/order";
import type { LoginAction, LoginState } from "./types";

/** Стартовое состояние: если пользователь шёл откликаться на заказ, покажем подсказку войти исполнителем. */
export function initialLoginState(): LoginState {
  return {
    email: "",
    password: "",
    roles: null,
    fromOrder: Boolean(sessionStorage.getItem(PENDING_ORDER_UUID_KEY)),
    isSubmitting: false,
  };
}

export function loginReducer(state: LoginState, action: LoginAction): LoginState {
  switch (action.type) {
    case "email/change":
      return { ...state, email: action.email };
    case "password/change":
      return { ...state, password: action.password };
    case "submit/start":
      return { ...state, isSubmitting: true };
    case "submit/finish":
      return { ...state, isSubmitting: false };
    case "roles/required":
      return { ...state, roles: action.roles, isSubmitting: false };
    case "roles/cancel":
      return { ...state, roles: null };
  }
}
