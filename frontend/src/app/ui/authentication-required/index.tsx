"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/entities/user";
import { RetryUserProfile } from "@/features/retry-user-profile";

/** Содержимое кабинета, которое учитывает загрузку профиля. */
interface AuthenticationRequiredProps {
  children: ReactNode;
}

/** Отправляет гостя на главную, а при сбое профиля предлагает повторить загрузку. */
export function AuthenticationRequired({
  children,
}: AuthenticationRequiredProps) {
  const router = useRouter();
  const { user, role, isLoading, error } = useUser();
  const isGuest = !user && !isLoading && !error;

  useEffect(() => {
    if (isGuest) {
      router.replace("/");
    }
  }, [isGuest, router]);

  if (!user && error) {
    return <RetryUserProfile />;
  }

  if (!user && !role) {
    return null;
  }

  return children;
}
