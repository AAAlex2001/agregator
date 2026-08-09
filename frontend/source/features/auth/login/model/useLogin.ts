"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/source/features/session";
import { useNotifications } from "@/source/shared/ui/Notifications";
import {
  EmailNotVerifiedError,
  RoleChoiceRequiredError,
  loginUser,
} from "@/source/entities/session";
import { PENDING_ORDER_UUID_KEY } from "@/source/entities/order";
import type { LoginResponse, UserRole } from "./types";

interface PendingConfirm {
  email: string;
  role: UserRole | null;
}

interface UseLoginOptions {
  /** Если задан — вызывается после успешного входа (напр. чтобы закрыть модалку). Редирект в кабинет/заказ выполняется как обычно. */
  onSuccess?: () => void;
}

export function useLogin(options?: UseLoginOptions) {
  const router = useRouter();
  const { reload } = useSession();
  const { showError } = useNotifications();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [fromOrder, setFromOrder] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<UserRole[] | null>(null);
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(PENDING_ORDER_UUID_KEY)) {
      setFromOrder(true);
    }
  }, []);

  const finishLogin = async (user: LoginResponse) => {
    await reload();
    options?.onSuccess?.();
    const pendingUuid = sessionStorage.getItem(PENDING_ORDER_UUID_KEY);
    if (user.role === "EXPERT" && pendingUuid) {
      sessionStorage.removeItem(PENDING_ORDER_UUID_KEY);
      router.push(`/order/${pendingUuid}`);
      return;
    }
    if (pendingUuid) {
      sessionStorage.removeItem(PENDING_ORDER_UUID_KEY);
      showError("Этот аккаунт зарегистрирован под другой ролью. Для отклика нужен аккаунт исполнителя");
    }
    if (user.role === "EXPERT") router.push("/expert/orders");
    else if (user.role === "LICENSE_HOLDER") router.push("/settings");
    else router.push("/customer/orders");
  };

  const submitWithRole = async (role?: UserRole) => {
    try {
      const user = await loginUser({ email: email.trim(), password, role });
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

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setWaiting(true);
    try {
      await submitWithRole();
    } finally {
      setWaiting(false);
    }
  };

  const chooseRole = async (role: UserRole) => {
    setIsFinalizing(true);
    try {
      await submitWithRole(role);
    } finally {
      setIsFinalizing(false);
    }
  };

  const cancelRoleChoice = () => setAvailableRoles(null);
  const closeConfirm = () => setPendingConfirm(null);

  const handleConfirmed = async () => {
    setPendingConfirm(null);
    await reload();
    options?.onSuccess?.();
    router.push("/settings");
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    fromOrder,
    waiting,
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
