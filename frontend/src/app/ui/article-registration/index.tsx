"use client";

import type { DirectionCode } from "@/entities/direction";
import type { UserRole } from "@/entities/user";
import { ArticleRegistration } from "@/widgets/articles";
import { useAuthentication } from "../../providers/authentication";

/** Открывает общее окно регистрации с выбором посетителя статьи. */
export function ArticleRegistrationEntry() {
  const { openRegistration } = useAuthentication();

  /** Передаёт выбранную роль и направление в начальные поля регистрации. */
  function register(role: UserRole, direction: DirectionCode) {
    openRegistration({
      role,
      direction,
    });
  }

  return (
    <ArticleRegistration onRegister={register} />
  );
}
