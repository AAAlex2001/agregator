"use client";

import { useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/shared/ui/Notifications";
import { normalizeInn } from "@/source/shared/lib/inn";
import { formatRussianPhone } from "@/source/shared/lib/phone";
import { registerUser } from "../api/register.api";
import type { PartySuggestion } from "../api/partySuggestions.api";
import { validateRegisterForm, getRoleType } from "./validation";
import { registerReducer, initialRegisterState } from "./reducer";

export function useRegister() {
  const router = useRouter();
  const { showError, showSuccess } = useNotifications();
  const [state, dispatch] = useReducer(registerReducer, initialRegisterState);
  const [selectedParty, setSelectedParty] = useState<PartySuggestion | null>(null);

  const selectRole = (id: number) => dispatch({ type: "SELECT_ROLE", payload: id });
  const toggleCard = (id: number) => dispatch({ type: "TOGGLE_CARD", payload: id });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.selectedRole) {
      showError("Выберите роль");
      return;
    }

    const formData = {
      role: getRoleType(state.selectedRole),
      email: state.email,
      phone: state.phone,
      inn: normalizeInn(state.inn),
      companyData: selectedParty,
      password: state.password,
      repeatPassword: state.repeatPassword,
      firstName: state.firstName,
      lastName: state.lastName,
    };

    const validationError = validateRegisterForm(formData);
    if (validationError) {
      showError(validationError);
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      await registerUser(formData);
      showSuccess("Регистрация завершена");
      router.push("/login");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Произошла ошибка";
      showError(msg);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return {
    ...state,
    setEmail: (v: string) => dispatch({ type: "SET_FIELD", field: "email", value: v }),
    setPhone: (v: string) => dispatch({ type: "SET_FIELD", field: "phone", value: formatRussianPhone(v) }),
    setInn: (v: string) => dispatch({ type: "SET_FIELD", field: "inn", value: normalizeInn(v) }),
    setInnQuery: (v: string) => dispatch({ type: "SET_FIELD", field: "innQuery", value: v }),
    setSelectedParty,
    setPassword: (v: string) => dispatch({ type: "SET_FIELD", field: "password", value: v }),
    setRepeatPassword: (v: string) => dispatch({ type: "SET_FIELD", field: "repeatPassword", value: v }),
    setFirstName: (v: string) => dispatch({ type: "SET_FIELD", field: "firstName", value: v }),
    setLastName: (v: string) => dispatch({ type: "SET_FIELD", field: "lastName", value: v }),
    selectRole,
    toggleCard,
    handleSubmit,
  };
}
