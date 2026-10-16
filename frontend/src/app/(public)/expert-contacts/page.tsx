import { getExpertContactsOnServer } from "@/entities/expert-contact/server";
import { EXPERT_CONTACTS_METADATA } from "../../seo/expert-contacts";
import { ExpertContactsPageContent } from "../../ui/pages/expert-contacts-page-content";
import { PublicSiteShell } from "../../ui/shells/public-site-shell";

export const dynamic = "force-dynamic";
export const metadata = EXPERT_CONTACTS_METADATA;

/** Исполнитель, к карточке которого ведёт ссылка с карты. */
interface PublicExpertContactsPageProps {
  searchParams: Promise<{ expert?: string }>;
}

/** Показывает гостю серверный каталог, а вошедшего ведёт в версию кабинета. */
export default async function PublicExpertContactsPage({
  searchParams,
}: PublicExpertContactsPageProps) {
  const { expert } = await searchParams;
  const experts = await getExpertContactsOnServer();
  const cabinetPath = expert
    ? `/landing/expert-contacts?expert=${encodeURIComponent(expert)}`
    : "/landing/expert-contacts";

  return (
    <PublicSiteShell redirectTo={cabinetPath}>
      <ExpertContactsPageContent
        initialExperts={experts}
        targetExpertId={expert}
      />
    </PublicSiteShell>
  );
}
