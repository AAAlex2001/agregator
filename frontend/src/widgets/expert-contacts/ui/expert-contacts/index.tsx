"use client";

import { ExpertContactsProvider } from "@/entities/expert-contact";
import type { ExpertContact } from "@/entities/expert-contact";
import { useUser } from "@/entities/user";
import { ExpertContactsContent } from "../expert-contacts-content";

/** Серверный каталог для гостя, исполнитель из ссылки и вход для покупки контактов. */
interface ExpertContactsProps {
  initialExperts?: ExpertContact[];
  targetExpertId?: string;
  onOpenLogin: () => void;
}

/** Показывает раздел контактов; при смене аккаунта загружает его заново. */
export function ExpertContacts({
  initialExperts,
  targetExpertId,
  onOpenLogin,
}: ExpertContactsProps) {
  const { user, role } = useUser();

  return (
    <ExpertContactsProvider
      key={`${user?.id ?? "guest"}:${role ?? "guest"}`}
      initialExperts={initialExperts}
      withOffer={role === "EXPERT"}
    >
      <ExpertContactsContent
        targetExpertId={targetExpertId}
        onOpenLogin={onOpenLogin}
      />
    </ExpertContactsProvider>
  );
}
