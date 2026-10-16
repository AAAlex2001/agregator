import { ExpertContactsPageContent } from "../../../../ui/pages/expert-contacts-page-content";

/** Исполнитель, к карточке которого ведёт ссылка с карты. */
interface PrivateExpertContactsPageProps {
  searchParams: Promise<{ expert?: string }>;
}

/** Показывает в кабинете каталог контактов, сделки и условия продажи своих контактов. */
export default async function PrivateExpertContactsPage({
  searchParams,
}: PrivateExpertContactsPageProps) {
  const { expert } = await searchParams;

  return <ExpertContactsPageContent targetExpertId={expert} />;
}
