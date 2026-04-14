"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../api/register.api";
import { validateRegisterForm, getRoleType } from "./validation";

export function useRegister() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [openedCardId, setOpenedCardId] = useState<number | null>(null);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectRole = (id: number) => {
    setSelectedRole(id);
    setStep(2);
  };

  const toggleCard = (id: number) => {
    setOpenedCardId(openedCardId === id ? null : id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setError("Выберите роль");
      return;
    }

    const formData = {
      role: getRoleType(selectedRole),
      login,
      password,
      repeatPassword,
      firstName,
      lastName,
    };

    const validationError = validateRegisterForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await registerUser(formData);
      router.push("/login");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Произошла ошибка";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    step, selectedRole, openedCardId, login, password, repeatPassword,
    firstName, lastName, isLoading, error,
    setLogin, setPassword, setRepeatPassword, setFirstName, setLastName,
    selectRole, toggleCard, handleSubmit,
  };
}
