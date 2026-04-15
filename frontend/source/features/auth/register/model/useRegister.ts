"use client";

import { useReducer } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../api/register.api";
import { validateRegisterForm, getRoleType } from "./validation";
import { registerReducer, initialRegisterState } from "./reducer";

export function useRegister() {
  const router = useRouter();
  const [state, dispatch] = useReducer(registerReducer, initialRegisterState);

  const selectRole = (id: number) => dispatch({ type: "SELECT_ROLE", payload: id });
  const toggleCard = (id: number) => dispatch({ type: "TOGGLE_CARD", payload: id });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.selectedRole) {
      dispatch({ type: "SET_ERROR", payload: "Выберите роль" });
      return;
    }

    const formData = {
      role: getRoleType(state.selectedRole),
      login: state.login,
      password: state.password,
      repeatPassword: state.repeatPassword,
      firstName: state.firstName,
      lastName: state.lastName,
    };

    const validationError = validateRegisterForm(formData);
    if (validationError) {
      dispatch({ type: "SET_ERROR", payload: validationError });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      await registerUser(formData);
      router.push("/login");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Произошла ошибка";
      dispatch({ type: "SET_ERROR", payload: msg });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return {
    ...state,
    setLogin: (v: string) => dispatch({ type: "SET_FIELD", field: "login", value: v }),
    setPassword: (v: string) => dispatch({ type: "SET_FIELD", field: "password", value: v }),
    setRepeatPassword: (v: string) => dispatch({ type: "SET_FIELD", field: "repeatPassword", value: v }),
    setFirstName: (v: string) => dispatch({ type: "SET_FIELD", field: "firstName", value: v }),
    setLastName: (v: string) => dispatch({ type: "SET_FIELD", field: "lastName", value: v }),
    selectRole,
    toggleCard,
    handleSubmit,
  };
}
