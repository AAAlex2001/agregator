"use client";

import { useReducer, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../api/login.api";
import { loginReducer, initialLoginState } from "./reducer";

export function useLogin() {
  const router = useRouter();
  const [state, dispatch] = useReducer(loginReducer, initialLoginState);
  const [fromOrder, setFromOrder] = useState(false);

  useEffect(() => {
    const pending = sessionStorage.getItem("pendingOrderUuid");
    if (pending) {
      setFromOrder(true);
      dispatch({ type: "SET_ROLE", payload: "EXPERT" });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.login.trim()) {
      dispatch({ type: "SET_ERROR", payload: "Укажите email или телефон" });
      return;
    }
    if (!state.password.trim()) {
      dispatch({ type: "SET_ERROR", payload: "Введите пароль" });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const user = await loginUser({
        login: state.login,
        password: state.password,
        role: state.role,
      });

      localStorage.setItem("role", user.role);

      const pendingUuid = sessionStorage.getItem("pendingOrderUuid");
      if (user.role === "EXPERT" && pendingUuid) {
        sessionStorage.removeItem("pendingOrderUuid");
        router.push(`/order/${pendingUuid}`);
      } else {
        router.push(user.role === "CUSTOMER" ? "/customer/orders" : "/expert/orders");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Произошла ошибка";
      dispatch({ type: "SET_ERROR", payload: msg });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return {
    ...state,
    fromOrder,
    setLogin: (v: string) => dispatch({ type: "SET_FIELD", field: "login", value: v }),
    setPassword: (v: string) => dispatch({ type: "SET_FIELD", field: "password", value: v }),
    setRole: (role: "CUSTOMER" | "EXPERT") => dispatch({ type: "SET_ROLE", payload: role }),
    handleSubmit,
  };
}
