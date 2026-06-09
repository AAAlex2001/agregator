"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "@/source/features/session";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { loginUser } from "@/source/entities/session";
import { loginFormSchema, type LoginFormValues } from "./schema";
import {
  EmailNotVerifiedError,
  RoleChoiceRequiredError,
  type LoginResponse,
  type UserRole,
} from "./types";

const emptyValues: LoginFormValues = { email: "", password: "" };

interface PendingConfirm {
  email: string;
  role: UserRole | null;
}

export function useLogin() {
  const router = useRouter();
  const { reload } = useSession();
  const { showError } = useNotifications();
  const [fromOrder, setFromOrder] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<UserRole[] | null>(null);
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: emptyValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (sessionStorage.getItem("pendingOrderUuid")) {
      setFromOrder(true);
    }
  }, []);

  const finishLogin = async (user: LoginResponse) => {
    await reload();
    const pendingUuid = sessionStorage.getItem("pendingOrderUuid");
    if (user.role === "EXPERT" && pendingUuid) {
      sessionStorage.removeItem("pendingOrderUuid");
      router.push(`/order/${pendingUuid}`);
      return;
    }
    if (pendingUuid) {
      sessionStorage.removeItem("pendingOrderUuid");
      showError("Этот аккаунт зарегистрирован под другой ролью. Для отклика нужен аккаунт эксперта");
    }
    if (user.role === "EXPERT") router.push("/expert/orders");
    else if (user.role === "LICENSE_HOLDER") router.push("/settings");
    else router.push("/customer/orders");
  };

  const submitWithRole = async (values: LoginFormValues, role?: UserRole) => {
    try {
      const user = await loginUser({
        email: values.email.trim(),
        password: values.password,
        role,
      });
      await finishLogin(user);
    } catch (err) {
      if (err instanceof RoleChoiceRequiredError) {
        setAvailableRoles(err.availableRoles);
        return;
      }
      if (err instanceof EmailNotVerifiedError) {
        setPendingConfirm({ email: err.email, role: err.role });
        return;
      }
      showError(err instanceof Error ? err.message : "Произошла ошибка");
    }
  };

  const submit = form.handleSubmit(
    async (values) => {
      await submitWithRole(values);
    },
    (errors) => {
      const first = Object.values(errors)[0];
      if (first && "message" in first && typeof first.message === "string") {
        showError(first.message);
      }
    },
  );

  const chooseRole = async (role: UserRole) => {
    setIsFinalizing(true);
    try {
      await submitWithRole(form.getValues(), role);
    } finally {
      setIsFinalizing(false);
    }
  };

  const cancelRoleChoice = () => setAvailableRoles(null);
  const closeConfirm = () => setPendingConfirm(null);

  const handleConfirmed = async () => {
    setPendingConfirm(null);
    await reload();
    router.push("/settings");
  };

  return {
    form,
    fromOrder,
    isLoading: form.formState.isSubmitting,
    availableRoles,
    isFinalizing,
    pendingConfirm,
    chooseRole,
    cancelRoleChoice,
    closeConfirm,
    handleConfirmed,
    submit,
  };
}
