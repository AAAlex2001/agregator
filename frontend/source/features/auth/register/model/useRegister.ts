"use client";

import { useReducer } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { formatRussianPhone } from "@/source/shared/lib/phone";
import { confirmRegistrationEmail, registerUser, toRegisterPayload } from "../api/register.api";
import {
  registerConfirmSchema,
  registerFormSchema,
  type RegisterConfirmValues,
  type RegisterFormValues,
} from "./schema";
import {
  initialRegisterWizardState,
  registerWizardReducer,
} from "./reducer";

const emptyFormValues: RegisterFormValues = {
  role: "CUSTOMER",
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  password: "",
  repeatPassword: "",
  agreePrivacy: false,
  agreeTerms: false,
};

export function useRegister() {
  const router = useRouter();
  const { showError, showSuccess } = useNotifications();
  const [wizard, dispatch] = useReducer(registerWizardReducer, initialRegisterWizardState);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: emptyFormValues,
    mode: "onBlur",
  });

  const confirmForm = useForm<RegisterConfirmValues>({
    resolver: zodResolver(registerConfirmSchema),
    defaultValues: { code: "" },
    mode: "onBlur",
  });

  const selectRole = (id: number) => {
    form.setValue("role", id === 1 ? "CUSTOMER" : "EXPERT");
    dispatch({ type: "SELECT_ROLE", payload: id });
  };

  const toggleCard = (id: number) => dispatch({ type: "TOGGLE_CARD", payload: id });
  const backToRoles = () => dispatch({ type: "BACK_TO_ROLES" });

  const submit = form.handleSubmit(
    async (values) => {
      if (!wizard.selectedRole) {
        showError("Выберите роль");
        return;
      }
      try {
        await registerUser(toRegisterPayload(values, wizard.selectedRole));
        dispatch({ type: "GO_TO_CONFIRM", payload: values.email.trim() });
      } catch (err) {
        showError(err instanceof Error ? err.message : "Произошла ошибка");
      }
    },
    (errors) => {
      const firstError = Object.values(errors)[0];
      if (firstError && "message" in firstError && typeof firstError.message === "string") {
        showError(firstError.message);
      }
    },
  );

  const confirmSubmit = confirmForm.handleSubmit(
    async (values) => {
      try {
        await confirmRegistrationEmail(wizard.pendingEmail, values.code);
        showSuccess("Почта подтверждена. Войдите в аккаунт");
        router.push("/login");
      } catch (err) {
        showError(err instanceof Error ? err.message : "Произошла ошибка");
      }
    },
    (errors) => {
      const first = Object.values(errors)[0];
      if (first && "message" in first && typeof first.message === "string") {
        showError(first.message);
      }
    },
  );

  const setPhone = (raw: string) => {
    form.setValue("phone", formatRussianPhone(raw), {
      shouldValidate: form.formState.isSubmitted,
    });
  };

  return {
    step: wizard.step,
    selectedRole: wizard.selectedRole,
    openedCardId: wizard.openedCardId,
    pendingEmail: wizard.pendingEmail,
    form,
    confirmForm,
    isLoading: form.formState.isSubmitting,
    isConfirmLoading: confirmForm.formState.isSubmitting,
    selectRole,
    toggleCard,
    backToRoles,
    submit,
    confirmSubmit,
    setPhone,
  };
}
