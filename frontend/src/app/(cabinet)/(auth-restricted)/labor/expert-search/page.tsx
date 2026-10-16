import { LaborResources } from "@/widgets/labor-resources";

/** Вкладка списка из ссылки. */
interface ExpertSearchPageProps {
  searchParams: Promise<{ tab?: string | string[] }>;
}

/** Показывает заявки организаций на поиск исполнителя и форму своей заявки. */
export default async function ExpertSearchPage({ searchParams }: ExpertSearchPageProps) {
  const params = await searchParams;
  const initialTab = params.tab === "mine" ? "mine" : "browse";

  return (
    <LaborResources
      kind="EXPERT_WANTED"
      initialTab={initialTab}
    />
  );
}
