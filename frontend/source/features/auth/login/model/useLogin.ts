"use client";

import { useReducer, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/source/features/session";
import { isValidInn, normalizeInn } from "@/source/shared/lib/inn";
import { loginUser } from "../api/login.api";
import { loginReducer, initialLoginState } from "./reducer";

export function useLogin() {
  const router = useRouter();
  const { reload } = useSession();
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
    const inn = normalizeInn(state.inn);

    if (!isValidInn(inn)) {
      dispatch({ type: "SET_ERROR", payload: "Укажите корректный ИНН из 10 или 12 цифр" });
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
        inn,
        password: state.password,
        role: state.role,
      });
      await reload();

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
    setInn: (v: string) => dispatch({ type: "SET_FIELD", field: "inn", value: normalizeInn(v) }),
    setPassword: (v: string) => dispatch({ type: "SET_FIELD", field: "password", value: v }),
    setRole: (role: "CUSTOMER" | "EXPERT") => dispatch({ type: "SET_ROLE", payload: role }),
    handleSubmit,
  };
}
