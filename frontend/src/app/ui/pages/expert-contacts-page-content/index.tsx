"use client";

import type { ExpertContact } from "@/entities/expert-contact";
import { ExpertContacts } from "@/widgets/expert-contacts";
import { useAuthentication } from "../../../providers/authentication";

/** Серверный каталог публичной страницы и исполнитель из ссылки. */
interface ExpertContactsPageContentProps {
  initialExperts?: ExpertContact[];
  targetExpertId?: string;
}

/** Связывает каталог контактов с окном входа для покупки контактов гостем. */
export function ExpertContactsPageContent({
  initialExperts,
  targetExpertId,
}: ExpertContactsPageContentProps) {
  const { openLogin } = useAuthentication();

  return (
    <ExpertContacts
      initialExperts={initialExperts}
      targetExpertId={targetExpertId}
      onOpenLogin={openLogin}
    />
  );
}
