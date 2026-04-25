"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "@/source/features/session";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { loginUser } from "../api/login.api";
import { loginFormSchema, type LoginFormValues } from "./schema";

const emptyValues: LoginFormValues = { email: "", password: "" };

export function useLogin() {
  const router = useRouter();
  const { reload } = useSession();
  const { showError } = useNotifications();
  const [fromOrder, setFromOrder] = useState(false);

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

  const submit = form.handleSubmit(
    async (values) => {
      try {
        const user = await loginUser({ email: values.email.trim(), password: values.password });
        await reload();

        const pendingUuid = sessionStorage.getItem("pendingOrderUuid");
        if (user.role === "EXPERT" && pendingUuid) {
          sessionStorage.removeItem("pendingOrderUuid");
          router.push(`/order/${pendingUuid}`);
          return;
        }
        if (pendingUuid) {
          sessionStorage.removeItem("pendingOrderUuid");
          showError("Этот аккаунт зарегистрирован как заказчик. Для отклика нужен аккаунт эксперта");
          router.push("/customer/orders");
          return;
        }
        router.push(user.role === "CUSTOMER" ? "/customer/orders" : "/expert/orders");
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

  return {
    form,
    fromOrder,
    isLoading: form.formState.isSubmitting,
    submit,
  };
}
