import { LaborResources } from "@/widgets/labor-resources";

/** Вкладка списка из ссылки. */
interface EmploymentPageProps {
  searchParams: Promise<{ tab?: string | string[] }>;
}

/** Показывает исполнителей, готовых к трудоустройству, и форму своей готовности. */
export default async function EmploymentPage({ searchParams }: EmploymentPageProps) {
  const params = await searchParams;
  const initialTab = params.tab === "mine" ? "mine" : "browse";

  return (
    <LaborResources
      kind="EXPERT_AVAILABLE"
      initialTab={initialTab}
    />
  );
}
