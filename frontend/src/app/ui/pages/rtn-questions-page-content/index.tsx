"use client";

import { useUser } from "@/entities/user";
import { RtnQuestions } from "@/widgets/rtn";
import { useAuthentication } from "../../../providers/authentication";

/** Публичный маршрут или версия обращений внутри кабинета. */
interface RtnQuestionsPageContentProps {
  basePath: "" | "/landing";
}

/** Связывает обращения с авторизацией и сбрасывает личный список при смене аккаунта. */
export function RtnQuestionsPageContent({ basePath }: RtnQuestionsPageContentProps) {
  const { user, role } = useUser();
  const { openLogin, openRegistration } = useAuthentication();
  const authenticated = basePath === "/landing";
  const listKey = authenticated ? `${user?.id ?? "loading"}:${role}` : "public";

  /** Открывает регистрацию без предустановленной роли. */
  function register() {
    openRegistration();
  }

  return (
    <RtnQuestions
      key={listKey}
      basePath={basePath}
      authenticated={authenticated}
      onLogin={openLogin}
      onRegister={register}
    />
  );
}
